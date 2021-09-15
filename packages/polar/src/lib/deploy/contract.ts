import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { CosmWasmClient } from "secretjs";

import { PolarError } from "../../internal/core/errors";
import { ERRORS } from "../../internal/core/errors-list";
import {
  ARTIFACTS_DIR,
  SCHEMA_DIR
} from "../../internal/core/project-structure";
import { replaceAll } from "../../internal/util/strings";
import { compress } from "../../lib/deploy/compress";
import type {
  Account,
  AnyJson,
  Checkpoints,
  ContractFunction,
  DeployInfo,
  InstantiateInfo,
  PolarRuntimeEnvironment
} from "../../types";
import { loadCheckpoint, persistCheckpoint } from "../checkpoints";
import { ExecuteResult, getClient, getSigningClient } from "../client";
import { Abi, AbiParam } from "./abi";

function buildCall (
  contract: Contract,
  msgName: string,
  argNames: AbiParam[]
): ContractFunction<any> {
  return async function (
    ...args: any[]
  ): Promise<any> {
    if (args.length !== argNames.length) {
      console.error(`Invalid ${msgName} call. Argument count ${args.length}, expected ${argNames.length}`);
      return;
    }

    const msgArgs: any = {};
    argNames.forEach((abiParam, i) => {
      msgArgs[abiParam.name] = args[i];
    });

    // Query function
    return contract.queryMsg(msgName, msgArgs);
  };
}

function buildSend (
  contract: Contract,
  msgName: string,
  argNames: AbiParam[]
): ContractFunction<any> {
  return async function (
    ...args: any[]
  ): Promise<any> {
    if (args.length !== argNames.length + 1) {
      console.error(`Invalid ${msgName} call. Argument count ${args.length}, expected ${argNames.length + 1}`);
      return;
    }

    if (
      args[args.length - 1].address === undefined ||
      args[args.length - 1].name === undefined ||
      args[args.length - 1].mnemonic === undefined
    ) {
      console.error(`Invalid ${msgName} call. Last argument should be an account object.`);
      return;
    }

    const account: Account = (args[args.length - 1] as Account);

    const msgArgs: any = {};
    argNames.forEach((abiParam, i) => {
      msgArgs[abiParam.name] = args[i];
    });

    // Execute function (write)
    return contract.executeMsg(msgName, msgArgs, account);
  };
}

export class Contract {
  readonly contractName: string;
  readonly contractPath: string;
  readonly initSchemaPath: string;
  readonly querySchemaPath: string;
  readonly executeSchemaPath: string;
  readonly initAbi: Abi;
  readonly queryAbi: Abi;
  readonly executeAbi: Abi;
  readonly env: PolarRuntimeEnvironment;
  readonly client: CosmWasmClient;

  private codeId: number;
  private contractCodeHash: string;
  private contractAddress: string;
  private checkpointData: Checkpoints;
  private readonly checkpointPath: string;

  public query: {
    [name: string]: ContractFunction<any>
  };

  public tx: {
    [name: string]: ContractFunction<any>
  };

  constructor (contractName: string, env: PolarRuntimeEnvironment) {
    this.contractName = replaceAll(contractName, '-', '_');
    this.codeId = 0;
    this.contractCodeHash = "mock_hash";
    this.contractAddress = "mock_address";
    this.contractPath = path.join(ARTIFACTS_DIR, "contracts", `${this.contractName}_compressed.wasm`);

    this.initSchemaPath = path.join(SCHEMA_DIR, this.contractName, "init_msg.json");
    this.querySchemaPath = path.join(SCHEMA_DIR, this.contractName, "query_msg.json");
    this.executeSchemaPath = path.join(SCHEMA_DIR, this.contractName, "handle_msg.json");

    if (!fs.existsSync(this.initSchemaPath)) {
      console.log("Warning: Init schema not found for contract ", chalk.cyan(contractName));
    }
    if (!fs.existsSync(this.querySchemaPath)) {
      console.log("Warning: Query schema not found for contract ", chalk.cyan(contractName));
    }
    if (!fs.existsSync(this.executeSchemaPath)) {
      console.log("Warning: Execute schema not found for contract ", chalk.cyan(contractName));
    }

    const initSchemaJson: AnyJson = fs.readJsonSync(this.initSchemaPath);
    const querySchemaJson: AnyJson = fs.readJsonSync(this.querySchemaPath);
    const executeSchemaJson: AnyJson = fs.readJsonSync(this.executeSchemaPath);
    this.initAbi = new Abi(initSchemaJson);
    this.queryAbi = new Abi(querySchemaJson);
    this.executeAbi = new Abi(executeSchemaJson);

    this.query = {};
    this.tx = {};

    // Load checkpoints
    this.checkpointPath = path.join(ARTIFACTS_DIR, "checkpoints", `${this.contractName}.yaml`);
    // file exist load it else create new checkpoint
    if (fs.existsSync(this.checkpointPath)) {
      this.checkpointData = loadCheckpoint(this.checkpointPath);
      const contractHash = this.checkpointData[env.network.name].deployInfo?.contractCodeHash;
      const contractCodeId = this.checkpointData[env.network.name].deployInfo?.codeId;
      const contractAddr = this.checkpointData[env.network.name].instantiateInfo?.contractAddress;
      this.contractCodeHash = contractHash ?? "mock_hash";
      this.codeId = contractCodeId ?? 0;
      this.contractAddress = contractAddr ?? "mock_address";
    } else {
      this.checkpointData = {};
    }

    this.env = env;
    this.client = getClient(env.network);
  }

  async parseSchema (): Promise<void> {
    if (!fs.existsSync(this.querySchemaPath)) {
      throw new PolarError(ERRORS.ARTIFACTS.QUERY_SCHEMA_NOT_FOUND, {
        param: this.contractName
      });
    }
    if (!fs.existsSync(this.executeSchemaPath)) {
      throw new PolarError(ERRORS.ARTIFACTS.EXEC_SCHEMA_NOT_FOUND, {
        param: this.contractName
      });
    }
    await this.queryAbi.parseSchema();
    await this.executeAbi.parseSchema();

    for (const message of this.queryAbi.messages) {
      const msgName: string = message.identifier;
      const args: AbiParam[] = message.args;

      if (this.query[msgName] == null) {
        this.query[msgName] = buildCall(this, msgName, args);
      }
    }

    for (const message of this.executeAbi.messages) {
      const msgName: string = message.identifier;
      const args: AbiParam[] = message.args;

      if (this.tx[msgName] == null) {
        this.tx[msgName] = buildSend(this, msgName, args);
      }
    }
  }

  async deploy (account: Account): Promise<DeployInfo> {
    const info = this.checkpointData[this.env.network.name]?.deployInfo;
    if (info) {
      console.log("Warning: contract already deployed, using checkpoints");
      return info;
    }
    await compress(this.contractName);

    const wasmFileContent: Buffer = fs.readFileSync(this.contractPath);

    const signingClient = await getSigningClient(this.env.network, account);
    const uploadReceipt = await signingClient.upload(wasmFileContent, {});
    const codeId: number = uploadReceipt.codeId;
    const contractCodeHash: string =
      await signingClient.restClient.getCodeHashByCodeId(codeId);

    this.codeId = codeId;
    const deployInfo: DeployInfo = {
      codeId: codeId,
      contractCodeHash: contractCodeHash,
      deployTimestamp: String(new Date())
    };
    this.checkpointData[this.env.network.name] =
      { ...this.checkpointData[this.env.network.name], deployInfo };
    this.contractCodeHash = contractCodeHash;
    persistCheckpoint(this.checkpointPath, this.checkpointData);

    return deployInfo;
  }

  async instantiate (
    initArgs: object, // eslint-disable-line @typescript-eslint/ban-types
    label: string,
    account: Account
  ): Promise<InstantiateInfo> {
    if (this.contractCodeHash === "mock_hash") {
      throw new PolarError(ERRORS.GENERAL.CONTRACT_NOT_DEPLOYED, {
        param: this.contractName
      });
    }
    const info = this.checkpointData[this.env.network.name]?.instantiateInfo;
    if (info) {
      console.log("Warning: contract already instantiated, using checkpoints");
      return info;
    }
    const signingClient = await getSigningClient(this.env.network, (account));

    const contract = await signingClient.instantiate(this.codeId, initArgs, label);
    this.contractAddress = contract.contractAddress;

    const instantiateInfo: InstantiateInfo = {
      contractAddress: this.contractAddress,
      instantiateTimestamp: String(new Date())
    };

    this.checkpointData[this.env.network.name] =
      { ...this.checkpointData[this.env.network.name], instantiateInfo };
    persistCheckpoint(this.checkpointPath, this.checkpointData);
    return instantiateInfo;
  }

  async queryMsg (
    methodName: string,
    callArgs: object // eslint-disable-line @typescript-eslint/ban-types
  ): Promise<any> {
    if (this.contractAddress === "mock_address") {
      throw new PolarError(ERRORS.GENERAL.CONTRACT_NOT_INSTANTIATED, {
        param: this.contractName
      });
    }
    // Query the contract
    console.log('Querying contract for ', methodName);
    const msgData: { [key: string]: object } = {}; // eslint-disable-line @typescript-eslint/ban-types
    msgData[methodName] = callArgs;
    console.log(this.contractAddress, msgData);
    return await this.client.queryContractSmart(this.contractAddress, msgData);
  }

  async executeMsg (
    methodName: string,
    callArgs: object, // eslint-disable-line @typescript-eslint/ban-types
    account: Account
  ): Promise<ExecuteResult> {
    if (this.contractAddress === "mock_address") {
      throw new PolarError(ERRORS.GENERAL.CONTRACT_NOT_INSTANTIATED, {
        param: this.contractName
      });
    }
    // Send execute msg to the contract
    const signingClient = await getSigningClient(this.env.network, (account));

    const msgData: { [key: string]: object } = {}; // eslint-disable-line @typescript-eslint/ban-types
    msgData[methodName] = callArgs;
    console.log(this.contractAddress, msgData);
    // Send the same handleMsg to increment multiple times
    return await signingClient.execute(
      this.contractAddress,
      msgData
    );
  }
}
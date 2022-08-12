import { CosmWasmClient, MigrateResult } from "@cosmjs/cosmwasm-stargate";
import fs from "fs-extra";
import path from "path";

import { JunokitContext } from "../../internal/context";
import { JunokitError } from "../../internal/core/errors";
import { ERRORS } from "../../internal/core/errors-list";
import {
  ARTIFACTS_DIR
} from "../../internal/core/project-structure";
import { replaceAll } from "../../internal/util/strings";
import { compress } from "../../lib/deploy/compress";
import type {
  Account,
  Checkpoints,
  Coin,
  DeployInfo,
  InstantiateInfo,
  JunokitRuntimeEnvironment,
  TxnStdFee,
  UserAccount
} from "../../types";
import { loadCheckpoint, persistCheckpoint } from "../checkpoints";
import { ExecuteResult, getClient, getSigningClient } from "../client";
import { defaultFees } from "../contants";

export interface ExecArgs {
  account: Account | UserAccount
  transferAmount: readonly Coin[] | undefined
  customFees: TxnStdFee | undefined
}

export class Contract {
  readonly contractName: string;
  readonly contractPath: string;

  private readonly env: JunokitRuntimeEnvironment =
  JunokitContext.getJunokitContext().getRuntimeEnv();

  private client?: CosmWasmClient;

  public codeId: number;
  // public contractCodeHash: string;
  public contractAddress: string;
  private checkpointData: Checkpoints;
  private readonly checkpointPath: string;

  constructor (contractName: string) {
    this.contractName = replaceAll(contractName, '-', '_');
    this.codeId = 0;
    // this.contractCodeHash = "mock_hash";
    this.contractAddress = "mock_address";
    this.contractPath = path.join(ARTIFACTS_DIR, "contracts", `${this.contractName}_compressed.wasm`);

    // Load checkpoints
    this.checkpointPath = path.join(ARTIFACTS_DIR, "checkpoints", `${this.contractName}.yaml`);
    // file exist load it else create new checkpoint
    // skip checkpoints if test command is run, or skip-checkpoints is passed
    if (fs.existsSync(this.checkpointPath) &&
      this.env.runtimeArgs.useCheckpoints === true) {
      this.checkpointData = loadCheckpoint(this.checkpointPath);
      const contractCodeId = this.checkpointData[this.env.network.name].deployInfo?.codeId;
      const contractAddr =
        this.checkpointData[this.env.network.name].instantiateInfo?.contractAddress;
      this.codeId = contractCodeId ?? 0;
      this.contractAddress = contractAddr ?? "mock_address";
    } else {
      this.checkpointData = {};
    }
  }

  async setUpclient (): Promise<void> {
    this.client = await getClient(this.env.network);
  }

  async deploy (
    account: Account | UserAccount,
    customFees?: TxnStdFee
  ): Promise<DeployInfo> {
    const accountVal: Account = (account as UserAccount).account !== undefined
      ? (account as UserAccount).account : (account as Account);
    // custom fee from junokit.config.js handled here as not in cosmjs client
    const customFeesVal: TxnStdFee | undefined = customFees !== undefined
      ? customFees : this.env.network.config.fees?.upload;
    const info = this.checkpointData[this.env.network.name]?.deployInfo;
    if (info) {
      console.log("Warning: contract already deployed, using checkpoints");
      return info;
    }
    await compress(this.contractName);

    const wasmFileContent = fs.readFileSync(this.contractPath);

    const signingClient = await getSigningClient(this.env.network, accountVal);
    const uploadReceipt = await signingClient.upload(
      accountVal.address,
      wasmFileContent,
      customFeesVal ?? defaultFees.upload,
      "this is upload"
    );
    const codeId: number = uploadReceipt.codeId;

    this.codeId = codeId;
    const deployInfo: DeployInfo = {
      codeId: codeId,
      deployTimestamp: String(new Date())
    };

    if (this.env.runtimeArgs.useCheckpoints === true) {
      this.checkpointData[this.env.network.name] =
        { ...this.checkpointData[this.env.network.name], deployInfo };
      persistCheckpoint(this.checkpointPath, this.checkpointData);
    }
    return deployInfo;
  }

  instantiatedWithAddress (
    address: string,
    timestamp?: Date | undefined
  ): void {
    const initTimestamp = (timestamp !== undefined) ? String(timestamp) : String(new Date());

    // contract address already exists
    if (this.contractAddress !== "mock_address") {
      console.log(
        `Contract ${this.contractName} already has address: ${this.contractAddress}, skipping`
      );
      return;
    } else {
      this.contractAddress = address;
    }

    const instantiateInfo: InstantiateInfo = {
      contractAddress: address,
      instantiateTimestamp: initTimestamp
    };

    // set init data (contract address, init timestamp) in checkpoints
    this.checkpointData[this.env.network.name] =
      { ...this.checkpointData[this.env.network.name], instantiateInfo };
    persistCheckpoint(this.checkpointPath, this.checkpointData);
  }

  async instantiate (
    initArgs: Record<string, unknown>,
    label: string,
    account: Account | UserAccount,
    transferAmount?: readonly Coin[],
    customFees?: TxnStdFee,
    contractAdmin?: string | undefined
  ): Promise<InstantiateInfo> {
    const accountVal: Account = (account as UserAccount).account !== undefined
      ? (account as UserAccount).account : (account as Account);
    // custom fee from junokit.config.js handled here as not in cosmjs client
    const customFeesVal: TxnStdFee | undefined = customFees !== undefined
      ? customFees : this.env.network.config.fees?.init;
    const info = this.checkpointData[this.env.network.name]?.instantiateInfo;
    if (info) {
      console.log("Warning: contract already instantiated, using checkpoints");
      return info;
    }
    const signingClient = await getSigningClient(this.env.network, accountVal);
    const initTimestamp = String(new Date());
    label = (this.env.runtimeArgs.command === "test")
      ? `deploy ${this.contractName} ${initTimestamp}` : label;
    console.log(`Instantiating with label: ${label}`);
    const contract = await signingClient.instantiate(
      accountVal.address,
      this.codeId,
      initArgs,
      label,
      customFeesVal ?? defaultFees.init,
      {
        funds: transferAmount,
        admin: contractAdmin
      }
    );
    this.contractAddress = contract.contractAddress;

    const instantiateInfo: InstantiateInfo = {
      contractAddress: this.contractAddress,
      instantiateTimestamp: initTimestamp
    };

    if (this.env.runtimeArgs.useCheckpoints === true) {
      this.checkpointData[this.env.network.name] =
        { ...this.checkpointData[this.env.network.name], instantiateInfo };
      persistCheckpoint(this.checkpointPath, this.checkpointData);
    }
    return instantiateInfo;
  }

  async queryMsg (
    msgData: Record<string, unknown>
  ): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
    if (this.contractAddress === "mock_address") {
      throw new JunokitError(ERRORS.GENERAL.CONTRACT_NOT_INSTANTIATED, {
        param: this.contractName
      });
    }
    // Query the contract
    console.log('Querying', this.contractAddress, '=>', Object.keys(msgData)[0]);
    // const msgData: { [key: string]: Record<string, unknown> } = {};
    // msgData[methodName] = callArgs;
    console.log(this.contractAddress, msgData);
    return await this.client?.queryContractSmart(this.contractAddress, msgData);
  }

  async executeMsg (
    msgData: Record<string, unknown>,
    account: Account | UserAccount,
    customFees?: TxnStdFee,
    memo?: string,
    transferAmount?: readonly Coin[]
  ): Promise<ExecuteResult> {
    const accountVal: Account = (account as UserAccount).account !== undefined
      ? (account as UserAccount).account : (account as Account);
    // custom fee from junokit.config.js handled here as not in cosmjs client
    const customFeesVal: TxnStdFee | undefined = customFees !== undefined
      ? customFees : this.env.network.config.fees?.exec;
    if (this.contractAddress === "mock_address") {
      throw new JunokitError(ERRORS.GENERAL.CONTRACT_NOT_INSTANTIATED, {
        param: this.contractName
      });
    }
    // Send execute msg to the contract
    const signingClient = await getSigningClient(this.env.network, accountVal);

    // const msgData: { [key: string]: Record<string, unknown> } = {};
    // msgData[methodName] = callArgs;
    console.log('Executing', this.contractAddress, '=>', Object.keys(msgData)[0]);
    // Send the same handleMsg to increment multiple times
    return await signingClient.execute(
      accountVal.address,
      this.contractAddress,
      msgData,
      customFeesVal ?? defaultFees.exec,
      memo === undefined ? "executing" : memo,
      transferAmount
    );
  }

  async migrate (
    msgData: Record<string, unknown>,
    newCodeId: number,
    account: Account | UserAccount,
    customFees?: TxnStdFee,
    memo?: string
  ): Promise<MigrateResult> {
    const accountVal: Account = (account as UserAccount).account !== undefined
      ? (account as UserAccount).account : (account as Account);
    // custom fee from junokit.config.js handled here as not in cosmjs client
    const customFeesVal: TxnStdFee | undefined = customFees !== undefined
      ? customFees : this.env.network.config.fees?.exec;
    if (this.contractAddress === "mock_address") {
      throw new JunokitError(ERRORS.GENERAL.CONTRACT_NOT_INSTANTIATED, {
        param: this.contractName
      });
    }
    // Send migrate msg to the contract
    const signingClient = await getSigningClient(this.env.network, accountVal);

    // TODO: if migration passes, update codeId of contract and checkpoints

    // const msgData: { [key: string]: Record<string, unknown> } = {};
    // msgData[methodName] = callArgs;
    console.log('Migrating', this.contractAddress, '=>', msgData);
    // Send the same handleMsg to increment multiple times
    return await signingClient.migrate(
      accountVal.address,
      this.contractAddress,
      newCodeId,
      msgData,
      customFeesVal ?? defaultFees.exec,
      memo === undefined ? "migrating" : memo
    );
  }
}

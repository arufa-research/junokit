import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { JunokitContext } from "../../internal/context";
import { JunokitError } from "../../internal/core/errors";
import { ERRORS } from "../../internal/core/errors-list";
import { replaceAll } from "../../internal/util/strings";
import type {
  Account,
  Coin,
  ExternalContractsConfig,
  JunokitRuntimeEnvironment,
  StdFee,
  UserAccount
} from "../../types";
import { ExecuteResult, getClient, getSigningClient } from "../client";
import { defaultFees, defaultFeesMainnet } from "../constants";

export interface ExecArgs {
  account: Account | UserAccount
  transferAmount: readonly Coin[] | undefined
  customFees: StdFee | undefined
}

export class ExternalContract {
  readonly contractName: string;

  private readonly env: JunokitRuntimeEnvironment =
  JunokitContext.getJunokitContext().getRuntimeEnv();

  private client?: CosmWasmClient;
  private contractDefaultFee = defaultFees;

  public contractAddress: string;

  constructor (contractName: string) {
    this.contractName = replaceAll(contractName, '-', '_');

    // fetch junokit config from env
    const externalContracts = (this.env.config.external_contracts as ExternalContractsConfig);

    // check and use the address from the config for current network
    if (externalContracts === undefined) {
      // raise error that external contract config is NOT in config
      throw new JunokitError(ERRORS.GENERAL.EXT_CONTRACT_CONFIG_NOT_FOUND, {
        contractName: this.contractName
      });
    }
    if (!(this.contractName in externalContracts)) {
      // raise error that contract is NOT in config
      throw new JunokitError(ERRORS.GENERAL.EXT_CONTRACT_NOT_FOUND, {
        contractName: this.contractName
      });
    }
    if (!(this.env.network.name in externalContracts[this.contractName])) {
      // raise error that network is NOT in netwrok config
      throw new JunokitError(ERRORS.GENERAL.EXT_CONTRACT_NETWORK_NOT_FOUND, {
        networkName: this.env.network.name,
        contractName: this.contractName
      });
    }

    // check if contractAddress is of proper format
    if (externalContracts[this.contractName][this.env.network.name].length !== 63 ||
      externalContracts[this.contractName][this.env.network.name].slice(0, 4) !== "juno") {
      // raise error that contract addess is NOT correct
      throw new JunokitError(ERRORS.GENERAL.EXT_CONTRACT_ADDR_INCORRECT, {
        contractName: this.contractName
      });
    }

    // store the address of contract in the class
    this.contractAddress = externalContracts[this.contractName][this.env.network.name];
  }

  async setUpclient (): Promise<void> {
    this.client = await getClient(this.env.network);

    const chainId = await this.client.getChainId();
    if (chainId === "juno-1") { // mainnet
      this.contractDefaultFee = defaultFeesMainnet;
    }
  }

  async query (
    methodName: string,
    callArgs: Record<string, unknown>
  ): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
    // Query the contract
    // console.log('Querying contract for', methodName);
    const msgData: { [key: string]: Record<string, unknown> } = {};
    msgData[methodName] = callArgs;
    console.log(this.contractAddress, msgData);
    return await this.client?.queryContractSmart(this.contractAddress, msgData);
  }

  async execute (
    methodName: string,
    { account, transferAmount, customFees }: ExecArgs,
    callArgs: Record<string, unknown>
  ): Promise<ExecuteResult> {
    const accountVal: Account = (account as UserAccount).account !== undefined
      ? (account as UserAccount).account : (account as Account);
    // Send execute msg to the contract
    const signingClient = await getSigningClient(this.env.network, accountVal);

    const msgData: { [key: string]: Record<string, unknown> } = {};
    msgData[methodName] = callArgs;
    console.log(this.contractAddress, msgData);
    // Send the same handleMsg to increment multiple times
    return await signingClient.execute(
      accountVal.address,
      this.contractAddress,
      msgData,
      customFees ?? this.contractDefaultFee.exec,
      "executing",
      transferAmount
    );
  }
}

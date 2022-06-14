import { Pubkey } from "@cosmjs/amino";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Account as WasmAccount } from "@cosmjs/stargate";

import { JunokitContext } from "../internal/context";
import { TrestleError } from "../internal/core/errors";
import { ERRORS } from "../internal/core/errors-list";
import { Account, Coin, Network, TrestleRuntimeEnvironment, UserAccount } from "../types";
import { getClient } from "./client";

// TODO: Throw error if client is not initialized
export class UserAccountI implements UserAccount {
  account: Account;
  client?: CosmWasmClient;
  network: Network;

  constructor (account: Account, env: TrestleRuntimeEnvironment) {
    this.account = account;
    this.network = env.network;
  }

  async setupClient (): Promise<void> {
    this.client = await getClient(this.network);
  }

  async getAccountInfo (): Promise<WasmAccount | undefined | null> {
    return await this.client?.getAccount(this.account.address);
  }

  async getBalance (searchDenom: string): Promise<Coin> {
    const info = await this.client?.getBalance(this.account.address, searchDenom);
    if (info === undefined) {
      throw new TrestleError(ERRORS.GENERAL.BALANCE_UNDEFINED);
    }
    return info;
  }

  async getPublicKey (): Promise<Pubkey | undefined | null> {
    const info = await this.client?.getAccount(this.account.address);
    return info?.pubkey;
  }

  async getAccountNumber (): Promise<number | undefined> {
    const info = await this.client?.getAccount(this.account.address);
    return info?.accountNumber;
  }

  async getSequence (): Promise<number | undefined> {
    const info = await this.client?.getAccount(this.account.address);
    return info?.sequence;
  }
}

export function getAccountByName (
  name: string
): (Account | UserAccount) {
  const env: TrestleRuntimeEnvironment = JunokitContext.getJunokitContext().getRuntimeEnv();
  if (env.network.config.accounts === undefined) {
    throw new TrestleError(ERRORS.GENERAL.ACCOUNT_DOES_NOT_EXIST, { name: name });
  }
  for (const value of env.network.config.accounts) {
    if (value.name === name) {
      return new UserAccountI(value, env);
    }
  }
  throw new TrestleError(ERRORS.GENERAL.ACCOUNT_DOES_NOT_EXIST, { name: name });
}

import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from "@cosmjs/proto-signing";

import { JunokitError } from "../internal/core/errors";
import { ERRORS } from "../internal/core/errors-list";
import { Account, Network } from "../types";

export async function getClient (network: Network): Promise<CosmWasmClient> {
  return await CosmWasmClient.connect(network.config.endpoint);
}

// TODO: Check hdPaths
export async function getSigningClient (
  network: Network,
  account: Account
): Promise<SigningCosmWasmClient> {
  // Check address prefix and create wallet accordingly
  let wallet;

  if (account.address.startsWith("inj")) {
    wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: "inj"
    });
  } else if (account.address.startsWith("juno")) {
    wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: "juno"
    });
  } else {
    throw new JunokitError(ERRORS.GENERAL.UNKNOWN_ADDRESS_PREFIX, { prefix: account.address });
  }

  return await SigningCosmWasmClient.connectWithSigner(
    network.config.endpoint,
    wallet
  );
}

export { ExecuteResult };

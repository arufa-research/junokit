import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from "@cosmjs/proto-signing";

import { Account, Network } from "../types";

export async function getClient (network: Network): Promise<CosmWasmClient> {
  return await CosmWasmClient.connect(network.config.endpoint);
}

// TODO: Check hdPaths
export async function getSigningClient (
  network: Network,
  account: Account
): Promise<SigningCosmWasmClient> {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: "juno"
  });

  return await SigningCosmWasmClient.connectWithSigner(
    network.config.endpoint,
    wallet
  );
}

export { ExecuteResult };

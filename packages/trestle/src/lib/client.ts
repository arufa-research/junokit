
import { ExecuteResult,CosmWasmClient,SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import amino_1 from "@cosmjs/amino";
import { Account, Network } from "../types";

export  async function getClient (network: Network):Promise<CosmWasmClient> {
  const client = await CosmWasmClient.connect(network.config.endpoint)
  return client
}

export async function getSigningClient (
  network: Network,
  account: Account
): Promise<SigningCosmWasmClient> {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic,  { bip39Password: "",
  hdPaths: [( 0 , amino_1.makeCosmoshubPath)(0)],
  prefix: "juno",});
  
  return  await SigningCosmWasmClient.connectWithSigner(
    network.config.endpoint,
    wallet
  );
}

export {ExecuteResult};

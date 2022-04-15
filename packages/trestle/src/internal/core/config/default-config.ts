import type { Config, TrestleNetworkUserConfig } from "../../../types";
const SCRT_CHAIN_NAME = "testnet";

const cfg: TrestleNetworkUserConfig = {
  accounts: [],
  endpoint: SCRT_CHAIN_NAME
};

const defaultConfig: Config = {
  networks: {
    [SCRT_CHAIN_NAME]: cfg
  },
  mocha: {
    timeout: 20000
  }
};

export default defaultConfig;

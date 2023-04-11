export interface TokenInfo {
  name: string;
  denom: string;
  display_denom: string;
  description: string;
  contract_addr: string | null;
  contract_code_hash: string | null;
  native_denom: string | null;
  coingecko_id: string;
  decimals: number;
  logo_URIs: {
    png: string;
    svg: string;
  };
  ibc?: {
    src_chain_id: string;
    src_channel: string;
    scrt_channel: string;
    denom: string;
    scrt_denom: string;
    snip_addr: string;
    snip_code_hash: string;
  };
}

export interface AssetsInfo {
  assets: Array<TokenInfo>;
}

export interface ChainInfo {
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  };
  bip44: {
    coinType: number;
  };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  }[];
  feeCurrencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  }[];
  coinType: number;
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
  features: Array<string>;
}

export interface PoolInfo {
  pair_name: string;
  asset_infos: Array<string>;
  contract_addr: string;
  contract_code_hash: string;
  liquidity_token: string;
  liquidity_token_hash: string;
  pair_type: string;
}

export interface contractInfo {
  contract_addr: string;
  contract_code_hash: string;
}

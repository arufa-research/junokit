const testnet_accounts = [
  {
    name: 'account_0',
    address: 'juno1evpfprq0mre5n0zysj6cf74xl6psk96gus7dp5',
    mnemonic: 'omit sphere nurse rib tribe suffer web account catch brain hybrid zero act gold coral shell voyage matter nose stick crucial fog judge text'
  },
  {
    name: 'account_1',
    address: 'juno1njamu5g4n0vahggrxn4ma2s4vws5x4w3u64z8h',
    mnemonic: 'student prison fresh dwarf ecology birth govern river tissue wreck hope autumn basic trust divert dismiss buzz play pistol focus long armed flag bicycle'
  }
];

const localnet_accounts = [
  {
    name: 'account_0',
    address: 'juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y',
    mnemonic: 'clip hire initial neck maid actor venue client foam budget lock catalog sweet steak waste crater broccoli pipe steak sister coyote moment obvious choose'
  }
];

const mainnet_accounts = [
];

const networks = {
  localnet: {
    endpoint: 'http://localhost:26657/',
    accounts: localnet_accounts
  },
  // uni-2
  testnet: {
    endpoint: 'https://rpc.uni.juno.deuslabs.fi/',
    chainId: 'uni-3',
    trustNode: true,
    keyringBackend: 'test',
    accounts: testnet_accounts
  },
  mainnet: {
    endpoint: 'https://rpc-juno.itastakers.com/',
    chainId: 'juno-1',
    trustNode: true,
    keyringBackend: 'test',
    accounts: mainnet_accounts
  }
};

module.exports = {
  networks: {
    default: networks.testnet,
    localnet: networks.localnet,
    mainnet: networks.mainnet,
  },
  mocha: {
    timeout: 60000
  },
  rust: {
    version: "1.60.0",
  }
};
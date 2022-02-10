const accounts = [
  {
    name: 'account_0',
    address: 'juno1evpfprq0mre5n0zysj6cf74xl6psk96gus7dp5',
    mnemonic: 'omit sphere nurse rib tribe suffer web account catch brain hybrid zero act gold coral shell voyage matter nose stick crucial fog judge text'
  },
  {
    name: 'account_1',
    address: '',
    mnemonic: ''
  }
];

const networks = {
  localnet: {
    endpoint: 'http://localhost:1337/'
  },
  // uni-2
  testnet: {
    endpoint: 'https://rpc.uni.junonetwork.io/',
    chainId: 'uni-2',
    trustNode: true,
    keyringBackend: 'test',
    accounts: accounts,
  },
  development: {
    endpoint: 'tcp://0.0.0.0:26656',
    nodeId: '115aa0a629f5d70dd1d464bc7e42799e00f4edae',
    chainId: 'enigma-pub-testnet-3',
    keyringBackend: 'test',
    types: {}
  },
  // Supernova Testnet
  supernova: {
    endpoint: 'http://bootstrap.supernova.enigma.co:1317',
    chainId: 'supernova-2',
    trustNode: true,
    keyringBackend: 'test',
    accounts: accounts,
    types: {},
    fees: {
      upload: {
          amount: [{ amount: "500000", denom: "uscrt" }],
          gas: "2000000",
      },
      init: {
          amount: [{ amount: "125000", denom: "uscrt" }],
          gas: "500000",
      },
    }
  }
};

module.exports = {
  networks: {
    default: networks.testnet,
    localnet: networks.localnet,
    development: networks.development
  },
  mocha: {
    timeout: 60000
  },
  rust: {
    version: "1.55.0",
  }
};

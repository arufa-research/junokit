module.exports = {
  networks: {
    default: {
      endpoint: 'http://localhost:1337/'
    },
    development: {
      endpoint: 'tcp://0.0.0.0:26656',
      nodeId: '115aa0a629f5d70dd1d464bc7e42799e00f4edae',
      chainId: 'enigma-pub-testnet-3',
      keyringBackend: 'test',
      types: {}
    },
    // Holodeck Testnet
    testnet: {
      endpoint: 'http://bootstrap.junotestnet.io:26657',
      chainId: 'uni-2',
      trustNode: true,
      keyringBackend: 'test',
      accounts: ['a', 'b'],
      types: {}
    }
  },
  mocha: {
    timeout: 60000
  }
};

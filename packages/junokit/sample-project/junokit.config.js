const accounts = [
  {
    name: 'account_0',
    address: 'juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y',
    mnemonic: 'clip hire initial neck maid actor venue client foam budget lock catalog sweet steak waste crater broccoli pipe steak sister coyote moment obvious choose'
  },
  {
    name: 'account_1',
    address: 'juno1njamu5g4n0vahggrxn4ma2s4vws5x4w3u64z8h',
    mnemonic: 'student prison fresh dwarf ecology birth govern river tissue wreck hope autumn basic trust divert dismiss buzz play pistol focus long armed flag bicycle'
  }
];

const networks = {
  localnet: {
    endpoint: 'http://localhost:26657/',
    accounts: accounts
  },
  // uni-2
  testnet: {
    endpoint: 'https://rpc.uni.juno.deuslabs.fi/',//https://lcd.uni.juno.deuslabs.fi/
    chainId: 'uni-2',
    trustNode: true,
    keyringBackend: 'test',
    accounts: accounts,
    fees: {
      upload: {
          amount: [{ amount: "500000", denom: "ujunox" }],
          gas: "4000000",
      },
      init: {
          amount: [{ amount: "125000", denom: "ujunox" }],
          gas: "500000",
      },
      exec: {
        amount: [{ amount: "125000", denom: "ujunox" }],
        gas: "500000",
      },
    }
  },
};

module.exports = {
  networks: {
    default: networks.testnet,
    localnet: networks.localnet,
  },
  mocha: {
    timeout: 60000,
    require: ["ts-node/require"]
  },
  rust: {
    version: "1.59.0",
  }
};

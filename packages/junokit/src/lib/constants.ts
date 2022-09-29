export const JUNOKIT_NAME = "junokit";

// map fees struct with chain id
// mainnet => juno-1 => defaultFeesMainnet
// else => defaultFees

export const defaultFees = {
  upload: {
    amount: [{ amount: "2000000", denom: "ujunox" }],
    gas: "20000000"
  },

  init: {
    amount: [{ amount: "300000", denom: "ujunox" }],
    gas: "500000"
  },

  exec: {
    amount: [{ amount: "300000", denom: "ujunox" }],
    gas: "500000"
  },

  send: {
    amount: [{ amount: "80000", denom: "ujunox" }],
    gas: "80000"
  }
};

export const defaultFeesMainnet = {
  upload: {
    amount: [{ amount: "2000000", denom: "ujuno" }],
    gas: "20000000"
  },

  init: {
    amount: [{ amount: "300000", denom: "ujuno" }],
    gas: "500000"
  },

  exec: {
    amount: [{ amount: "300000", denom: "ujuno" }],
    gas: "500000"
  },

  send: {
    amount: [{ amount: "80000", denom: "ujuno" }],
    gas: "80000"
  }
};

export const JUNOKIT_NAME = "junokit";

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

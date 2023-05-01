
export const networkConstants: Record<string, any> = {
  JunoMainnet: {
    baseDenom: "ujuno",
    baseSymbol: "JUNO",
    networkType: "Mainnet",
    mintscanPrefix: "https://mintscan.io/juno/txs/",

    defaultGas: {
      native_swap: "225000",
      snip_swap: "255000",
      add_liquidity: "265000",
      remove_liquidity: "225000",
      ibc_deposit: "95000",
      ibc_withdraw: "95000",
      snip_transfer: "55000",
      snip_send: "75000",
      snip_allowance: "55000",
      create_viewing_key: "55000",
      native_transfer: "25000",
    },

    VALIDATORS: {
      "junovaloper1dru5985k4n5q369rxeqfdsjl8ezutch8mc6nx9": "Highlander | ChainTools",
      "junovaloper196ax4vc0lwpxndu9dyhvca7jhxp70rmcqcnylw": "SG-1",
      "junovaloper194v8uwee2fvs2s8fa5k7j03ktwc87h5ym39jfv": "Disperze",
      "junovaloper10wxn2lv29yqnw2uf4jf439kwy5ef00qdelfp7r": "kingnodes 👑",
      "junovaloper1wd02ktcvpananlvd9u6jm3x3ap3vmw59jv9vez": "Lavender.Five Nodes 🐝",
      "junovaloper193xl2tqh2tjkld2zv49ku5s44ee4qmgr65jcep": "WhisperNOde",
      "junovaloper1xwazl8ftks4gn00y5x3c47auquc62ssuvynw64": "jabbey",
      "junovaloper17skjxhtt54prnpxcs7a5rv9znlldpe5k3x99gp": "DEUS LABS",
      "junovaloper10y7ucn6jhjtakwchgpw32y0tgaku6yn255z7gm": "Golden Ratio Staking",
      "junovaloper1gp957czryfgyvxwn3tfnyy2f0t9g2p4pvzc6k3": "polkachu.com",
      "junovaloper1zxx8j75ngm8m38v9l5wreaavwnsuun7gcq5cu8": "CommunityStaking",
      "junovaloper1hx9yj7qgnp8zhkrqfanvz74mcsg9d8eyskvsxg": "Stakely.io",
      "junovaloper1gr56uqre7dsqjkknssne7rc9wunsk08gmh3c7h": "Don Cryptonium",
      "junovaloper16s96n9k9zztdgjy8q4qcxp4hn7ww98qk0du5jq": "Oni ⛩️",
    },

    denomConst: {
      tokenSymbol: 'JUNO',
      seTokenSymbol: 'seJUNO',
      bTokenSymbol: 'bJUNO',
      tokenDenom: 'ujuno',
      seTokenDenom: 'sejuno',
      bTokenDenom: 'bjuno'
    }
  },
  JunoTestnet: {

  },
  InjectiveTestnet: {
    baseDenom: "uinj",
    baseSymbol: "INJ",
    networkType: "Testnet",
    mintscanPrefix: "https://mintscan.io/injective/txs/",

    defaultGas: {
      native_swap: "225000",
      snip_swap: "255000",
      add_liquidity: "265000",
      remove_liquidity: "225000",
      ibc_deposit: "95000",
      ibc_withdraw: "95000",
      snip_transfer: "55000",
      snip_send: "75000",
      snip_allowance: "55000",
      create_viewing_key: "55000",
      native_transfer: "25000",
    },

    VALIDATORS: {
      "injvalcons156wnzfr0kul2ftuqwz6339fafv9a3jnr03v25d": "SG-1",
      "injvalcons1xml3ew93xmjtuf5zwpcl9jzznphte30hvdre9a": "SG-1",
      "injvalcons1xwg7xkmpqp8q804c37sa4dzyfwgnh4a74ll9pz": "SG-1",
      "injvalcons18x63wcw5hjxlf535lgn4qy20yer7mm0qedu0la": "SG-1"
    },

    denomConst: {
      tokenSymbol: 'INJ',
      seTokenSymbol: 'seINJ',
      bTokenSymbol: 'bINJ',
      tokenDenom: 'uinj',
      seTokenDenom: 'seinj',
      bTokenDenom: 'binj'
    }
  }
}

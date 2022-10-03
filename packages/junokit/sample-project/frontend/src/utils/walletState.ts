import { atom } from 'recoil';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

export const walletState = atom<{
  client: SigningCosmWasmClient | undefined
  address: string | undefined
  shortAddress: string | undefined
  balance: string | undefined
}>({
  key: 'walletState',
  default: {
    client: undefined,
    address: undefined,
    shortAddress: undefined,
    balance: undefined,
  },
  dangerouslyAllowMutability: true,
})

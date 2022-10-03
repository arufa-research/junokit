import { chainInfo } from '../utils/chainInfo';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useSetRecoilState } from 'recoil';
import { walletState } from '../utils/walletState';
import { coinConvert } from '@stakeordie/griptape.js';

import { API_URL } from "../constants/constants";

export const useConnectWallet = () => {
  const setWalletState = useSetRecoilState(walletState);
  return async () => {
    // await sleep(1);
    console.log(
      "We are heree!"
    );
    await (window as any).keplr?.experimentalSuggestChain(chainInfo);
    const chainId = 'uni-3';
    await (window as any).keplr?.enable(chainId);
    if ((window as any).keplr === undefined) return;
    const offlineSigner = await (window as any).getOfflineSigner(chainId);

    const accounts = await offlineSigner.getAccounts();

    const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
      API_URL,
      offlineSigner
    );

    const accountBalance = await wasmChainClient.getBalance(accounts[0].address, "ujunox");

    setWalletState({
      address: accounts[0].address,
      shortAddress: (accounts[0].address).substr(0,8)
        +'...'
        +(accounts[0].address).substr((accounts[0].address).length-3,3)
      ,
      balance: coinConvert(accountBalance.amount as string, 6, 'human'),
      client: wasmChainClient,
    })
  }
}

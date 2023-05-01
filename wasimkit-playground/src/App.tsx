import React from 'react';
import { RecoilRoot } from 'recoil';
import './App.css';
import ConnectWalletButton from './components/common/buttons/connectWallet';
import Home from './pages/home'
function App() {
  return (
    <RecoilRoot>
    {/* <ConnectWalletButton></ConnectWalletButton> */}
     {/* <div></div> */}
     <Home></Home>
    </RecoilRoot>
  )
}

export default App;

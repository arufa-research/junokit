import React from 'react';
import contractName from "../../src/contracts.json";
import ConnectWalletButton from './common/buttons/connectWallet';
import './sidebar.css'
function SideNavbar(): JSX.Element {
//   const jsonFilePath = "../../src/contracts.json"; // Specify the path to the JSON file here
//   const names = JSON.parse(fs.readFileSync(jsonFilePath).toString()); // Read the JSON file and parse its contents into an array

  return (
      <div className='sidebar'>

         <ConnectWalletButton></ConnectWalletButton>

    <ul>
    {contractName.map((name, index) => (
      <li key={index}>
        {name}
      </li>
    ))}
  </ul>
          
    </div>
  );
}

export default SideNavbar;

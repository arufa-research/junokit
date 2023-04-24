import React from 'react';
import contractInfo from "../../src/counter.json";

function Instantiate(contractName: any) {
 console.log(contractName);
 const contract = contractName['contractName']
  return ( 
    <div className='instantiate-page'>
      {contractName['contractName']}
      <br></br>
      Code Id: 
      {contractInfo["default"]["deployInfo"]["codeId"]}
      <br></br>
     
      <br></br>
      Contract Address : 
       {contractInfo["default"]["instantiateInfo"]["contractAddress"]}
      <br></br>

      
    </div>
  )
}

export default Instantiate;

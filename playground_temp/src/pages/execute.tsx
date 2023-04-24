import { CosmWasmClient, SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isPropertyAccessChain } from 'typescript';
// import ClassInfo from "../../src/counterInf.json";
import { Contract } from "../hooks/clients/contract"
import contractInfo from "../../src/counter.json";
import { walletState } from "../context/walletState";
interface Property {
  name: string;
  type: string;
  modifiers?: string[];
}

interface ClassStructure {
  kind: string;
  name: string;
  properties?: Property[];
}
interface Coin {
  readonly denom: string;
  readonly amount: string;
}
const classInfo = require("../../src/counterInf.json") as ClassStructure[];

// import { CounterQueryContract } from "../method"
function Execute(contractName: any) {

  const className = "CounterContract";

  const val = useRecoilValue(walletState);
  const [increres, setincreRes] = useState("");

const classStructure = classInfo.find((structure) => {
  return structure.kind === "class" && structure.name === className;
});
console.log("class srinc", classStructure?.properties,"\n");

// if (!classStructure) {
//   console.log(`Class ${className} not found in JSON file.`);
// } else {
//   console.log(`Class ${className} found in JSON file.`);

//   if (!classStructure.properties || classStructure.properties.length === 0) {
//     console.log(`Class ${className} has no properties.`);
//   } else {
//     console.log(`Class ${className} has the following properties:`);

//     classStructure.properties.forEach((property) => {
//       console.log(`Property name: ${property.name}`);
//       console.log(`Property type: ${property.type}`);

//       if (property.modifiers && property.modifiers.length > 0) {
//         console.log(`Property modifiers: ${property.modifiers.join(", ")}`);
//       }

//       console.log("");
//     });
//   }
// }
let propertiesJsx = null;
if (!classStructure) {
  return <div>Class {className} not found in JSON file.</div>;
} else {
 

  if (!classStructure.properties || classStructure.properties.length === 0) {
    propertiesJsx = <div>Class {className} has no properties.</div>;
  } else {
    propertiesJsx = (
      <div>
        {classStructure.properties.map((property) => (
          <div key={property.name}>
            <p>Property name: {property.name}</p>
            <p>Property type: {property.type}</p>
            {property.modifiers && property.modifiers.length > 0 && (
              <p>Property modifiers: {property.modifiers.join(", ")}</p>
            )}
          </div>
        ))}
      </div>
    );
  }
}
console.log("valaddresss", val.address, val.client)
const temp = new Contract(val.client as SigningCosmWasmClient,val.client as CosmWasmClient, contractInfo.default.instantiateInfo.contractAddress);
const transferAmt : readonly Coin[] =[
  {
    denom: "ujunox",
   amount: "1"
  }
]
const incre = async ()=>{
  console.log("response", contractInfo.default.instantiateInfo.contractAddress,temp);
 const ans = await temp.executeMsg({
  increment: {},
},
val.address as string
);
 console.log("increment response", ans, contractInfo.default.instantiateInfo.contractAddress);
 return ans;
}
incre();

const handlebtnclick = async()=>{
  const res = await incre();
  setincreRes(res.increment as string);
}

  return ( 
    <div className='query-page'>

      {/* <p>Class ${className} found in JSON file.</p> */}
      {propertiesJsx}
      
      <button onClick={handlebtnclick}>Click to increment </button>
          {/* {propertiesJsx} */}
         
         <div>
           {increres !== "" ?
           increres
           :
           <></>
           }
         </div>
   
         
    </div>
  )
}


export default Execute;

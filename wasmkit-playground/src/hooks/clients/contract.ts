// import { CosmWasmClient, MigrateResult } from "@cosmjs/cosmwasm-stargate";
// import fs from "fs-extra";
// import path from "path";


// async queryMsg (
//     msgData: Record<string, unknown>
//   ): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
//     if (this.contractAddress === "mock_address") {
//       throw new JunokitError(ERRORS.GENERAL.CONTRACT_NOT_INSTANTIATED, {
//         param: this.contractName
//       });
//     }
//     // Query the contract
//     console.log('Querying', this.contractAddress, '=>', Object.keys(msgData)[0]);
//     // const msgData: { [key: string]: Record<string, unknown> } = {};
//     // msgData[methodName] = callArgs;
//     console.log(this.contractAddress, msgData);
//     return await this.client?.queryContractSmart(this.contractAddress, msgData);
//   }










import { SigningCosmWasmClient ,CosmWasmClient, MigrateResult } from "@cosmjs/cosmwasm-stargate";

export interface Coin {
  readonly denom: string;
  readonly amount: string;
}
export interface TxnStdFee {
  readonly amount: Coin[];
  readonly gas: string;
}
export interface StdFee {
  readonly upload: TxnStdFee;
  readonly init: TxnStdFee;
  readonly exec: TxnStdFee;
  readonly send: TxnStdFee;
  readonly amount: Coin[];
  readonly gas: string;
}

export interface ExecArgs {
  userAddress: string;
  transferAmount: readonly Coin[] | undefined;
  customFees: TxnStdFee | undefined;
}
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
export class Contract {
  private signClient: SigningCosmWasmClient;
  public client: CosmWasmClient;
//  public senAddr : string ;
  public contractCodeHash: string | undefined;
  public contractAddress: string;

  constructor(
    signClient: SigningCosmWasmClient,
    client: CosmWasmClient,
    contractAddress: string,
    // senAddr: string,
    contractHash?: string
  ) {
    this.contractCodeHash = contractHash;
    this.contractAddress = contractAddress;
    this.client = client;
    // this.senAddr = senAddr
    this.signClient = signClient;
  }

async queryMsg (
    msgData: Record<string, unknown>
  ): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
    
    // Query the contract
    console.log('Querying', this.contractAddress, '=>', Object.keys(msgData)[0]);
    // const msgData: { [key: string]: Record<string, unknown> } = {};
    // msgData[methodName] = callArgs;
    console.log("i am in query", this.contractAddress, msgData);
    return await this.client?.queryContractSmart(this.contractAddress, msgData);
  }

  async executeMsg (
    msgData: Record<string, unknown>,
    userAddr:string,
    // incremen : number,
    memo?:string,
    transferAmount?: readonly Coin[] 
  ): Promise<any> {
    // const sender = String(this.senAddr);
    console.log(msgData," sender", this.client,"\n")
    console.log('Executing', this.contractAddress, '=>', Object.keys(msgData)[0]);
    //const incre=
    // Send the same handleMsg to increment multiple times
    return await this.signClient.execute(
    //   accountVal.address,
    //   this.senAddr,
      userAddr,
      this.contractAddress,
      msgData,
      defaultFees.exec,
      memo === undefined ? "executing" : memo,
      transferAmount
    );
  }
}
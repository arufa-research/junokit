import { expect, use } from "chai";
import { getAccountByName, junokitChai, junokitTypes } from "junokit";
import { CwErc20Contract } from "../artifacts/typescript_schema/CwErc20";

use(junokitChai);

describe("erc-20", () => {

  async function setup(): Promise<{
    contract_owner: junokitTypes.UserAccount;
    other: junokitTypes.UserAccount;
    contract: CwErc20Contract;
  }> {
    const contract_owner = getAccountByName("account_1");
    const other = getAccountByName("account_0");
    const contract = new CwErc20Contract();
    const deploy_response = await contract.deploy(
      contract_owner,
      { // custom fees
        amount: [{ amount: "750000", denom: "ujunox" }],
        gas: "3000000",
      }
    );
    console.log(deploy_response);
    return { contract_owner, other, contract };
  }

  it("deploy and init", async () => {
    const { contract_owner, other, contract } = await setup();
    const contract_info = await contract.instantiate(
    {
      "name": "ERC", "symbol": "ER", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
    console.log(contract_info);
  });

  it("transfer and query balance", async () => {
    const { contract_owner, other, contract } = await setup();
    const deploy_response = await contract.deploy(contract_owner);
    console.log(deploy_response);

    const contract_info = await contract.instantiate(
    {
      "name": "ERC", "symbol": "ER", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
    console.log(contract_info);
    let transfer_response = await contract.transfer(
      { account: contract_owner },
      {
        recipient: other.account.address,
        amount: "50000000"
      }
    );
    console.log(transfer_response);
  
    await expect(contract.balance({ "address": contract_owner.account.address })).to.respondWith({"balance": "50000000"});
  });
});
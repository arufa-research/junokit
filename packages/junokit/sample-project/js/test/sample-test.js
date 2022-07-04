const { expect, use } = require("chai");
const { Contract, getAccountByName, junokitChai } = require("junokit");

use(junokitChai);

describe("erc-20", () => {

  async function setup() {
    const contract_owner = getAccountByName("account_1");
    const other = getAccountByName("account_0");
    const contract = new Contract('cw_erc20');
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
    let transfer_response = await contract.executeMsg(
      {
        transfer: {
          recipient: other.account.address,
          amount: "50000000"
        }
      },
      contract_owner
    );
    console.log(transfer_response);
  
    await expect(await cw20_contract.queryMsg({
      balance: { "address": contract_owner.account.address }
    })).to.respondWith({"balance": "50000000"});
  });
});
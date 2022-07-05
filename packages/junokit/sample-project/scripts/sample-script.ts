import { getAccountByName } from "junokit";

import { CwErc20Contract } from "../artifacts/typescript_schema/CwErc20";

async function run() {
  const contract_owner = getAccountByName("account_0");
  const other = getAccountByName("account_1");
  const cw20_contract = new CwErc20Contract();
  await cw20_contract.setUpclient();

  console.log("Client setup done!! ");

  const deploy_response = await cw20_contract.deploy(
    contract_owner,
    { // custom fees
      amount: [{ amount: "750000", denom: "ujunox" }],
      gas: "18000000",
    }
  );
  console.log(deploy_response);

  const contract_info = await cw20_contract.instantiate(
    {
      "name": "ERC20", "symbol": "ERC", "decimals": 10,
      "initial_balances": [{
        "address": contract_owner.account.address,
        "amount": "100000000"
      }]
    }, "deploy test", contract_owner);
  console.log(contract_info);

  let balance_before = await cw20_contract.balance({ "address": contract_owner.account.address });
  console.log(balance_before);

  let transfer_response = await cw20_contract.transfer(
    { account: contract_owner },
    {
      recipient: other.account.address,
      amount: "50000000"
    }
  );
  console.log(transfer_response);

  let balance_after = await cw20_contract.balance({ "address": contract_owner.account.address });
  console.log(balance_after);
}

module.exports = { default: run };
import { getAccountByName } from "junokit";

import { CounterContract } from "../artifacts/typescript_schema/Counter";

async function run() {
  const runTs = String(new Date());
  const contract_owner = getAccountByName("account_0");
  const counter_contract = new CounterContract();
  await counter_contract.setUpclient();

  console.log("Client setup done!! ");

  const deploy_response = await counter_contract.deploy(
    contract_owner,
    { // custom fees
      amount: [{ amount: "900000", denom: "ujunox" }],
      gas: "35000000",
    }
  );
  console.log(deploy_response);
  const contract_info = await counter_contract.instantiate(
    {
      "count": 102
    }, `deploy test ${runTs}`, contract_owner);
  console.log(contract_info);

  const inc_response = await counter_contract.increment({account: contract_owner});
  console.log(inc_response);

  const response = await counter_contract.getCount();
  console.log(response);

}

module.exports = { default: run };

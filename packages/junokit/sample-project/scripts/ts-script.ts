import { Contract, ExternalContract, getAccountByName, getLogs } from "junokit";

async function run() {
  const contract_owner = getAccountByName("account_0");
  const other = getAccountByName("account_1");
  const contract = new Contract("cw_erc20");
  await contract.setUpclient();
  await contract.parseSchema();

  console.log("Client setup done!! ");

  const deploy_response = await contract.deploy(
    contract_owner,
    { // custom fees
      amount: [{ amount: "750000", denom: "ujunox" }],
      gas: "3000000",
    }
  );
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

  let balance_before = await contract.query.balance({ "address": contract_owner.account.address });
  console.log(balance_before);

  let transfer_response = await contract.tx.transfer(
    { account: contract_owner },
    {
      recipient: other.account.address,
      amount: "50000000"
    }
  );
  console.log(transfer_response);

  let balance_after = await contract.query.balance({ "address": contract_owner.account.address });
  console.log(balance_after);
}

module.exports = { default: run };
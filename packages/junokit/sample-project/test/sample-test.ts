import { use } from "chai";
import { getAccountByName, junokitChai } from "junokit";

import { CounterContract } from "../artifacts/typescript_schema/Counter";

use(junokitChai);

describe("counter", () => {

  async function setup() {
    const contract_owner = getAccountByName("account_0");
    const counter_contract = new CounterContract();
    await counter_contract.setUpclient();

    return { contract_owner, counter_contract };
  }

  it("deploy and init", async () => {
    const runTs = String(new Date());
    const { contract_owner, counter_contract } = await setup();
    const deploy_response = await counter_contract.deploy(
      contract_owner,
      { // custom fees
        amount: [{ amount: "90000", denom: "ujunox" }],
        gas: "35000000",
      }
    );
    console.log(deploy_response);
    const contract_info = await counter_contract.instantiate(
      {
        "count": 102
      }, `deploy test ${runTs}`, contract_owner);
    console.log(contract_info);
  });
});

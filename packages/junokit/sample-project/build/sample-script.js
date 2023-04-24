"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const junokit_1 = require("junokit");
const Counter_1 = require("../artifacts/typescript_schema/Counter");
async function run() {
    const runTs = String(new Date());
    const contract_owner = (0, junokit_1.getAccountByName)("account_0");
    const counter_contract = new Counter_1.CounterContract();
    await counter_contract.setUpclient();
    console.log("Client setup done!! ");
    const deploy_response = await counter_contract.deploy(contract_owner, {
        amount: [{ amount: "900000", denom: "ujunox" }],
        gas: "35000000",
    });
    console.log(deploy_response);
    const contract_info = await counter_contract.instantiate({
        "count": 102
    }, `deploy test ${runTs}`, contract_owner);
    console.log(contract_info);
    const inc_response = await counter_contract.increment({ account: contract_owner });
    console.log(inc_response);
    const response = await counter_contract.getCount();
    console.log(response);
}
module.exports = { default: run };
//# sourceMappingURL=sample-script.js.map
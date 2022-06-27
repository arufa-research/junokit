# Sample project (Counter)

This is a boilerplate `junokit` project with counter smart contract example.

To run the `sample-project`:

- First you need to set the configuration in `junokit.config.js` file:

  - Specify accounts you want to use, there are multiple ways to do it.
  - After this specify your `network configurations`.
  - The default `junokit.config.js` file comes with pre-defined network config for testnet and localnet.

- Install `Junokit` if not yet installed.

  - `yarn global add junokit` will install the `junokit` system-wide.
  - To check if installed, run command `junokit` and this should list out the possible commands.

- Compile and deploy Smart Contracts:

  - Compile using `junokit compile` while working directory is project's directory.
  - Compile step will create compiled `.wasm` file and `.json` schema files.
  - To deploy and instantiate the contract, one can run deploy script present in `scripts/` directory.
  - Run script using `junokit run scripts/<script-name>`.

- Run tests:

  - `junokit test` runs the mocha in project root.

In the `sample-project` folder you'll have following items:

- `contracts/`: Directory for contracts files:

  - `src/` : It has source rust contract files.
  - `examples/` : It has rust file to genrate schema from src files.
  - If you need template for multiple contracts, use `junokit init multi-contracts`.

- `scripts/`: Directory for scripts to deploy and interact with your smart contracts:

  - `sample-script.js` : This script deploys the counter contract and runs the `increment` txn and `get_count` query.

- `test/`: Directory for test files for testing your smart contracts:

  - `sample-test.js` : This is a basic example of how tests should be and how they work.
  - You can add tests for your scripts here.

- `junokit.config.js`: Junokit configuration file.

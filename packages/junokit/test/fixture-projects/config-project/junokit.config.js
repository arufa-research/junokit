const accounts = [{
  name: 'CS',
  address: 'juno1nzc35yqy2qj4y25ftaww7zahj6l4k6qu97wlfn',
  mnemonic: "slam club view virus chalk inherit bread caution hour vacant rain math"
}]

task('example2', 'example task', async (_ret) => 28)
task('example', 'example task', async (__, { run }) => run('example2'))

module.exports = {
  networks: {
    custom: {
      endpoint: 'http://localhost',
      accounts: accounts
    },
    localhost: {
      endpoint: 'http://127.0.0.1',
      accounts: accounts
    }
  },
  unknown: { asd: 12 }
}

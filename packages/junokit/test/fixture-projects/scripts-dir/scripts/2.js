const fs = require('fs')

async function run (runtimeEnv,) {
  await new Promise(resolve => setTimeout(resolve, 100))
  fs.appendFileSync('output.txt', 'scripts directory: script 2 executed\n')
}

module.exports = { default: run }

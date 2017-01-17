const argv = require('minimist')(process.argv.slice(2))
const level = require('level')
const hypershare = require('../')

const hs2 = hypershare(level(`${__dirname}/hypershare-test-2.db`))

const link = argv._[0]

hs2.download(link, './downloads')
  .then(() => process.exit(0))
  .catch(err => process.exit(1))

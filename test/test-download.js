const argv = require('minimist')(process.argv.slice(2))
const level = require('level')
const Hypershare = require('../')

const hs2 = new Hypershare(level(`${__dirname}/hypershare-test-2.db`))

const link = argv._[0]

hs2.download(link, './downloads')
  .then(() => process.exit(0))
  .catch(err => process.exit(1))

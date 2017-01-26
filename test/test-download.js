const argv = require('minimist')(process.argv.slice(2))
const Hypershare = require('../')

const hs2 = new Hypershare()

const link = argv._[0]

hs2.download(link, './downloads')
  .then(() => process.exit(0))
  .catch(err => process.exit(1))

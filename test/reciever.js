const argv = require('minimist')(process.argv.slice(2))
const level = require('level')

const { download } = require('../')(level('./hypershare-test-2.db'))

download(argv._[0], `${__dirname}/downloads`)
  .then(file => console.log(`${file} downloaded!`))
  .catch(err => console.error(err))

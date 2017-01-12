const argv = require('minimist')(process.argv.slice(2))
const level = require('level')

const { share } = require('../')(level('./hypershare-test-a.db'))

const link = share(`${__dirname}/${argv._[0]}`)

console.log(`Your hyperdrive link: ${link}`)

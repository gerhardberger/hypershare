const level = require('level')

const { share } = require('../')(level('./hypershare-test-1.db'))

const link = share([`${__dirname}/foo.txt`, `${__dirname}/bar.txt`])

console.log(`Your hyperdrive link: ${link}`)

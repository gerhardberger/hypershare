const level = require('level')

const { share } = require('../')(level('./hypershare-test-a.db'))

const link = share([`${__dirname}/foo.txt`, `${__dirname}/bar.txt`])

console.log(`Your hyperdrive link: ${link}`)

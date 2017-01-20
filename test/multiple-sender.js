const level = require('level')
const Hypershare = require('../')

const hs = new Hypershare(level('./hypershare-test-1.db'))

hs.share([`${__dirname}/foo.txt`, `${__dirname}/bar.txt`]).then(link => {
  console.log(`Your hyperdrive link: ${link}`)
}).catch(err => console.log(err))

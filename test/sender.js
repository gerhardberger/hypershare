const Hypershare = require('../')

const hs = new Hypershare()

hs.share([`${__dirname}/foo.txt`, `${__dirname}/bar.txt`]).then(link => {
  console.log(`Your hyperdrive link: ${link}`)
}).catch(err => console.log(err))

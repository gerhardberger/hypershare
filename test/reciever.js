const argv = require('minimist')(process.argv.slice(2))
const Hypershare = require('../')

const hs = new Hypershare()

hs.download(argv._[0], `${__dirname}/downloads`)
  .then(file => {
    console.log(`${file} downloaded!`)
  })
  .catch(err => console.error(err))

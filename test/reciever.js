const argv = require('minimist')(process.argv.slice(2))
const level = require('level')
const Hypershare = require('../')

const hs = new Hypershare(level('./hypershare-test-2.db'))

hs.download(argv._[0], `${__dirname}/downloads`)
  .then(file => {
    console.log(`${file} downloaded!`)
    // download('c400331853dacc9c73e8c84b09079faf777ac752bcfc3d24f6297648f4be7fc6', `${__dirname}/downloads`)
    //   .then(file => console.log(`${file} downloaded2!`))
    //   .catch(err => console.error(err))
  })
  .catch(err => console.error(err))

// download(argv._[0], `${__dirname}/downloads`)
//   .then(file => {
//     console.log(`${file} downloaded!`)
//     download('c400331853dacc9c73e8c84b09079faf777ac752bcfc3d24f6297648f4be7fc6', `${__dirname}/downloads`)
//       .then(file => console.log(`${file} downloaded2!`))
//       .catch(err => console.error(err))
//   })
//   .catch(err => console.error(err))

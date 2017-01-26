const test = require('ava')
const execa = require('execa')

const Hypershare = require('../')

test('share a single file', t => {
  const hs = new Hypershare()

  return hs.share([`${__dirname}/foo.txt`, `${__dirname}/bar.txt`])
    .then(link => {
      execa('node', [`${__dirname}/test-download.js`, link])
    })
})

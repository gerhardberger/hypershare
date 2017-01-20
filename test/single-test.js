const test = require('ava')
const level = require('level')
const execa = require('execa')

const Hypershare = require('../')

test('share a single file', t => {
  const hs = new Hypershare(level(`${__dirname}/hypershare-test-1.db`))

  return hs.share(`${__dirname}/foo.txt`).then(link => {
    execa('node', [`${__dirname}/test-download.js`, link])
  })
})

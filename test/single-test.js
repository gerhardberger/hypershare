const test = require('ava')
const level = require('level')
const execa = require('execa')

const hypershare = require('../')

test('share a single file', t => {
  const hs = hypershare(level(`${__dirname}/hypershare-test-1.db`))

  const link = hs.share(`${__dirname}/foo.txt`)

  return execa('node', [`${__dirname}/test-download.js`, link])
})

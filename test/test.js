const test = require('ava')
const level = require('level')
const execa = require('execa')

const hypershare = require('../')

test('share a single file', t => {
  const hs1 = hypershare(level(`${__dirname}/hypershare-test-1.db`))

  const link = hs1.share(`${__dirname}/foo.txt`)

  return execa('node', [`${__dirname}/test-download.js`, link])
})

#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const pathExists = require('path-exists')
const mkdirp = require('mkdirp')

const Hypershare = require('../')

const hs = new Hypershare()

const file = argv.f || argv.file
const link = argv.l || argv.link

if (file) {
  const files = file.split(',').map(s => s.trim())
  Promise.all(files.map(file =>
    new Promise((resolve, reject) => {
      pathExists(file).then(exists => {
        if (!exists) return reject(new Error(`${file} does not exist!`))
        resolve()
      })
    })))
    .then(() => hs.share(files))
    .then(link => console.log(`Your hyperdrive link: ${link}`))
    .catch(err => console.error(err))
} else if (link) {
  const destination = path.join(process.cwd(), 'downloads')
  mkdirp(destination, err => {
    if (err) return console.error(err)

    hs.download(link, destination)
      .then(filename => console.log(`Files downloaded to ${filename}`))
      .catch(err => console.error(err))
  })
} else {
  console.log('Specify file with -f or link with -l!')
}

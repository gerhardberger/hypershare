#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const pathExists = require('path-exists')
const mkdirp = require('mkdirp')

const { share, download } = require('../')()

const file = argv.f || argv.file
const link = argv.l || argv.link

if (file) {
  pathExists(file).then(exists => {
    if (!exists) {
      console.error(`${file} does not exist!`)
      return
    }

    const link = share(file)
    console.log(`Your hyperdrive link: ${link}`)
  }).catch(err => console.error(err))
} else if (link) {
  const destination = path.join(process.cwd(), 'downloads')
  mkdirp(destination, err => {
    if (err) return console.error(err)

    download(link, destination)
      .then(filename =>
        console.log(`File downloaded to ${filename}`))
      .catch(err => console.error(err))
  })
} else {
  console.log('Specify file with -f or link with -l!')
}

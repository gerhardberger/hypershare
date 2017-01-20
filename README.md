# hypershare

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Build Status](https://travis-ci.org/gerhardberger/hypershare.svg?branch=master)](https://travis-ci.org/gerhardberger/hypershare) [![npm version](https://badge.fury.io/js/hypershare.svg)](https://badge.fury.io/js/hypershare)

Easily share files peer-to-peer with [hyperdrive](https://github.com/mafintosh/hyperdrive)
from code or command line.

CLI:
```
$ hypershare --file foo.txt,bar.txt
$ hypershare --link fb2a7568e70b281fd08baa13a574c256485f9f7
```

Code:
``` js
const Hypershare = require('hypershare')
const hs = new Hypershare()

// share a file
hs.share('foo.txt').then(link => {
  console.log(`Your hyperdrive link: ${link}`)
})

// download files
hs.download(link, 'downloads')
  .then(() => console.log('File downloaded!'))
  .catch(err => console.error(err))
```

## install

```
$ npm i -g hypershare
```

## usage

### CLI

#### `hypershare --file <files>`

Takes a comma-separated list of file paths to share.

#### `hypershare --link <hash>`

Takes a `hyperdrive` link and downloads it to a `downloads` folder in the
current working directory.

### code

#### `hs = new Hypershare([db])`

Returns a new instance, where `db` is an optional `level` instance.

#### `p = hs.share(files)`

Takes a single file path (`String`) or an array of file paths and creates a
`hyperdrive` archive from them and returns a promise that will give the
archive's link, with what others can download the files.

#### `p = hs.download(link, destination)`

Downloads the archive specified by `link` and writes the files to `destination`.
Returns a promise that runs after the download.

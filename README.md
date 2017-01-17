# hypershare

Easily share files peer-to-peer with [hyperdrive](https://github.com/mafintosh/hyperdrive)
from code or command line.

CLI:
```
$ hypershare --file foo.txt,bar.txt
$ hypershare --link fb2a7568e70b281fd08baa13a574c256485f9f7
```

Code:
``` js
const hypershare = require('hypershare')
const { share, download } = hypershare()

// share a file
const link = share('foo.txt')
console.log(`Your hyperdrive link: ${link}`)

// download files
download(link, 'downloads')
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

#### `hs = hypershare([db])`

Returns an object with two functions, `share` and `download`. `db` is an optional
`level` instance.

#### `link = hs.share(files)`

Takes a single file path (`String`) or an array of file paths and creates a
`hyperdrive` archive from them and returns the archive's link, with what others
can download the files.

#### `p = hs.download(link, destination)`

Downloads the archive specified by `link` and writes the files to `destination`.
Returns a promise that runs after the download.

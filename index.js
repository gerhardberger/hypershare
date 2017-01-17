const debug = require('debug')('hypershare')
const { createWriteStream } = require('fs')
const path = require('path')
const hyperdrive = require('hyperdrive')
const raf = require('random-access-file')
const level = require('level')
const swarmDefaults = require('datland-swarm-defaults')()
const swarm = require('discovery-swarm')(swarmDefaults)

module.exports = db => {
  if (!db) db = level(`${__dirname}/hypershare.db`)

  const drive = hyperdrive(db)

  return {
    share: files => {
      if (!Array.isArray(files)) files = [files]

      const archive = drive.createArchive({ file: name => raf(name) })

      for (let file of files) {
        archive.append(file, () => debug(`${file} was appended!`))
      }

      archive.finalize()

      const link = archive.key.toString('hex')

      swarm.listen()
      swarm.join(new Buffer(link, 'hex'))
      swarm.on('connection', connection => {
        debug('New connection (sharing side)!')

        connection.pipe(archive.replicate()).pipe(connection)
      })

      return link
    },
    download: (link, destination) => new Promise((resolve, reject) => {
      const archive = drive.createArchive(link, {
        file: name => raf(path.join(destination, path.basename(name)))
      })
      swarm.listen()
      swarm.join(new Buffer(link, 'hex'))
      swarm.on('connection', connection => {
        debug('New connection (downloading side)!', destination)
        connection.pipe(archive.replicate()).pipe(connection)

        const rs = archive.list({ live: false })
        rs.on('data', entry => {
          debug('New entry:', entry.name)

          const stream = archive.createFileReadStream(entry)
          const filename = path.join(destination, path.basename(entry.name))
          const ws = createWriteStream(filename)
          stream.pipe(ws)

          stream.on('error', err => reject(err))

          stream.on('end', () => debug('Downloaded:', entry.name))
        })

        rs.on('error', err => reject(err))

        rs.on('end', () => {
          debug('Download ended!')
          resolve()
        })
      })
    })
  }
}

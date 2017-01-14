const debug = require('debug')('hypershare')
const { createWriteStream } = require('fs')
const path = require('path')
const hyperdrive = require('hyperdrive')
const raf = require('random-access-file')
const level = require('level')
const swarmDefaults = require('datland-swarm-defaults')()
const swarm = require('discovery-swarm')(swarmDefaults)

module.exports = db => {
  if (!db) db = level('./hypershare.db')

  const drive = hyperdrive(db)

  return {
    share: file => {
      const archive = drive.createArchive({ file: name => raf(name) })
      archive.append(file)

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
        file: name => raf(path.basename(name))
      })
      swarm.listen()
      swarm.join(new Buffer(link, 'hex'))
      swarm.on('connection', connection => {
        debug('New connection (downloading side)!', destination)
        connection.pipe(archive.replicate()).pipe(connection)

        archive.get(0, (err, entry) => {
          if (err) return reject(err)

          const stream = archive.createFileReadStream(entry)

          debug(entry)

          const filename = path.join(destination, path.basename(entry.name))
          const ws = createWriteStream(filename)
          stream.pipe(ws)

          stream.on('error', err => reject(err))

          stream.on('end', () => resolve(filename))
        })
      })
    })
  }
}

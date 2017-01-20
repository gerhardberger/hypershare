const debug = require('debug')('hypershare')
const { createWriteStream } = require('fs')
const path = require('path')
const EventEmitter = require('events')
const hyperdrive = require('hyperdrive')
const raf = require('random-access-file')
const level = require('level')
const swarmDefaults = require('datland-swarm-defaults')()
const swarm = require('discovery-swarm')(swarmDefaults)

module.exports = class Hypershare extends EventEmitter {
  constructor (db) {
    super()

    this.db = db || level(`${__dirname}/hypershare.db`)
    this.drive = hyperdrive(this.db)
    this.archives = {}

    swarm.listen()

    swarm.on('connection', connection => {
      debug('New connection!')

      for (let link of Object.keys(this.archives)) {
        this.archives[link].connect(connection)
      }
    })
  }

  share (files) {
    if (!Array.isArray(files)) files = [files]

    const archive = this.drive.createArchive({ file: name => raf(name) })

    return Promise.all(files.map(file => new Promise((resolve, reject) => {
      archive.append(file, err => {
        if (err) return reject(err)
        debug(`${file} was appended!`)
        resolve()
      })
    }))).then(() => {
      debug('All files appended!')

      archive.finalize()

      const link = archive.key.toString('hex')
      swarm.join(new Buffer(link, 'hex'))

      this.archives[link] = {
        archive,
        connect: connection => {
          connection.pipe(archive.replicate()).pipe(connection)
        }
      }

      return link
    })
  }

  close (link) {
    return new Promise((resolve, reject) => {
      if (!this.archives[link]) return reject(new Error('Archive not found!'))

      const archive = this.archives[link].archive
      archive.close(() => {
        debug('Archive closed!')

        swarm.leave(new Buffer(link, 'hex'))

        this.archives[link] = undefined

        resolve()
      })
    })
  }

  download (link, destination) {
    return new Promise((resolve, reject) => {
      const archive = this.drive.createArchive(link, {
        file: name => raf(path.join(destination, path.basename(name)))
      })

      swarm.join(new Buffer(link, 'hex'))

      let files = []
      this.archives[link] = {
        archive,
        connect: connection => {
          connection.pipe(archive.replicate()).pipe(connection)

          const rs = archive.list({ live: false })
          rs.on('data', entry => {
            debug('New entry:', entry.name)

            if (archive.isEntryDownloaded(entry)) {
              debug('Entry is already downloaded!')
              return
            }
            files.push(entry.name)

            const stream = archive.createFileReadStream(entry)
            const filename = path.join(destination, path.basename(entry.name))
            const ws = createWriteStream(filename)
            stream.pipe(ws)

            stream.on('error', err => {
              debug(`Error downloading ${entry.name}`, err)
            })

            stream.on('end', () => debug('Downloaded:', entry.name))
          })

          rs.on('error', err => reject(err))

          rs.on('end', () => {
            debug('Download ended!', files)
            this.close(link)
              .then(() => resolve(files))
              .catch(err => reject(err))
          })
        }
      }
    })
  }
}

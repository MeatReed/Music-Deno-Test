import opine from "https://x.nest.land/opine@0.24.0/mod.ts";
import { FLAC } from "https://deno.land/x/dune@v0.1.0/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

import { BaseMusic } from './utils/structures/BaseMusic.js'
import config from './config.js'
import api from './api/index.js'

class Music extends BaseMusic {
  constructor(options) {
    super(options)

    this.config = config
    this.app = opine()
    this.db = new DB("musics.db")
  }
  startServer() {
    this.app.use(function (req, res, next) {
      req.config = server.config
      req.db = server.db
      next()
    })
    this.app.listen({ port: this.config.PORT })
    this.app.use('/api', api)
    console.log('server done')
  }
  async initDatabase() {
    this.db.query("CREATE TABLE IF NOT EXISTS musics (\
      id              INTEGER PRIMARY KEY,\
      filename        VARCHAR(5000),\
      path            VARCHAR(5000),\
      extension       VARCHAR(10),\
      user_id         INTEGER,\
      album_id        INTEGER,\
      genre           VARCHAR(100),\
      track_number    INTEGER,\
      comment         TEXT(5000),\
      title           VARCHAR(50),\
      artist          VARCHAR(500),\
      date            INTEGER\
    )")
    for await (const dirEntry of Deno.readDir("./music")) {
      if (getExtension(dirEntry.name) === '.flac') {
        const flac = await FLAC.open("./music/" + dirEntry.name);
        const info = flac.vorbis.tags
        const genre = info.get('genre') ? info.get('genre')[0] : null
        const tracknumber = info.get('tracknumber') ? parseInt(info.get('tracknumber')[0]) : null
        const title = info.get('title') ? info.get('title')[0] : null
        const artist = info.get('artist') ? info.get('artist')[0] : null
        const date = info.get('date') ? info.get('date')[0] : null
        const tableDB = [dirEntry.name, flac.filePath, getExtension(dirEntry.name), 0, 0, genre, tracknumber, null, title, artist, date]
        let nameTest = null;
        for (const music of this.db.query('SELECT * FROM musics WHERE filename = ?', [dirEntry.name])) [
          nameTest = music[1]
        ]
        if (dirEntry.name !== nameTest) {
          this.db.query("INSERT INTO musics (filename, path, extension, user_id, album_id, genre, track_number, comment, title, artist, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", tableDB)
        }
      }
    }
    console.log('db done')
  }
}

function getExtension(filename) {
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}

const server = new Music()

const init = async () => {
  server.initDatabase()
  server.startServer()

}

init()
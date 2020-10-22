import { Router } from "https://deno.land/x/opine@0.24.0/mod.ts";
import { getNetworkAddr } from 'https://raw.githubusercontent.com/korki43/deno-local-ip/support-windows/mod.ts'

const router = Router()

router.get('/music/info/:id', async function (req, res) {
  const netAddr = await getNetworkAddr()
  let info = null
  for (const music of req.db.query('SELECT * FROM musics WHERE id = ?', [req.params.id])) {
    info = {
      id: music[0],
      filename: music[1],
      path: music[2],
      extension: music[3],
      user_id: music[4],
      album_id: music[5],
      genre: music[6],
      track_number: music[7],
      comment: music[8],
      cover: `http://${netAddr}:${req.config.PORT}/api/cover/${music[0]}`,
      title: music[9],
      artist: music[10],
      date: music[11]
    }
  }
  if (!info) {
    res.send({
      error: "Musique introuvable !"
    })
  } else {
    res.set({
      "Content-Type": "application/json",
    });
    res.send(info);
  }
})

router.get('/musics', async function (req, res) {
  const netAddr = await getNetworkAddr()
  let info = []
  for (const music of req.db.query('SELECT * FROM musics')) {
    info.push({
      id: music[0],
      filename: music[1],
      path: music[2],
      extension: music[3],
      user_id: music[4],
      album_id: music[5],
      genre: music[6],
      track_number: music[7],
      comment: music[8],
      cover: `http://${netAddr}:${req.config.PORT}/api/cover/${music[0]}`,
      title: music[9],
      artist: music[10],
      date: music[11]
    })
  }
  if (!info) {
    res.send({
      error: "Musique introuvable !"
    })
  } else {
    res.set({
      "Content-Type": "application/json",
    });
    res.send(info);
  }
})

router.get('/music/:id', function (req, res) {
  let pathFile = null
  for (const music of req.db.query('SELECT * FROM musics WHERE id = ?', [req.params.id])) [
    pathFile = music[2]
  ]
  res.set({
    "Content-Type": "audio/flac",
    "accept-ranges": "bytes",
  });
  res.sendFile(pathFile);
})

export default router
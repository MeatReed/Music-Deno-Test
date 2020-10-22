import { Router } from "https://deno.land/x/opine@0.24.0/mod.ts";
import { FLAC } from "https://deno.land/x/dune@v0.1.0/mod.ts";

const router = Router()

router.get('/cover/:id', async function (req, res) {
  let pathFile = null
  for (const music of req.db.query('SELECT * FROM musics WHERE id = ?', [req.params.id])) [
    pathFile = music[2]
  ]
  if (!pathFile) {
    res.send({
      error: "Musique introuvable !"
    })
  } else {
    const flac = await FLAC.open(pathFile)
    const img = new Deno.Buffer(flac.metadata[3].pictureRaw)
    res.set({ 'Content-Type': flac.metadata[3].mime })
    res.end(img)
  }
})

export default router
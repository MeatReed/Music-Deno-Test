import { Router } from "https://deno.land/x/opine@0.24.0/mod.ts";
import musicsController from './controllers/musics.js'
import imagesController from './controllers/images.js'

const router = Router()

router.use(musicsController, imagesController)

export default router
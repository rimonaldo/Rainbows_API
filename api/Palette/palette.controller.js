const paletteService = require('./palette.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

async function getPalette(req, res) {
   try {
      const palette = await paletteService.getById(req.params.id)
      res.send(palette)
   } catch (err) {
      logger.error('Failed to get palette', err)
      res.status(500).send({ err: 'Failed to get palette' })
   }
}

async function addPalette(req, res) {
   try {
      const palette = req.body
      const savedPalette = await paletteService.add(palette)
      res.send(savedPalette)
   } catch (err) {
      logger.error('Failed to add palette', err)
      res.status(500).send({ err: 'Failed to add palette' })
   }
}

// async function getPalette(req, res) {
//     try {
//        const palette = await paletteService.getById(req.body.id)
//        res.send(palette)
//     } catch (err) {
//        logger.error('Failed to get palette', err)
//        res.status(500).send({ err: 'Failed to get palette' })
//     }
//  }

// async function getPalette(req, res) {
//    try {
//       const filterBy = {
//          txt: req.query?.txt || '',
//          minBalance: +req.query?.minBalance || 0,
//       }
//       const palettes = await paletteService.query(filterBy)
//       res.send(palettes)
//    } catch (err) {
//       logger.error('Failed to get palettes', err)
//       res.status(500).send({ err: 'Failed to get palettes' })
//    }
// }

async function deletePalette(req, res) {
   try {
      await paletteService.remove(req.query.id)
      res.send({ msg: 'Deleted successfully' })
   } catch (err) {
      logger.error('Failed to delete palette', err)
      res.status(500).send({ err: 'Failed to delete palette' })
   }
}

async function updatePalette(req, res) {
   try {
      console.log(req.cookies);
      const palette = req.body
      const savedPalette = await paletteService.update(palette)
      res.send(savedPalette)
   } catch (err) {
      logger.error('Failed to update palette', err)
      res.status(500).send({ err: 'Failed to update palette' })
   }
}

module.exports = {
   getPalette,
   addPalette,
   updatePalette,
   deletePalette,
}

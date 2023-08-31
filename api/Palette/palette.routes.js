const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getPalette,addPalette,updatePalette,deletePalette} = require('./palette.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/:id', getPalette)
router.post('/', requireAuth, addPalette)
router.put('/', requireAuth,  updatePalette)
router.delete('/', requireAuth,  deletePalette)
// router.get('/:id', getUser)

// router.put('/:id',  requireAuth, updateUser)
// router.delete('/:id',  requireAuth, requireAdmin, deleteUser)

module.exports = router
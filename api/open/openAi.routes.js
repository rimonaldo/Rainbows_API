const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getCompletion } = require('./openAi.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.post('/', getCompletion)

module.exports = router

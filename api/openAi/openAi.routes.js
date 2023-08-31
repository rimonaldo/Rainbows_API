const express = require('express')
const { getCompletion } = require('./openAi.controller')

const router = express.Router()

router.post('/', getCompletion)

module.exports = router
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.send('settings'))

module.exports = router

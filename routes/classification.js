const config = require('../config')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('classify/classify', {
        categories: config.get('rel_categories_interface')
    })
})

module.exports = router

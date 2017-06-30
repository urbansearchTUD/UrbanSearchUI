const config = require('../config')
const express = require('express')
const router = express.Router()
const rp = require('request-promise');

const API_URL = 'http://127.0.0.1:5000/api/v1/'
const LENGTHS_PATH = 'datasets/lengths'


router.get('/', (req, res, next) => {
    rp(API_URL + LENGTHS_PATH)
    .then((response) => {
        const json = JSON.parse(response)
        const data = {}
        
        data.lengths = JSON.parse(json.lengths.replace(/\'/g, '\"'))
        data.classifier_count = Object.keys(data.lengths).length
        data.doc_count = Object.values(data.lengths)

        res.render('classifier/classifier', data)
    })
    .catch((err) => {
        console.log(err);
        next()
    })
})

module.exports = router

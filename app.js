const express = require('express')
const path = require('path')
const nunjucks = require('nunjucks')
const classification = require('./routes/classification')
const index = require('./routes/index')
const settings = require('./routes/settings')
const app = express()

nunjucks.configure('templates', {
    'autoescape': true,
    'express': app
})

app.set('view engine', 'html')
app.use(express.static(path.join(__dirname, 'dist')))
app.use('/classification', classification)
app.use('/settings', settings)
app.use('/', index)

app.listen(8080, () => {
    console.log('Listening on port 8080!')
})

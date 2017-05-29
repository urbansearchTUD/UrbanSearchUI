const nunjucks = require('nunjucks')

function createList(cities) {
    return nunjucks.render('card/citylist.html', {cities: cities})
}

module.exports = {
    createList
}

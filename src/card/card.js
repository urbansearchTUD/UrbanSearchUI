const nunjucks = require('nunjucks')

function createCityList(cities) {
    return nunjucks.render('card/citylist.html', {cities: cities})
}

module.exports = {
    createCityList
}

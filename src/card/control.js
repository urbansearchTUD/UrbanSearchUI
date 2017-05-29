const nunjucks = require('nunjucks')

const CITY_LIST = document.querySelector('[data-city-list]')

function createCityList(cities) {
    return nunjucks.render('card/citylist.html', {cities: cities})
}

function initCityList(cities) {
    CITY_LIST.innerHTML = createCityList(cities);
}

module.exports = {
    createCityList,
    initCityList
}

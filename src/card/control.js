const nunjucks = require('nunjucks')

const CITY_LIST = document.querySelector('[data-city-list]')

function createCityList(cities) {
    return nunjucks.render('card/citylist.html', {cities: cities})
}

function initCityList(options) {
    CITY_LIST.innerHTML = createCityList(options.cities);

    for (let element of CITY_LIST.querySelectorAll('li')) {
        element.addEventListener('click', (e) => {
            console.log('city clicked');
            options.click(e, e.target.getAttribute('data-city-name'))
        })
    }
}

module.exports = {
    createCityList,
    initCityList
}

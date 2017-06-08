const nunjucks = require('nunjucks')
const config = require('../../config')

const CITY_LIST = document.querySelector('[data-city-list]')

document.querySelector('[name="city-search"]').addEventListener('input', (e) => {
    filterCityListByName(e.target.value.toUpperCase())
})

function createCityList(cities) {
    return nunjucks.render('card/citylist.html', {cities: cities})
}

function initCityList(options) {
    CITY_LIST.innerHTML = createCityList(options.cities);

    for (let element of CITY_LIST.querySelectorAll('li')) {
        element.addEventListener('click', (e) => {
            options.click(e.target.getAttribute('data-city-id'))
        })
        let pop = element.getAttribute('data-city-pop')
        let minPop = config.get('popslider_start')[0]
        let maxPop = config.get('popslider_start')[1]
        setVisibility(element, pop < minPop || pop > maxPop)
    }
}

function filterCityListByName(name) {
    for (let element of CITY_LIST.querySelectorAll('li')) {
        let cityName = element.getAttribute('data-city-name').toUpperCase()
        setVisibility(element, cityName.includes(name))
    }
}

function filterCityListByRange(min, max) {
    for (let element of CITY_LIST.querySelectorAll('li')) {
        let pop = parseInt(element.getAttribute('data-city-pop'))
        setVisibility(element, pop < min || pop > max)
    }
}

function setVisibility(element, visibility) {
    if (visibility) {
        element.classList.add('card--list__hidden')
    } else {
        element.classList.remove('card--list__hidden')
    }
}

module.exports = {
    createCityList,
    initCityList,
    filterCityListByName,
    filterCityListByRange
}

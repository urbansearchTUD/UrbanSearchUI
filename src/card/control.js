const nunjucks = require('nunjucks')
const slider = require('../slider/slider')

const CITY_LIST = document.querySelector('[data-city-list]')
const CITY_SEARCH = document.querySelector('[name="city-search"]')

CITY_SEARCH.addEventListener('input', (e) => {
    filterCityList(e.target.value.toUpperCase())
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
    }
}

function filterCityList(name, range) {
    if (!name) {
        name = CITY_SEARCH.value.toUpperCase()
    }
    if (!range) {
        range = slider.getRange()
    }
    for (let el of CITY_LIST.querySelectorAll('li')) {
        setVisibility(el, checkRange(el, range) && checkName(el, name))
    }
}

function checkRange(element, range) {
        let pop = parseInt(element.getAttribute('data-city-pop'))
        return pop >= range[0] && pop <= range[1]
}

function checkName(element, name) {
    let cityName = element.getAttribute('data-city-name').toUpperCase()
    return cityName.includes(name)
}

function setVisibility(element, visibility) {
    if (!visibility) {
        element.classList.add('card--list__hidden')
    } else {
        element.classList.remove('card--list__hidden')
    }
}

function isVisible(element) {
    return !element.contains('card--list__hidden')
}

module.exports = {
    createCityList,
    initCityList,
    filterCityList
}

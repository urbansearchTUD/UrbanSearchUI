const config = require('../../config')
const nunjucks = require('nunjucks')
const relations = require('../relations/relations')
const slider = require('../slider/slider')

const BUTTON_CITIES = document.querySelector('[data-control-button-cities]')
const BUTTON_RELATIONS = document.querySelector('[data-control-button-relations]')
const CONTENT_CITIES = document.querySelector('[data-content-cities]')
const CONTENT_RELATIONS = document.querySelector('[data-content-relations]')
const CITY_LIST = document.querySelector('[data-city-list]')
const CITY_SEARCH = document.querySelector('[name="city-search"]')


function initRelationSliders() {
    document.querySelectorAll('.slider--relation').forEach((slider) => {
        slider.addEventListener('change', (e) => {
            relations.updateVisibility(e.target.name, e.target.value)
        })
    })
}


CITY_SEARCH.addEventListener('input', (e) => {
    filterCityList(e.target.value.toUpperCase())
})


function createCityList(cities) {
    return nunjucks.render('card/citylist.html', {cities: cities})
}


function initCategoryActive() {
    document.querySelectorAll('[data-category-active]').forEach((el) => {
        el.addEventListener('change', (e) => {
            console.log(e.target.value);
            console.log(e.target.checked);
        })
    })
}


function initCityList(options) {
    CITY_LIST.innerHTML = createCityList(options.cities);

    for (let element of CITY_LIST.querySelectorAll('li')) {
        element.addEventListener('click', (e) => {
            options.click(e.target.getAttribute('data-city-id'))
        })
    }
}


function initRelationList(options) {
    const html = nunjucks.render('card/relations.html', {
        relations: options.relations
    })
    CONTENT_RELATIONS.innerHTML = CONTENT_RELATIONS.innerHTML + html
    initRelationSliders()
    initRelationTransform(options.transform)
    initCategoryActive()
}

function initRelationTransform(cb) {
    document.querySelector('[data-transform-select]').addEventListener('change', (e) => {
        cb(e)
    })
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
    initRelationList,
    filterCityList
}

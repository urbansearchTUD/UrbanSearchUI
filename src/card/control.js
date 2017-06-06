const nunjucks = require('nunjucks')

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
            console.log('city clicked');
            options.click(e, e.target.getAttribute('data-city-name'))
        })
        let pop = element.getAttribute('data-city-pop')
        setVisibility(element, pop < options.minPop || pop > options.maxPop)
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

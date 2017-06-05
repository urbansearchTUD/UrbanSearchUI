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
    }
}

function filterCityListByName(name) {
    for (let element of CITY_LIST.querySelectorAll('li')) {
        let cityName = element.getAttribute('data-city-name').toUpperCase()
        if (cityName.includes(name)) {
            element.classList.remove('card--list__hidden')
        } else {
            element.classList.add('card--list__hidden')
        }
    }
}

module.exports = {
    createCityList,
    initCityList
}

const {initCard} = require('./card')
const nunjucks = require('nunjucks')

const INFO_CARD = document.querySelector('[data-info-card]')
const CLOSE_BUTTON = document.querySelector('[data-info-button-close]')

// CLOSE_BUTTON.addEventListener('click', (e) => {
//     INFO_CARD.setAttribute("hidden", true);
// })

function renderData(data) {
    return nunjucks.render('card/info.html', {'data': data})
}

function markerInfo(marker) {
    renderData({
        city: marker.city.name,
        population: marker.city.population
    })
}

function relationInfo(relation) {
    return initCard(nunjucks.render('card/info_relation.html', {
        'data': relation
    }))
}


module.exports = {
    markerInfo,
    relationInfo
}

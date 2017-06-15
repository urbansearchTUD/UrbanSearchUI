const nunjucks = require('nunjucks')

const INFO_CARD = document.querySelector('[data-info-card]')
const CLOSE_BUTTON = document.querySelector('[data-info-button-close]')

CLOSE_BUTTON.addEventListener('click', (e) => {
    INFO_CARD.setAttribute("hidden", true);
})

function renderData(data) {
    const html = nunjucks.render('card/info.html', {'data': data})
    INFO_CARD.querySelector('.card--content').innerHTML = html
    INFO_CARD.removeAttribute("hidden");
}

function markerInfo(marker) {
    renderData({
        city: marker.city.name,
        population: marker.city.population
    })
}

function relationInfo(relation) {
    renderData(relation)
}


module.exports = {
    markerInfo,
    relationInfo
}

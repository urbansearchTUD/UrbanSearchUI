const nunjucks = require('nunjucks')

const INFO_CARD = document.querySelector('[data-info-card]')
const CLOSE_BUTTON = document.querySelector('[data-info-button-close]')

CLOSE_BUTTON.addEventListener('click', (e) => {
    console.log('close');
    INFO_CARD.setAttribute("hidden", true);
})

function markerInfo(marker) {
    console.log('marker info', marker)

    const html = nunjucks.render('card/markerinfo.html', { data : {
        city: marker.city.city_name,
        population: marker.city.population
    } })

    INFO_CARD.querySelector('.card--content').innerHTML = html
    INFO_CARD.removeAttribute("hidden");
}

function relationInfo(relation) {
    console.log('relation info');
}


module.exports = {
    markerInfo,
    relationInfo
}

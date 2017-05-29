const nunjucks = require('nunjucks')

const INFO_CARD = document.querySelector('[data-info-card]')


function markerInfo(marker) {
    console.log('marker info', marker)

    const html = nunjucks.render('card/markerinfo.html', { data : {
        naam: marker.city.city_name,
        inwoners: marker.city.population
    } })

    INFO_CARD.querySelector('.card--content').innerHTML = html
}

function relationInfo(relation) {
    console.log('relation info');
}


module.exports = {
    markerInfo,
    relationInfo
}

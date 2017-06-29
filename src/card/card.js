const {str2html} = require('../html_utils/utils')
const nunjucks = require('nunjucks')


function createCityList(cities) {
    return nunjucks.render('card/citylist.html', {cities: cities})
}

function close(card) {
    card.querySelector('[data-card-close]').addEventListener('click', (e) => {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode)
    })
}

function initCard(html, options) {
    const el = str2html(html)
    close(el)
    toggleLayer(el)
    return el
}

function toggleLayer(card) {
    card.addEventListener('click', () => {
        card.classList.add('selected')
    })

    card.addEventListener('mouseout', () => {
        card.classList.remove('selected')
    })
}

module.exports = {
    createCityList,
    initCard
}

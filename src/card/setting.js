const nunjucks = require('nunjucks')

function createSettingCards(settings) {
    return nunjucks.render('card/settingcards.html', {'settings': settings})
}

module.exports = {
    createSettingCards
}

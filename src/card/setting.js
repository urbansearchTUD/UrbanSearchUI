const nunjucks = require('nunjucks')

function createSettingCards(settings) {
    for (let key of Object.keys(settings)) {
        console.log(settings[key].category)
    }
    return nunjucks.render('card/settingcards.html', {'settings': settings})
}

module.exports = {
    createSettingCards
}

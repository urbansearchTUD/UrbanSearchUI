const settingcard = require('../card/setting')
const settings = require('./settings.json')

document.querySelector('.settings').innerHTML = settingcard.createSettingCards(settings.settings)

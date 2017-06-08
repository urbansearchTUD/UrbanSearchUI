const config = require('../../config')
const settingcard = require('../card/setting')
const settings = require('./settings.json')

settings.settings.forEach(setting => {
    setting['value'] = config.get(setting.config_key)
    if (setting.load_options) {
        setting['options'] = config.get(setting.config_options_key)
    }
})

document.querySelector('.settings').innerHTML = settingcard.createSettingCards(settings.settings)

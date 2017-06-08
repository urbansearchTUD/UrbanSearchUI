const config = require('./config.json')

function get(key) {
    if (key in config.custom) {
        return config.custom[key]
    } else if (key in config.default) {
        return config.default[key]
    } else {
        return null
    }
}

function set(key, value) {
    config.custom[key] = value
}

module.exports = {
    get,
    set
}

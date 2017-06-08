const config = require('./config.json')
const privateConfig = require('./config_private.json')

function get(key) {
    if (key in privateConfig) {
        return privateConfig[key]
    } else if (key in config) {
        return config[key]
    } else {
        return null
    }
}

function set(key, value) {
    privateConfig[key] = value
}

module.exports = {
    get,
    set
}

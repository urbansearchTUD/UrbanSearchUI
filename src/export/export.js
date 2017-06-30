config = require('../../config')

API_URL = config.get('api_url')
// API_URL = 'http://localhost:5000/api/v1/'

EXPORT_BUTTON = document.querySelector('#exportBtn')
THRESHOLD = document.querySelector('[data-probability-threshold]')

EXPORT_BUTTON.href = API_URL + 'data/export_all'

EXPORT_BUTTON.addEventListener('click', (e) => {
    e.preventDefault()
    const threshold = THRESHOLD.value

    if(threshold) {
        document.location.href = EXPORT_BUTTON.href + '/' + THRESHOLD.value
    }
    else {
        document.location.href = EXPORT_BUTTON.href
    }
})

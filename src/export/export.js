config = require('../../config')

API_URL = config.get('api_url')
// API_URL = 'http://localhost:5000/api/v1/'

BTN = document.querySelector('#exportBtn')
BTN.href = API_URL + 'data/export_all'

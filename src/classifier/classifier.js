const config = require('../../config')

API_URL = config.get('api_url')
TRAIN_BUTTON = document.querySelector('[data-train-button]')
TRAIN_PATH = '/classifier/train?default=true&save=true&equal=true'


TRAIN_BUTTON.addEventListener('click', (e) => {
    fetch(API_URL + TRAIN_PATH, {method: "POST"})
    .then((response) => {
        TRAIN_BUTTON.innerHTML = "DONE!"
        TRAIN_BUTTON.setAttribute('disabled', 'true')
    })
    .catch((err) => {
        console.log('Error during training call')
    })
})

const config = require('../../config')

const API_URL = config.get('api_url')

function getCities() {
    return fetch(API_URL + 'cities/all').then(response => {
        return response.json()
    }).then(json => {
        return json.cities
    }).catch((err) => {
        console.log(err)
    })
}

function getICRelations(cities) {
    return fetch(API_URL + 'relations/all').then(response => {
        return response.json()
    }).then(json => {
        return json.relations
    }).catch((err) => {
        console.log(err)
    })
}


module.exports = {
    getCities,
    getICRelations
}

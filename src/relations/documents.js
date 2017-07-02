const config = require('../../config')

const API_URL = config.get('api_url')
const GET_PATH = '/relations/document_info'

function getRelations(relation) {
    const cityFrom = relation.from.name
    const cityTo = relation.to.name
    const params = '?city_a=' + cityFrom + '&city_b=' + cityTo
    const url = API_URL+GET_PATH+params

    return fetch(url)
    .then((response) => {
        return response.json();
    })
    .catch((err) => {
        console.log('ERROR:', err);
    })
}

module.exports = {
    getRelations
}

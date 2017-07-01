const API_URL = 'http://citynetworks.bk.tudelft.nl/api/v1'
const GET_PATH = '/relations/document_info'

function getRelations(relation) {
    const cityFrom = relation.from.name
    const cityTo = relation.to.name
    const params = '?city_a=' + cityFrom + '&city_b=' + cityTo
    const url = API_URL+GET_PATH+params
    console.log(url);
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

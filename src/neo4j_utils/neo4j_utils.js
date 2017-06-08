const config = require('../../config')

const API_URL = config.get('neo4j_api_url')
const NEO4J_CREDS = config.get('neo4j_api_creds')
const REL_CATEGORIES = config.get('rel_categories_selected')

const HEADERS = new Headers({
    "Authorization": "Basic " + btoa(NEO4J_CREDS.user + ":" + NEO4J_CREDS.passwd),
    "Content-Type": "application/json",
    "Accept": "application/json"
})
const CITY_COLUMNS = ['id', 'name', 'latitude', 'longitude', 'population']

const CITY_QUERY = {
    "statements" : [{
        "statement" : "MATCH (n:City) "
                    + "RETURN id(n) AS id, n.name AS name, "
                    + "n.latitude AS latitude, n.longitude AS longitude, "
                    + "n.population AS population "
                    + "ORDER BY n.name"
    }]
}
const REL_QUERY = {
    "statements": [{
        "statement" : "MATCH (a:City)-[r:RELATES_TO]->(b:City) "
                    + "RETURN a.name, a.latitude, a.longitude, "
                    + "b.name, b.latitude, b.longitude, PROPERTIES(r)"
    }]
}

function getCities() {
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(CITY_QUERY)
    }).then(response => {
        return response.json()
    }).then(neo4jResponse => {
        if (!checkErr(neo4jResponse.errors)) {
            return parseCityResponse(neo4jResponse)
        } else {
            return []
        }
    })
}

function getICRelations(cities) {
    console.log(REL_QUERY)
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(REL_QUERY)
    }).then(response => {
        return response.json()
    }).then(neo4jResponse => {
        console.log(neo4jResponse)
        if (!checkErr(neo4jResponse.errors)) {
            return parseICRelationResponse(neo4jResponse)
        } else {
            return []
        }
    })
}

function checkErr(errors) {
    if (errors.length > 0) {
        console.log("ERROR during query: " + neo4jResponse.errors[0])
    }
}

function parseCityResponse(neo4jResponse) {
    let cities = []
    neo4jResponse.results[0].data.forEach(node => {
        city = {}
        city[CITY_COLUMNS[0]] = parseInt(node.row[0])
        city[CITY_COLUMNS[1]] = node.row[1]
        city[CITY_COLUMNS[2]] = parseFloat(node.row[2])
        city[CITY_COLUMNS[3]] = parseFloat(node.row[3])
        city[CITY_COLUMNS[4]] = parseInt(node.row[4])
        cities.push(city)
    })

    return cities
}

function parseICRelationResponse(neo4jResponse) {
    let relations = []
    neo4jResponse.results[0].data.forEach(rel => {
        relation = {}
        relation['from'] = {
            'name': rel.row[0],
            'lat': rel.row[1],
            'lng': rel.row[2]
        }
        relation['to'] = {
            'name': rel.row[3],
            'lat': rel.row[4],
            'lng': rel.row[5]
        }
        REL_CATEGORIES.forEach(cat => {
            relation[cat] = parseInt(rel.row[6][cat])
        })

        relations.push(relation)
    })

    return relations
}

module.exports = {
    getCities,
    getICRelations
}

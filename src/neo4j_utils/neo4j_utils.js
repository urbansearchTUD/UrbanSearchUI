const API_URL = "http://149.210.244.63:7474/db/data/transaction/commit/"
const HEADERS = new Headers({
    "Authorization": "Basic " + btoa("urbansearch:ur4ns34rch1s33n31ndpr0j3ct"),
    "Content-Type": "application/json",
    "Accept": "application/json"
})
const CITY_COLUMNS = ['id', 'name', 'latitude', 'longitude', 'population']
const REL_CATEGORIES = [
    'education', 'commuting', 'moving', 'shopping', 'leisure', 'collaboration',
    'transportation', 'other'
]
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
                    + "RETURN ID(a), a.name, a.latitude, a.longitude, "
                    + "ID(b), b.name, b.latitude, b.longitude, PROPERTIES(r)"
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
            'id': rel.row[0],
            'name': rel.row[1],
            'lat': rel.row[2],
            'lng': rel.row[3]
        }
        relation['to'] = {
            'id': rel.row[4],
            'name': rel.row[5],
            'lat': rel.row[6],
            'lng': rel.row[7]
        }
        REL_CATEGORIES.forEach(cat => {
            relation[cat] = parseInt(rel.row[8][cat])
        })
        console.log(relation)
        relations.push(relation)
    })

    return relations
}

module.exports = {
    getCities,
    getICRelations
}

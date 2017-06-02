const API_URL = "http://149.210.244.63:7474/db/data/transaction/commit/"
const HEADERS = new Headers({
    "Authorization": "Basic " + btoa("urbansearch:ur4ns34rch1s33n31ndpr0j3ct"),
    "Content-Type": "application/json",
    "Accept": "application/json"
})
const CITY_COLUMNS = ['id', 'name', 'latitude', 'longitude', 'population']
const CITY_QUERY = {
  "statements" : [ {
    "statement" : "MATCH (n:City) "
                + "RETURN id(n) AS id, n.name AS name, "
                + "n.latitude AS latitude, n.longitude AS longitude, "
                + "n.population AS population "
                + "ORDER BY n.name LIMIT 10"
  } ]
}

function getCities() {
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(CITY_QUERY)
    }).then(response => {
        return response.json()
    }).then(neo4jResponse => {
        return parseCityResponse(neo4jResponse)
    })
}

function parseCityResponse(neo4jResponse) {
    if (neo4jResponse.errors.length > 0) {
        console.log("Could not retrieve cities: " + neo4jResponse.errors[0])
        return []
    }

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

module.exports = {
    getCities
}

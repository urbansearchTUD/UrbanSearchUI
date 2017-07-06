const config = require('../../config')
const haversine = require('haversine')

const CATEGORIES = config.get('rel_categories')
const MAX = {}


function calculateGravityModel(relation, category) {
    const distance = relationDistance(relation)
    
    return (relation.rel[category].original*distance)/(relation.rel.to.population+relation.rel.from.population)
}

function calculateOccurence(relation, category) {
    return relation.rel[category].original
}

function calculateMax(max, r) {
    CATEGORIES.forEach((c) => {
        if(!max[c] || r[c].current > max[c]) {
            max[c] = r[c].current
        }
    })

    return max
}

function calculateRelMinPop(relation, category) {
    return relation.rel[category].original/Math.min(relation.rel.from.population, relation.rel.to.population)
}

function calculateRelPop(relation, category) {
    return relation.rel[category].original/(relation.rel.from.population+relation.rel.to.population)
}

function gravityTranform(relations, active) {
    transform(calculateGravityModel, relations, active)
}

function occurenceTransform(relations, active) {
    transform(calculateOccurence, relations, active)
}

function minPopTransform(relations, active) {
    transform(calculateRelMinPop, relations, active)
}

function popTransform(relations, active) {
    transform(calculateRelPop, relations, active)
}

function relationDistance(relation) {
    const start = {
        latitude: relation.rel.from.lat,
        longitude: relation.rel.from.lng
    }

    const finish = {
        latitude: relation.rel.to.lat,
        longitude: relation.rel.to.lng
    }

    return haversine(start, finish, 'meter')
}

function transform(t, relations, active) {
    const max = {}

    for(let r in relations) {
        let total = 0
        CATEGORIES.forEach((category) => {
            let tf = t(relations[r], category)
            if(active[category] && category !== 'total') {
                total += tf
            }
            relations[r].rel[category].current = tf

        })
        relations[r].rel.total.current = total
        calculateMax(max, relations[r].rel)
    }

    for(let r in relations) {
        relations[r].setOptions({
            strokeOpacity: Math.sqrt(relations[r].rel.total.current/max.total)
        })
    }
}

function transformTotal(t, relation) {
    return 1
}

module.exports = {
    gravity: gravityTranform,
    minpop: minPopTransform,
    occurence: occurenceTransform,
    pop: popTransform
}

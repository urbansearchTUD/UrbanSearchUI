const config = require('../../config')

const CATEGORIES = config.get('rel_categories')
const MAX = {}


function calculateGravityModel(relation, category) {
    return relation.rel[category].original/(relation.rel.from.population*relation.rel.to.population)
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

function gravityTranform(relations) {
    transform(calculateGravityModel, relations)
}

function occurenceTransform(relations) {
    transform(calculateOccurence, relations)
}

function transform(t, relations) {
    const max = {}

    for(let r in relations) {
        CATEGORIES.forEach((category) => {
            relations[r].rel[category].current = t(relations[r], category)
        })
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
    occurence: occurenceTransform,
    gravity: gravityTranform
}

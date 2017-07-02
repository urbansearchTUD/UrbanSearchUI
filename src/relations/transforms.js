const config = require('../../config')

const CATEGORIES = config.get('rel_categories')
const MAX = {}


function calculateGravityModel(relation, category) {
    return relation.rel[category].original/(relation.rel.from.population*relation.rel.to.population)
}

function calculateOccurence(relation, category) {
    return relation.rel[category].original
}

function calculateToggle(relation, category) {
    if(true) {

    }
    else {

    }
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

function categoryActiveTransform(relations, category, value) {
    const max = {}
    const old_max = {}

    for(let r in relations) {
        let relation = relations[r].rel
        calculateMax(old_max, relation)

        if(value) {
            relation['total'].current = relation['total'].current + relation[category].original
            relation[category].current = relation[category].original

        }
        else {
            relation['total'].current = relation['total'].current - relation[category].current
            relation[category].current = 0
        }

        calculateMax(max, relation)
    }

    console.log(old_max);
    console.log(max);

    for(let r in relations) {
        relations[r].setOptions({
            strokeOpacity: Math.sqrt(relations[r].rel.total.current/max.total)
        })
    }
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
    activeToggle: categoryActiveTransform,
    occurence: occurenceTransform,
    gravity: gravityTranform
}

const MAX = 1000000
const MIN = 750
const RANGE = MAX - MIN

function linear(value, options) {
    return value / RANGE
}

function sqrt(value, options) {
    return Math.sqrt(value / RANGE)
}

module.exports = {
    linear,
    sqrt
}

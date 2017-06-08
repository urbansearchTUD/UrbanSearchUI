const slider = require('nouislider')
const config = require('../../config')

const POP_SLIDER = document.querySelector('.slider--content')
const POP_MIN = document.querySelector('#slider--population__min')
const POP_MAX = document.querySelector('#slider--population__max')

function adjustPopulationText(values) {
    POP_MIN.innerHTML = parseInt(values[0])
    POP_MAX.innerHTML = parseInt(values[1])
}

function inRange(value, range) {
    return value >= range[0] && value <= range[1]
}

function createPopulationSlider(options) {
    slider.create(POP_SLIDER, {
        start: config.get('popslider_start'),
        behaviour: 'tap',
        connect: true,
        range: config.get('popslider_range')
    })

    const nodes = [
    	POP_SLIDER.querySelector('lower-value'),
    	POP_SLIDER.querySelector('upper-value')
    ]

    POP_SLIDER.noUiSlider.on('end', (e) => options.callback(e))
    POP_SLIDER.noUiSlider.on('update', (e) => adjustPopulationText(e))
}

module.exports = {
    createPopulationSlider,
    inRange
}

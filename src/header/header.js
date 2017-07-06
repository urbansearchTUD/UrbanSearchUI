const NAV = document.querySelector('[data-nav]')
const NAV_TOGGLE = document.querySelector('[data-nav-toggle]')

function init() {
    NAV_TOGGLE.addEventListener('click', (e) => {
        NAV.classList.toggle('open')
        NAV_TOGGLE.classList.toggle('open')
    })
}


module.exports = {
    init
}

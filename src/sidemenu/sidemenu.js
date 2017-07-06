
function init(sidemenu, map) {
    const toggle = document.querySelector('[data-menu-toggle]')

    toggle.addEventListener('click', (e) => {
        sidemenu.classList.toggle('closed')
        map.classList.toggle('full')
        toggle.classList.toggle('closed')
    })
}

module.exports = {
    init
}

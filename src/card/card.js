const nunjucks = require('nunjucks')
const citylist_template = require('./citylist')

function createList(cities) {
    console.log(citylist_template);
    return citylist_template.render({username: cities})
}

module.exports = {
    createList
}

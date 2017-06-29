function str2html(string) {
    return document.createRange().createContextualFragment(string)
}

module.exports = {
    str2html
}

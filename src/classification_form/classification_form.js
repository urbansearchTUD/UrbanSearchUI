const config = require('../../config')

const API_URL = config.get('api_url')
const API_APPEND_ALL_PATH = API_URL + '/datasets/append_all'
const API_DOCUMENT_PATH =  API_URL + '/documents/'
const EL = {}


function classifyDocument(data) {
    fetch(API_APPEND_ALL_PATH,{
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({'content-type': 'application/json'})
    })
    .then((response) => {
        return response.json()
    })
    .then((json) => {
        console.log(json)
    })
    .then(() => {
        return getDocument()
    })
    .then((doc) => {
        EL.form.querySelector('pre').textContent = doc
        resetCategoryButtons()
    })
    .catch((err) => {
        console.log(err)
    })
}

function getDocument() {
    return fetch(API_DOCUMENT_PATH)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let doc = data['document'].replace(/{.*}/g, '')
            return doc.replace('\n', '\b')
        })
        .catch((err) => {
            console.log(err);
        })
}

function init(form) {
    initElements(form)
    refreshArticle()

    EL.clear.onclick = (e) => {
        EL.pre.innerHTML = ''
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        submit(e.target)
    }

    EL.discard.onclick = (e) => {
        resetCategoryButtons()
        refreshArticle()
    }


}

function initElements(form) {
    EL.form = form
    EL.discard = form.querySelector('[data-discard-document]')
    EL.pre = form.querySelector('pre')
    EL.category_buttons = form.querySelectorAll('.button--category')
    EL.clear = form.querySelector('[data-clear-document]')

    Array.prototype.forEach.call(
        EL.category_buttons,
        function (item) {
            item.onclick = (e) => {
                e.target.classList.toggle('selected');
            }
        }
    )
}

function refreshArticle() {
    getDocument()
    .then((doc) => {
        EL.pre.textContent = doc
    })
}

function resetCategoryButtons() {
    EL.category_buttons.forEach((e) => {
        e.classList.remove('selected')
    })
}

function submit(form) {
    const doc = EL.pre.textContent
    const categories = []

    EL.category_buttons.forEach((el) => {
        if(el.classList.contains('selected')) {
            categories.push(el.value);
        }
    })

    if(categories.length) {
        classifyDocument({document: doc, categories})
    }
}

module.exports = {
    init
}

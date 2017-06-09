const API_BASE_URL = 'http://127.0.0.1:5000/api/v1'
const API_APPEND_ALL_PATH = API_BASE_URL + '/datasets/append_all'
const API_DOCUMENT_PATH =  API_BASE_URL + '/documents/test'
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
    .then((document) => {
        EL.form.querySelector('pre').textContent = document
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
            return data['document']
        })
        .catch((err) => {
            console.log(err);
        })
}

function init(form) {
    EL.form = form
    EL.discard = form.querySelector('[data-discard-document]')
    EL.pre = form.querySelector('pre')
    EL.category_buttons = form.querySelectorAll('.button--category')

    form.onsubmit = (e) => {
        e.preventDefault();
        submit(e.target)
    }

    EL.discard.onclick = (e) => {
        resetCategoryButtons()
        getDocument(form)
        .then((document) => {
            form.querySelector('pre').textContent = document
        })
    }

    Array.prototype.forEach.call(
        EL.category_buttons,
        function (item) {
            item.onclick = (e) => {
                e.target.classList.toggle('selected');
            }
        }
    )
}

function resetCategoryButtons() {
    EL.category_buttons.forEach((e) => {
        e.classList.remove('selected')
    })
}

function submit(form) {
    const document = EL.pre.textContent
    const categories = []

    Array.prototype.forEach.call(
        EL.category_buttons,
        (el) => {
            if(el.classList.contains('selected')) {
                categories.push(el.value);
            }
        }
    )

    if(categories.length) {
        classifyDocument({document, categories})
    }
}

module.exports = {
    init
}

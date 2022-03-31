/**
 * RENDER WITH TEMPLATE
 *
 * Adds a copy of the given template to the DOM, with the option of editing
 * before it gets added
 *
 * @param {html template} template template to add
 * @param {html element} parentElement element where the template clone will be added
 * @param {*} data Data to be passed into the given callback function
 * @param {function} callback Function to be format info in the template before adding
 */
export function renderWithTemplate(template, parentElement, data, callback) {
    let clone = template.content.cloneNode(true);

    if (callback != null) {
        clone = callback(clone, data);
    }
    parentElement.appendChild(clone);
}

export function renderListWithTemplate(
    template,
    parentElement,
    list,
    callback
) {
    list.forEach((product) => {
        const clone = template.content.cloneNode(true);
        const hydratedTemplate = callback(clone, product);
        parentElement.appendChild(hydratedTemplate);
    });
}

export function getParam(param) {
    const querystring = window.location.search;
    const urlParams = new URLSearchParams(querystring);
    const product = urlParams.get(param);

    return product;
}

/**
 * LOAD TEMPLATE
 *
 * Creates HTML template using given path to html file
 *
 * @param {string} path path to html file
 * @returns Template made from html file
 */
export async function loadTemplate(path) {
    const html = await fetch(path).then((response) => response.text());
    const template = document.createElement('template');
    template.innerHTML = html;
    return template;
}

/**
 * LOAD HEADER FOOTER
 *
 * Adds header and footer to the document using partials in the project
 */
export async function loadHeaderFooter() {
    const headerTemplate = await loadTemplate('/partials/header.html');
    const footerTemplate = await loadTemplate('/partials/footer.html');

    const domHeader = document.querySelector('#header');
    const domFooter = document.querySelector('#main-footer');

    renderWithTemplate(headerTemplate, domHeader);
    renderWithTemplate(footerTemplate, domFooter);

    let navbar = document.querySelector('#header');

    if (
        window.location.pathname == '/index.html' ||
        window.location.pathname == '/' ||
        window.location.pathname == '/signup' ||
        window.location.pathname == '/login.html'
    ) {
        document.querySelector('#login').style.display = 'block';
        document.querySelector('#signup').style.display = 'block';
        document.querySelector('.dropdown').style.display = 'none';
    } else {
        document.querySelector('#login').style.display = 'none';
        document.querySelector('#signup').style.display = 'none';
        document.querySelector('.dropdown').style.display = 'block';
    }

    // // Get the offset position of the navbar
    // let sticky = navbar.offsetTop;

    // function dynamicNav() {
    //     if (
    //         document.body.scrollTop > 80 ||
    //         document.documentElement.scrollTop > 80
    //     ) {
    //         navbar.classList.add('sticky');
    //         navbar.style.padding = '20px 0px';

    //         document
    //             .querySelector('#logo-text')
    //             .classList.add('small-logo-text');
    //     } else {
    //         navbar.classList.remove('sticky');
    //         navbar.style.padding = '50px 10px';
    //         document
    //             .querySelector('#logo-text')
    //             .classList.remove('small-logo-text');
    //     }
    // }
    // window.onscroll = function () {
    //     dynamicNav();
    // };
}

export function validateInput(elementSelector, regexPattern) {
    const value = document.querySelector(elementSelector).value;

    return regexPattern.test(value);
}

export function validateAllInputs(inputsToValidate) {
    const results = [];
    // inputsToValidate.forEach(case => {
    //     results.append({value: case.elementSelector, result: validateInput(case.elementSelector, case.regexPattern)});
    // });
}

export function saveAuthToken(authToken) {
    console.log('Saving authtoken ', authToken);
    localStorage.setItem('authToken', JSON.stringify(authToken));
}

export function readAuthToken() {
    return JSON.parse(localStorage.getItem('authToken'));
}

export function addOnClick(element, action) {
    element.addEventListener('click', action);
}

export function createNewElement(elementType, className, idName, innerString) {
    const newElement = document.createElement(elementType);

    newElement.classList.add(className);
    newElement.id = idName;
    newElement.innerHTML = innerString;

    return newElement;
}

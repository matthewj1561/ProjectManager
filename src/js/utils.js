import { doc } from 'prettier';

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
        window.location.pathname == '/'
    ) {
        document.querySelector('#nav-link').style.display = 'block';
        document.querySelector('.dropdown').style.display = 'none';
    } else {
        document.querySelector('#nav-link').style.display = 'none';
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

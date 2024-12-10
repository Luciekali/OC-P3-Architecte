//***** Affiche les elements du mode édition dans le header */
export function displayEditionHeader() {
    const header = document.querySelector("header");

    const editionBar = document.createElement("div");
    const logo = document.createElement("i");
    logo.classList.add("fa-regular");
    logo.classList.add("fa-pen-to-square");
    const editionText = document.createElement("p");
    editionText.innerText = "Mode édition"

    const headerContent = document.createElement("div");
    const headerTitle = document.querySelector("h1");
    const headerNav = document.querySelector("header nav");

    header.classList.add("edition");
    editionBar.classList.add("edition-bar");
    headerContent.className = "header-content";


    header.appendChild(editionBar);
    editionBar.appendChild(logo);
    editionBar.appendChild(editionText);
    headerContent.appendChild(headerTitle);
    headerContent.appendChild(headerNav);
    header.appendChild(headerContent);
}


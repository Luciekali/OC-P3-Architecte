import { getStoredId, getStoredToken } from "./login.js";
import { displayLogout } from "./login.js";
import { displayEditionHeader } from "./admin/display-header.js";
import { displayEditionBtn } from "./admin/display-edition-btn.js";
import { displayModal } from "./admin/modale/display-modale.js"

async function displayHomePage() {
    //*****Affichage des travaux */
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    for (const work of works) {
        displayWork(work);
    }


    const userId = getStoredId();
    const userToken = getStoredToken();
    //***** Fonctionnalités visiteur */
    if (!userId || !userToken) {
        const responseCat = await fetch("http://localhost:5678/api/categories");
        const categories = await responseCat.json();
        const filterBar = createFilterBar();

        for (const category of categories) {
            const filterBtn = displayFilterBtn(category, filterBar)
            filterBtn.addEventListener('click', () => {
                document.querySelector(".gallery").innerHTML = "";
                displayFilteredworks(works, categories);
            })
        }

        //***** Evenement qui affiche les travaux par catégorie *****/
        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach((filterBtn, index) => {
            filterBtn.addEventListener("click", () => {
                document.querySelector(".gallery").innerHTML = "";
                displayFilteredworks(works, categories[index]);
            });
        });

        //***** Evenement qui reset / affiche tous les travaux *****//
        const resetBtn = createResetBtn(filterBar);
        resetBtn.addEventListener("click", () => {
            document.querySelector(".gallery").innerHTML = "";
            for (const work of works) {
                displayWork(work)
            }
        })

        // ***** Evenement qui ajoute style pour les boutons selectionnés *****//
        const allBtns = document.querySelectorAll(".filter-bar button")
        allBtns.forEach((button) => {
            button.addEventListener("click", () => {
                allBtns.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
            });
        });
    }

    //***** Fonctionnalités administrateur */
    if (userId && userToken) {

        displayLogout()
        displayEditionHeader()

        //***** Evenement affichage de la modale au click */
        const editionBtn = displayEditionBtn();
        editionBtn.addEventListener("click", (displayModal))
    }
}

displayHomePage()

//***** Affichage des travaux *****//
export function displayWork(work) {

    const workFigure = document.createElement("figure");
    const figureImage = document.createElement("img");
    figureImage.src = work.imageUrl;

    const figureCaption = document.createElement("figcaption");
    figureCaption.innerText = work.title

    const gallery = document.querySelector(".gallery");
    gallery.appendChild(workFigure)
    workFigure.appendChild(figureImage)
    workFigure.appendChild(figureCaption)
}

//***** Creer les elements de la barre de recherche *****//
function createFilterBar() {

    const gallery = document.querySelector(".gallery");
    const portfolio = document.getElementById("portfolio");
    const filterBar = document.createElement("div");
    filterBar.className = "filter-bar";

    portfolio.insertBefore(filterBar, gallery);
    return filterBar;
}

//***** Création d'un bouton reset  ******//
function createResetBtn(filterBar) {
    const resetBtn = document.createElement("button");
    resetBtn.innerHTML = "Tous";
    resetBtn.className = "reset-btn"

    const firstFilterBtn = filterBar.firstChild;
    filterBar.insertBefore(resetBtn, firstFilterBtn)

    resetBtn.classList.add("active"); //css selectionné par defaut //
    return resetBtn
}

//*****  Creer les boutons filtres dynamiques avec noms de categories *****//
function displayFilterBtn(category, filterBar) {
    const filterBtn = document.createElement("button")
    filterBtn.className = "filter-btn"
    filterBtn.innerHTML = category.name
    filterBtn.value = category.name

    filterBar.appendChild(filterBtn);

    return filterBtn
}

//*****  Fonction qui filtre pour chaque work de la meme catégorie *****//
function displayFilteredworks(works, category) {
    const filteredWorks = works.filter((work) => {
        return work.category.name === category.name;
    });
    filteredWorks.forEach((work) => displayWork(work))
}

//***** réactualise l'index des travaux par un appel d'api */
export async function resetIndexWork() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    return works
}















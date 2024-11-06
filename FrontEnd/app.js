import { getStoredId, getStoredToken } from "./login.js";

async function displayHomePage() {
    const responseCat = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCat.json();

    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    const filterBar = createFilterBar();
    createResetBtn(filterBar);

    for (const work of works) {
        displayWork(work);
    }

    for (const category of categories) {
        displayFilterBtn(category, filterBar)
    }

    //***** Evenement qui affiche les travaux par catégorie *****/
    const resetBtn = document.querySelector(".reset-btn");
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach((filterBtn, index) => {
        filterBtn.addEventListener("click", () => {
            document.querySelector(".gallery").innerHTML = "";
            displayFilteredworks(works, categories[index]);
        });
    });

    //***** Evenement qui reset / affiche tous les travaux *****//
    const allBtns = document.querySelectorAll("#portfolio button")
    resetBtn.addEventListener("click", () => {
        document.querySelector(".gallery").innerHTML = "";
        for (const work of works) {
            displayWork(work)
        }
    })

    // ***** Evenement qui ajoute style pour les boutons selectionnés *****//
    allBtns.forEach((button) => {
        button.addEventListener("click", () => {
            allBtns.forEach((btn) => btn.classList.remove("clicked"));
            button.classList.add("clicked");
        });
    });

    //***** Fonctionnalités administrateur */
    const userId = getStoredId();
    const userToken = getStoredToken();

    if (userId && userToken) {

        displayLogout()
        console.log(localStorage)



    }
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear()
            displayLogin()
            console.log(localStorage)
        })
    }
}
displayHomePage()
//***** Affichage des travaux *****//
function displayWork(work) {

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
    const filterBar = document.createElement("ul");


    portfolio.insertBefore(filterBar, gallery);
    return filterBar;
}

//***** Création d'un bouton reset  ******//
function createResetBtn(filterBar) {

    const resetItem = document.createElement("li");
    const resetBtn = document.createElement("button");
    resetBtn.innerHTML = "Tous";
    resetBtn.className = "reset-btn"

    filterBar.appendChild(resetItem);
    resetItem.appendChild(resetBtn);

    resetBtn.classList.add("clicked"); //css selectionné par defaut //
    return resetBtn
}

//*****  Creer les boutons filtres dynamiques avec noms de categories *****//
function displayFilterBtn(category, filterBar) {
    const filterItem = document.createElement("li")
    const filterBtn = document.createElement("button")
    filterBtn.className = "filter-btn"
    filterBtn.innerHTML = category.name
    filterBtn.value = category.name

    filterItem.appendChild(filterBtn);
    filterBar.appendChild(filterItem);
}

//*****  Fonction qui filtre pour chaque work de la meme catégorie *****//
function displayFilteredworks(works, category) {
    const filteredWorks = works.filter((work) => {
        return work.category.name === category.name;
    });
    filteredWorks.forEach((work) => displayWork(work))
}
function displayLogout() {
    const loginLink = document.querySelector(".login-link");
    const logout = document.createElement("button");
    logout.innerHTML = "logout"
    const loginItem = document.querySelector(".login-item");
    loginItem.appendChild(logout);
    loginLink.remove();
    logout.classList.add("logout-btn")
}

function displayLogin() {
    const logout = document.querySelector(".logout-btn");
    logout.remove();
    const loginLink = document.createElement("a");
    const loginItem = document.querySelector(".login-item");
    loginItem.appendChild(loginLink);
    loginLink.setAttribute("href", "login.html");
    loginLink.innerHTML = "login"
}














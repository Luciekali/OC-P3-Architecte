//***** Affiche le mode édition pour la partie projet #portfolio  */
export function displayEditionBtn() {
    const portfolio = document.getElementById("portfolio");
    const title = document.querySelector("#portfolio h2");
    const button = document.createElement("button");
    button.innerHTML = "modifier";
    button.className = "edition-btn"

    const div = document.createElement("div");
    const logo = document.createElement("i");

    logo.classList.add("fa-regular");
    logo.classList.add("fa-pen-to-square");
    div.classList.add("edition-title-div");


    portfolio.insertBefore(div, title)
    div.appendChild(title)
    div.appendChild(button)
    button.appendChild(logo)
    return button
}



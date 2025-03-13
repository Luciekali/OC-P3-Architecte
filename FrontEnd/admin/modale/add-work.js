import { removeModal } from "./display-modale.js";
import { displayWork } from "../../app.js";
import { resetIndexWork } from "../../app.js";

// ***** permet d'actualiser l'état du bouton submit
export let checkInputs = {
    img: false,
    title: false,
    categorie: false
}

//*****  ajoute un travail */
export async function postWork(formData) {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        })

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }
        await addWorkReponse(response);
    }
    catch (error) {
        const statusCode = parseInt(error.message)
        alertErrorAddWork(statusCode)
    }
}

//***** Réalise les actions selon le type d'erreur pour l'ajout */
function alertErrorAddWork(status) {
    switch (status) {
        case 401:
            console.error("Non autorisé (401).");
            alert("Votre session a expiré, veuillez vous reconnecter");
            removeModal()
            location.replace("http://127.0.0.1:5500/login.html?");
            break;
        case 500:
            console.error("Erreur interne du serveur (500).");
            alert(" Une erreur est survenue sur nos serveurs. Veuillez réessayer plus tard.");
            break;
        default:
            console.error(`Erreur inattendue (${status}).`);
            alert("Un problème inattendu est survenu. Veuillez réessayer plus tard.");
            break;
    }
}

//***** Réalise les actions après reussite d'ajout */
async function addWorkReponse(response) {
    if ((response.status === 201)) {
        const works = await resetIndexWork();
        const pageGallery = document.querySelector('.gallery')
        pageGallery.innerHTML = ''

        for (const work of works) {
            displayWork(work)
        }
        removeModal()
        alert("votre photo a été ajoutée avec succès!")
    }
}

// ***** Verifie le format et la taille de l'image du formulaire
export async function checkImageProperties() {
    const div = document.querySelector('.div-img-form');
    const image = document.getElementById('imgInput');
    const imageProperties = image.files[0];
    let imageTypeError = null;
    let imageSizeError = null;

    if ((imageProperties.type !== 'image/png') && (imageProperties.type !== "image/jpg")) {
        if (!imageTypeError) {
            imageTypeError = document.createElement('p');
            imageTypeError.innerText = 'Votre photo n\'est pas au format png ou jpg'
            imageTypeError.className = 'errorInputModal'
            div.appendChild(imageTypeError)
            checkInputs.img = false
        }
    }
    if (imageProperties.size > 41943040) {
        if (!imageSizeError) {
            imageSizeError = document.createElement('p');
            imageSizeError.innerText = 'Votre photo fait plus de 40Mo'
            imageSizeError.className = 'errorInputModal'
            checkInputs.img = false
            div.appendChild(imageSizeError)
        }
    }
    else {
        if ((imageProperties.size < 41943040) && ((imageProperties.type === 'image/png') || (imageProperties.type === "image/jpg")) && (imageProperties !== null)) {
            checkInputs.img = true;
            verifiedImgDisplay(imageProperties)
        }
    }
}

// ***** Verifie qu'il y ait un titre
export function checkTitleProperties() {
    const titleform = document.getElementById('title');
    if (((titleform) && (titleform !== ""))) {
        checkInputs.title = true;
    }
    else {
        checkInputs.title = false
    }
}

// ***** Verifie qu'il y ait une catégorie
export function checkCatProperties() {
    const category = document.getElementById('category');
    if (((category) && (category !== ""))) {
        checkInputs.categorie = true;
    }
    else {
        checkInputs.categorie = false
    }
}

//***** actualise l'etat du bouton submit */
export function submitBtnActivation() {
    const addFormBtn = document.getElementById('add-form-btn')
    if (!checkInputs.img || !checkInputs.title || !checkInputs.categorie) {
        addFormBtn.disabled = true;
    } else {
        addFormBtn.disabled = false;
    }
}

//***** Recupère l'URL de l'image envoyée pour l'afficher sur la modale */
function verifiedImgDisplay(img) {
    const div = document.querySelector('.div-img-form')
    const icon = document.querySelector('.fa-regular')
    const label = document.querySelector('.img-form-label')
    const paragraph = document.querySelector('.img-form-infos')
    const reader = new FileReader()

    reader.onload = function (event) {
        icon.remove()
        label.remove()
        paragraph.remove()
        const verifiedImg = document.createElement('img');

        verifiedImg.src = event.target.result
        verifiedImg.className = 'verified-img'
        div.appendChild(verifiedImg)
    }
    reader.readAsDataURL(img);
}
import { getWorkId, deleteWorkRequest } from "./delete-work.js";
import { displayWork } from "../../app.js";
import { checkImageProperties, checkTitleProperties, checkCatProperties, postWork, submitBtnActivation, checkInputs } from "./add-work.js";
import { resetIndexWork } from "../../app.js";
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();


//***** Si il n'y en a pas, creer modale, modale galerie et affiche la galerie*/
export async function displayModal() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    let modale = document.querySelector('.modal')
    if ((!modale)) {
        modale = createModal()
    }
    await createModalGallery(modale);
    for (const work of works) {
        displayModalPhotos(work)
    }
}
// ***** Créé la modale
function createModal() {
    const header = document.querySelector('header')
    const body = document.querySelector('body');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const modale = document.createElement('div');
    modale.className = 'modal';

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    body.insertBefore(overlay, header)
    overlay.appendChild(modale)
    modale.appendChild(modalBody)

    return modale
}

//***** Creer les elements de la modale gallerie */
function createModalGallery(modale) {
    const modalBody = document.querySelector('.modal-body')

    modalBody.innerHTML = '';
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalCloseBtn = document.createElement('button');
    modalCloseBtn.className = 'modal-close-btn';

    const modalCloseLogo = document.createElement('i');
    modalCloseLogo.className = 'fa-solid fa-xmark'

    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.innerText = 'Galerie photo';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.classList.add('galleryModal')

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    const addPhotoBtn = document.createElement('button');
    addPhotoBtn.className = 'add-photo-btn';
    addPhotoBtn.innerHTML = 'Ajouter une photo'

    modale.appendChild(modalBody)
    modalFooter.appendChild(addPhotoBtn);
    modalHeader.appendChild(modalCloseBtn);
    modalCloseBtn.appendChild(modalCloseLogo);
    modalHeader.appendChild(modalTitle);
    modalBody.appendChild(modalHeader);
    modalBody.appendChild(modalContent);
    modalBody.appendChild(modalFooter);

    // Evenement bouton de fermeture
    modalCloseBtn.addEventListener('click', removeModal);
    //***** Evenement qui modifie le contenu de la modale */
    modalBody.addEventListener("click", (event) => {
        displayChangingModal(event)
    })

    // Empêche la propagation des clics à l'intérieur de la modale
    modale.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    const overlay = document.querySelector('.overlay')

    // Fermeture au clic en dehors de la modale
    overlay.addEventListener('click', (event) => {
        if (
            !modale.contains(event.target)) {
            removeModal();
        }
    })
    return modale
}

// ***** change la page de la modale en fonction du bouton cliqué
async function displayChangingModal(event) {
    const backBtn = document.querySelector('.back-btn');
    const backLogo = document.querySelector('.fa-arrow-left');
    const addPhotoBtn = document.querySelector('.add-photo-btn');
    if ((event.target === backBtn) || (event.target === backLogo)) {
        displayModal();
    }
    if (event.target === addPhotoBtn) {
        displayModalAddPhoto()
        createFormAddPhoto()
    }
}

//***** Affiche les travaux */
async function displayModalPhotos(work) {
    const modalContent = document.querySelector('.modal-content');
    const workFigureModal = document.createElement("figure");
    workFigureModal.className = 'modale-figure'
    const figureImageModal = document.createElement("img");
    figureImageModal.src = work.imageUrl;
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-work-btn'
    deleteBtn.value = work.id;
    const logo = document.createElement('i');
    logo.className = 'fa-solid fa-trash-can'

    modalContent.appendChild(workFigureModal);
    workFigureModal.appendChild(deleteBtn);
    workFigureModal.appendChild(figureImageModal)

    deleteBtn.appendChild(logo);

    //***** Evenement qui lance les fonctions pour supprimer un work de : la base de donnée et de la modale
    deleteBtn.addEventListener("click", async (event) => {
        const workId = getWorkId(event);
        deleteWorkRequest(workId);
        const works = await resetIndexWork();

        modalContent.innerHTML = '';
        for (const work of works) {
            displayModalPhotos(work)
        }
        const pageGallery = document.querySelector('.gallery')
        pageGallery.innerHTML = ''
        for (const work of works) {
            displayWork(work)
        }
    });

};

// ***** cree les elements de la modale d'ajout photo
function displayModalAddPhoto() {

    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = ""

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalCloseBtn = document.createElement('button');
    modalCloseBtn.className = 'modal-close-btn';

    const modalCloseLogo = document.createElement('i');
    modalCloseLogo.className = 'fa-solid fa-xmark'
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn'

    const backLogo = document.createElement('i');
    backLogo.className = 'fa-solid fa-arrow-left'

    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.innerText = 'Ajout photo';


    const buttons = document.createElement('div')
    buttons.className = 'header-btns'


    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';



    modalBody.appendChild(modalHeader);
    modalBody.appendChild(modalContent);

    modalHeader.appendChild(buttons);
    buttons.appendChild(backBtn);
    backBtn.appendChild(backLogo);
    buttons.appendChild(modalCloseBtn);
    modalCloseBtn.appendChild(modalCloseLogo)
    modalHeader.appendChild(modalTitle);
    // Evenement bouton de fermeture
    modalCloseBtn.addEventListener('click', removeModal);
    return backBtn
}

//*****creer le formulaire pour ajouter une photo 
async function createFormAddPhoto() {
    const responseCat = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCat.json();

    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.add('add-photo');

    const addWorkForm = document.createElement('form');
    addWorkForm.id = 'add-work-form';

    // Input image 
    const divImg = document.createElement('div');
    divImg.className = 'div-img-form';

    const imgLogo = document.createElement('i');
    imgLogo.className = "fa-regular fa-image";
    const imgInput = document.createElement('input');
    imgInput.type = 'file'
    imgInput.id = 'imgInput'
    imgInput.name = 'image'
    imgInput.alt = 'ajouter une image'
    imgInput.accept = '.jpg, .png'

    const imgLabel = document.createElement('label');
    imgLabel.setAttribute('for', 'imgInput');
    imgLabel.textContent = '+ Ajouter photo';
    imgLabel.className = 'img-form-label'
    imgInput.style.opacity = 0;

    const imgInfos = document.createElement('p');
    imgInfos.textContent = 'jpg, png : 4mo max';
    imgInfos.className = 'img-form-infos'
    // Input titre 
    const divTitle = document.createElement('div');
    divTitle.className = 'div-title-form'
    const labelTitle = document.createElement('label');
    labelTitle.setAttribute('for', 'title');
    labelTitle.textContent = 'Titre';

    const title = document.createElement('input');
    title.className = 'title-form-photo'
    title.type = 'text';
    title.id = 'title';
    title.name = 'title'
    title.required = 'required';

    //Input catégorie
    const divCat = document.createElement('div');
    divCat.className = 'div-category-form'

    const labelCategory = document.createElement('label');
    labelCategory.setAttribute('for', 'category')
    labelCategory.textContent = 'Catégorie'

    const categorySelect = document.createElement('select');
    categorySelect.className = 'select-input'
    categorySelect.id = 'category';
    categorySelect.name = 'category';
    categorySelect.required = 'required'

    const emptyOption = document.createElement('option');
    emptyOption.value = "";
    emptyOption.textContent = "";

    const arrowDown = document.createElement('i');
    arrowDown.className = "fa-solid fa-chevron-down"

    //Bouton 
    const addFormBtn = document.createElement('button');
    addFormBtn.id = 'add-form-btn';
    addFormBtn.innerHTML = 'Valider'
    addFormBtn.type = 'submit';
    addFormBtn.disabled = true

    modalContent.appendChild(addWorkForm);
    addWorkForm.appendChild(divImg)
    addWorkForm.appendChild(divTitle)
    addWorkForm.appendChild(divCat)
    addWorkForm.appendChild(addFormBtn)

    divImg.appendChild(imgLogo)
    divImg.appendChild(imgInput);
    divImg.appendChild(imgLabel);
    divImg.appendChild(imgInfos)

    divTitle.appendChild(labelTitle);
    divTitle.appendChild(title);

    divCat.appendChild(labelCategory);
    divCat.appendChild(categorySelect);
    divCat.appendChild(arrowDown)
    categorySelect.appendChild(emptyOption);

    //***** Evenements du formulaire */

    // Catégories
    for (const category of categories) {
        const categoryOption = createCategoryOptions(category);
        categorySelect.appendChild(categoryOption);
    }
    // verifie validité img
    imgInput.addEventListener("change", () => {
        checkImageProperties()
        submitBtnActivation()
    })

    // verifie validité titre 
    title.addEventListener("change", () => {
        checkTitleProperties()
        submitBtnActivation()
    })

    // verifie validité catégorie
    categorySelect.addEventListener("change", () => {
        checkCatProperties()
        submitBtnActivation()
    })
    //Convertit les données du formulaire formulaire et les envoie
    addWorkForm.addEventListener('submit', async (event) => {
        const imgInput = document.getElementById('imgInput');
        const title = document.getElementById('title');
        const category = document.getElementById('category');

        event.preventDefault()
        const formData = new FormData();
        formData.append("image", imgInput.files[0]);
        formData.append("title", title.value);
        formData.append("category", category.value);

        await postWork(formData);
    })

}

// ***** Creer l'element option pour chaque catégorie
function createCategoryOptions(category) {
    const categoryOption = document.createElement('option');
    categoryOption.value = `${category.id}`;
    categoryOption.textContent = `${category.name}`
    return categoryOption
}

//***** Supprime la modale */
export function removeModal() {
    const overlay = document.querySelector('.overlay')
    overlay.remove()
}

const response = await fetch("http://localhost:5678/api/works");
const works = await response.json()



function displayWorks (works) {
    for (let i=0; i < works.length; i++){
      
        const work = works[i];

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
}

const resetBtn = document.createElement("button");
            resetBtn.innerHTML = "Tous"
            resetBtn.value = works

function displayFilterBar (works) {{
    const sectionPortefolio = document.querySelector("#portfolio");
    const gallery = document.querySelector(".gallery");
    const filterBar = document.createElement ("ul");
        const AllCategoryNames = works.map(work => work.category.name)
        const categoryNames = AllCategoryNames.reduce (function (acc, cat,){
            if (acc.indexOf(cat) === -1)  {
                acc.push(cat)
            }
            return acc;
            
        }, []);

        
        const resetItem = document.createElement("li");
        filterBar.appendChild(resetItem)
        resetItem.appendChild(resetBtn)


        for (let i =0; i< categoryNames.length; i++) {
            const category = categoryNames[i]

            const filterItem = document.createElement("li")
            const filterBtn = document.createElement("button")
                filterBtn.innerHTML = category
                filterBtn.value = category

        filterBar.appendChild(filterItem)
        filterItem.appendChild(filterBtn)
        
        sectionPortefolio.insertBefore(filterBar, gallery); 




filterBtn.addEventListener("click", function () {
    const filteredWorks = works.filter(function(work){
        return work.category.name === filterBtn.value
    })
    document.querySelector(".gallery").innerHTML ="";
    displayWorks(filteredWorks)
})

 resetBtn.addEventListener("click", function () {
        document.querySelector(".gallery").innerHTML ="";
    displayWorks(works)
    })
    }}}

   


displayWorks(works)
displayFilterBar(works)
console.log(works)

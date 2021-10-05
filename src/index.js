const randomURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
// html elements 
const img = document.querySelector('#drink-image')
const h3 = document.querySelector('#drink-name')
const ingredients = document.querySelector('#ingredients-list')
const instructions = document.querySelector('#instructions')
const searchForm = document.querySelector('#search-form')
const resultContainer = document.getElementById('results-container')
const nameSearchSelector = document.getElementById('searchByName')
const ingredientSearchSelector = document.getElementById('searchByIngredient')
const addFav = document.querySelector('#add_fav')
const showFav = document.querySelector('#show-favs')


document.addEventListener('DOMContentLoaded', getRandom)

// gets a random drink using a fetch request to the drinks api
function getRandom() {
    fetch(randomURL).then(resp=>resp.json()).then(data=>data.drinks.forEach(element => {
        renderDrink(element)
    }))
}

// reads given drink and displays it on the page
function renderDrink(drink) {
    img.src = drink.strDrinkThumb
    img.alt = drink.strDrink
    h3.textContent = drink.strDrink
    
    let ingredientList = Object.entries(drink).filter((property) => {
        return property[0].substring(0, 13) === 'strIngredient' && property[1] != null
    })

    ingredients.innerHTML = ''
    ingredientList.forEach(element=>renderIngredients(element,drink))

    instructions.textContent = drink.strInstructions
}

// reads given ingredient and creates a new li on the page
function renderIngredients(element, drink) {
    let newIngredient = document.createElement('li')
    measurekey = 'strMeasure'+ element[0].substring(13)
        if (drink[measurekey]===null) {
            newIngredient.textContent = element[1]
        } else{
            newIngredient.textContent = drink[measurekey] + " " + element[1]
        }
    
    ingredients.append(newIngredient)
}

function searchDrink(value) {
    if(!nameSearchSelector.checked && !ingredientSearchSelector.checked) {
        alert('Please select a search method!')
    }
    else if(ingredientSearchSelector.checked) {
        searchByIngredient(value)
    }
    else if(nameSearchSelector.checked) {
        searchByName(value)
    }
}

function renderSearch(drink) {
    const newDiv = document.createElement('div')
    const newImg = document.createElement('img')
    const newName = document.createElement('h5')
    const imgURL = drink.strDrinkThumb + '/preview'
    newImg.src = imgURL
    newName.textContent = drink.strDrink
    newDiv.append(newImg)
    newDiv.append(newName)
    resultContainer.append(newDiv)
    newDiv.addEventListener('click', () => renderDrink(drink))
}

function searchByName(name) {
    const searchURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name
    fetch(searchURL).then(resp=>resp.json()).then(json=>json.drinks.forEach(element=>renderSearch(element)))
}

function searchByIngredient(ingredient) {
    if(ingredient === '' || ingredient == null) {
        alert('Please enter an ingredient!') 
        
    } else {
        const searchURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + ingredient
        fetch(searchURL).then(resp=>resp.json()).then(json=>json.drinks.forEach(element=>{
            searchByName(element.strDrink)
    }))
    }
    
}

// when the form is submitted, an api call is made to 
// search for the provided drink name and displays the results
searchForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log(e)
    resultContainer.innerHTML = ''
    searchTerm = document.querySelector('#drink-search').value
    console.log(searchTerm)
    searchDrink(searchTerm)
})

document.addEventListener('DOMContentLoaded', getFav)

// gets a random drink using a fetch request to the drinks api
function getFav() {
    resultContainer.innerHTML = ''
    fetch('http://localhost:3000/favorites').then(resp=>resp.json()).then(data=>data.forEach(element=>searchByName(element.strDrink)))
}

addFav.addEventListener('click', addFavFunc)

function addFavFunc() {
    const new_fav = {}
    const curr_drink = document.querySelector('#drink-name').textContent
    const curr_img = document.querySelector('#drink-image').src
    new_fav.strDrink = curr_drink
    new_fav.strDrinkThumb = curr_img
    fetch('http://localhost:3000/favorites', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(new_fav)
    }).then(resp=>resp.json())
    .then(console.log)
    .catch(error => console.log('error:' + error))
    getFav()
}

showFav.addEventListener('click', getFav)
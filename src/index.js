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
let favorites = []

// gets a random drink using a fetch request to the drinks api
function getRandom() {
    fetch(randomURL).then(resp=>resp.json()).then(data=>data.drinks.forEach(element => {
        renderDrink(element)
    }))
}

// loads a random drink on page load
document.addEventListener('DOMContentLoaded', getRandom)


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

// renders a drink element to display on the page
function renderSearch(drink) {
    const newDiv = document.createElement('div')
    newDiv.id = drink.strDrink
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

// searches for a drink by a method determined by which radio button is selected
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

// searches for a drink by its name, returns a list of drinks
// with similar names
function searchByName(name) {
    const searchURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name
    fetch(searchURL).then(resp=>resp.json()).then(json=>json.drinks.forEach(element=>renderSearch(element)))
}

// returns one drink strictly matching the given name
function strictSearchByName(name) {
    const searchURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name
        fetch(searchURL)
        .then(resp=>resp.json())
        .then(favorites=> {
            console.log(name)
            console.log(favorites)
            let strictDrink = favorites.drinks.filter(drink => drink.strDrink === name)
            // let drink = json.drinks.filter(drink.strDrink === name)
            console.log(strictDrink)
            renderSearch(strictDrink[0])
        })

}

// returns a list of drinks that have the given ingredient in them
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

// First Event Listener
// When the form is submitted, an api call is made to 
// search for the provided drink name and displays the results
searchForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log(e)
    resultContainer.innerHTML = ''
    searchTerm = document.querySelector('#drink-search').value
    console.log(searchTerm)
    searchDrink(searchTerm)
})

// Second Event Listener
// Event listener placed on the document calls getFav to load favorite drinks
// on page load 
document.addEventListener('DOMContentLoaded', getFav)

// gets a random drink using a fetch request to the drinks api
function getFav() {
    resultContainer.innerHTML = ''
    fetch('http://localhost:3000/favorites').then(resp=>resp.json()).then(data=>data.forEach(element=>strictSearchByName(element.strDrink)))
}

// Third Event Listener
// Gives functionality to the addFav button 
addFav.addEventListener('click', addFavFunc)

// adds selected drink to the favorites list in the db
function addFavFunc() {
    const new_fav = {}
    const curr_drink = document.querySelector('#drink-name').textContent
    const curr_img = document.querySelector('#drink-image').src

    // add check to see if a repeat favorite is trying to be added
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
        .then(getFav)
        .catch(error => console.log('error:' + error))
}

// returns the array of favorite drinks from the db
function fetchFavorites() {
    fetch('http://localhost:3000/favorites')
    .then(res => res.json())
    .then(drinks => drinks.forEach((drink) => {
        favorites.push(drink.strDrink)
    }))
}

// Fourth Event Listener
// Adds functionality to Button to display favorites when clicked
showFav.addEventListener('click', getFav)
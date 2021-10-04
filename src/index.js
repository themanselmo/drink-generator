const randomURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
// html elements 
const img = document.querySelector('#drink-image')
const h3 = document.querySelector('#drink-name')
const ingredients = document.querySelector('#ingredients-list')
const instructions = document.querySelector('#instructions')

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

    ingredientList.forEach(element=>{
        let newIngredient = document.createElement('li')
        measurekey = 'strMeasure'+ element[0].substring(13)
        if (drink[measurekey]===null) {
            newIngredient.textContent = element[1]
        } else{
            newIngredient.textContent = drink[measurekey] + " " + element[1]
        }
        ingredients.append(newIngredient)
    })

    instructions.textContent = drink.strInstructions
}

// reads given ingredient and creates a new li on the page
function renderIngredients(ingredient) {
    let newIngredient = document.createElement('li')
    measurekey = 'strMeasure'+ ingredient[0][-1]
    newIngredient.textContent = drink.measurekey + " " + ingredient[1]

    ingredients.append(newIngredient)
}

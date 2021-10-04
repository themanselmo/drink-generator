const randomURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
const img = document.querySelector('#drink-image')
const h3 = document.querySelector('#drink-name')
const indContainer = document.querySelector('#ingredients-list')
const insContainer = document.querySelector('#instruction-container')

document.addEventListener('DOMContentLoaded', getRandom)

function getRandom() {
    fetch(randomURL).then(resp=>resp.json()).then(data=>data.drinks.forEach(element => {
        renderDrink(element)
    }))
}

function renderDrink(drink) {
    img.src = drink.strDrinkThumb
    img.alt = drink.strDrink
}
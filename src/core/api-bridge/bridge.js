const axios = require('axios').default
const {
  INSPIRATION_LINK,
  SEARCH_BY_NAME_URL,
  SEARCH_BY_INGREDIENT_URL,
  GET_BY_ID_URL,
  GET_RANDOM_URL,
} = require('../../constants')
const {
  getDrinksFromResponse,
  mapDrinksArray,
  mapPromisesResults,
} = require('../../utils/mapRecipes')

const getCocktailByName = async (name) => {
  const response = await axios.get(SEARCH_BY_NAME_URL.concat(name))
  return mapDrinksArray(response)
}

const getCocktailsByIngredient = async (ingredient) => {
  const response = await axios.get(SEARCH_BY_INGREDIENT_URL.concat(ingredient))

  const respArray = getDrinksFromResponse(response)

  const drinks = respArray.length < 10 ? respArray : respArray.slice(0, 10)

  const promises = []
  drinks.forEach((drink) => {
    promises.push(axios.get(GET_BY_ID_URL.concat(drink.idDrink)))
  })
  const responses = await Promise.allSettled(promises)

  return mapPromisesResults(responses)
}

const getRandomCocktail = async () => {
  const response = await axios.get(GET_RANDOM_URL)

  return mapDrinksArray(response)[0]
}

// @ToDo add recipe of Mongolian cocktail
const getMongolian = () => {}

const getInspiration = () => INSPIRATION_LINK

module.exports = {
  getCocktailByName,
  getCocktailsByIngredient,
  getRandomCocktail,
  getMongolian,
  getInspiration,
}

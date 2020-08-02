'use strict';

const listURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients";
const apiKey = "476bdddaeamshb943785842c9b13p146fcejsn41cc646b161e";
const apiHost = "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";

function formatRecipeListParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join("&");
}

function displayRecipeList(responseJson, maxResults) {
    console.log(responseJson);
    $("#results-list").empty();
    for ( let i = 0; i < responseJson.length & i < maxResults; i++) {
        $("#results-list").append(
            `<li class="js-list-${responseJson[i].id}">
            <h3>${responseJson[i].title}</h3>
            </li>`
        )
        getRecipeSummary(responseJson[i].id);
    }
    $('#js-search-results').removeClass('hidden');
}

function getRecipeList(query, maxResults) {
    const params = {
        number: maxResults,
        ingredients: query
    };
    const queryString = formatRecipeListParams(params);
    const url = listURL + "?" + queryString;

    console.log(url);

    const options = {
        headers: new Headers({
            "x-rapidapi-key": apiKey
        })
    };

    fetch(url, options)
      .then(response => {
        console.log(response);
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
      })
      .then(responseJson => {
        displayRecipeList(responseJson, maxResults);
        })
      .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
      })
}

function watchform() {
    $("form").submit(event => {
        event.preventDefault();
        const searchTerm = $("#js-search-term").val();
        const maxResults = $("#js-max-results").val();
        getRecipeList(searchTerm, maxResults);
    })
}

function getRecipeSummary(id) {
    fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/summary`, {
	  "method": "GET",
	  "headers": {
		"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
		"x-rapidapi-key": "476bdddaeamshb943785842c9b13p146fcejsn41cc646b161e"
	  }
  })
   .then(response => {
	  console.log(response);
    return response.json();
    })
    .then(responseJson => {
     console.log(responseJson);
     console.log(responseJson.summary);
     $(`.js-list-${responseJson.id}`).append(
       `<p>${responseJson.summary}</p>`
       )
       })
       .catch(err => {
         console.log(err);
      });
}

$(watchform);
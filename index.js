"use strict";

const listURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";
const videoURL = "https://tasty.p.rapidapi.com/recipes/list";
const apiKey = "476bdddaeamshb943785842c9b13p146fcejsn41cc646b161e";
//Format fetch URL to perform get request
function formatRecipeListParams(params) {
    const queryItems = Object.keys(params).map(key => 
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
        return queryItems.join("&");
}

function getRecipeSummary(id) {
    const url = listURL + `${id}/information`;
    const options = {
        headers: new Headers({
            "x-rapidapi-key": apiKey
        })
    };
    fetch(url, options)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        console.log(responseJson);
        console.log(responseJson.summary);
        if (responseJson.instructions == null) {
            $(`.js-list-${responseJson.id}`).append(
                `<p>${responseJson.summary}</p>
                <p><strong>Instructions: </strong>Not available for this recipe.</p>`
            )
        } else {
        $(`.js-list-${responseJson.id}`).append(
            `<p>${responseJson.summary}</p>
            <p><strong>How to cook this recipe: </strong>${responseJson.instructions}</p>`
            )
        }
    })
    .catch(err => {
    console.log(err);
    });
}

function displayRecipeList(responseJson, maxResults) {
    $("#results-list").empty();
    for ( let i = 0; i < responseJson.length & i < maxResults; i++) {
        $("#results-list").append(
            `<li class="js-list-${responseJson[i].id}">
            <h3>${responseJson[i].title}</h3>
            </li>`
        )
        getRecipeSummary(responseJson[i].id);
    }
    $("#js-search-results, .top-results").removeClass('hidden');
}

function getRecipeList(query, maxResults) {
    const params = {
        number: maxResults,
        ingredients: query
    };
    const queryString = formatRecipeListParams(params);
    const url = listURL + "findByIngredients?" + queryString;

    console.log(url);

    const options = {
        headers: new Headers({
            "x-rapidapi-key": apiKey
        })
    };

    fetch(url, options)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
      })
      .then(responseJson => {
          console.log(responseJson);
          displayRecipeList(responseJson, maxResults);
      })
      .catch(err => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
      })
}

function displayRecipeVideoList(responseJson) {
    console.log(responseJson);
    $("#results-list-videos").empty();
    for ( let i = 0; i < responseJson.results.length; i++) {
        if (responseJson.results[i].original_video_url !== null & (responseJson.results[i].description !== "" & responseJson.results[i].description !== null)) {
            $("#results-list-videos").append(
                `<li>
                <h3>${responseJson.results[i].name}</h3>
                <p>${responseJson.results[i].description}</p>
                <video controls width="400">
                <source src="${responseJson.results[i].original_video_url}">
                </video>
                </li>`
            )
            $("#js-video-search-results").removeClass("hidden");
        }
    }
}

function getRecipeVideoList(query) {
    const params = {
        q: query,
        from: 0,
        sizes: 15
    };
    const queryString = formatRecipeListParams(params);
    const url = videoURL + "?" + queryString;

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
          console.log(responseJson);
          displayRecipeVideoList(responseJson);
          $('html,body').animate({
            scrollTop: $(".top-results").offset().top},
            1000);
      })
      .catch(err => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
      })
}

function watchform() {
    $("form").submit(event => {
        event.preventDefault();
        const searchTerm = $("#js-search-term").val();
        const maxResults = $("#js-max-results").val();
        getRecipeList(searchTerm, maxResults);
        getRecipeVideoList(searchTerm);
    })
}

$(watchform);
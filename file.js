const input = document.querySelector(".input");
const search = document.querySelector(".search_icon");
const results = document.querySelector(".results");
const recipe = document.querySelector(".about_item_recipe");
const recipe_main = document.querySelector(".recipe_main");
const invalid_input = document.querySelector(".invalid_input");
const helper = {};
const background_string = "Search your favourite ingredient!";
const background_element = document.querySelector(".background_quote");
const main_background = document.querySelector(".search_food");
const color_arr = ["grey", "pink", "red", "yellow", "lightblue", "blue", "purple", "orange", "goldenrod", "brown"];

search.addEventListener("click", main);

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") main();
});

background_quote();

function main() {

  main_background.classList.add("hide_search_food");

  let search_item = input.value.trim();
  let items_url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${search_item}`;

  fetch(items_url)
    .then((response) => response.json())
    .then((data) => {

      results.style.height = "fit-content";

      results.innerHTML = ``;

      // empty input or wrong input:
      if (search_item.length == 0 || data.meals == null) throw new Exception();

      // search results for correct input:

      // hiding 'wrong-input' background
      invalid_input.classList.add("hide_invalid_input");

      let visible_item_name;
      for (let i = 0; i < data.meals.length; i++) {
        if (data.meals[i].strMeal.length > 20)
          visible_item_name =
            data.meals[i].strMeal.substring(0, 21).trim() + "...";
        else visible_item_name = data.meals[i].strMeal;

        results.innerHTML += `
            <div class="item">
                <img class="item_img" src="${data.meals[i].strMealThumb}" alt="No image..">
                <li class="item_name">${visible_item_name}</li>
            </div>
            `;

        helper[visible_item_name] = [
          data.meals[i].idMeal,
          data.meals[i].strMeal,
          data.meals[i].strMealThumb,
        ];
      }

      let item_names = document.querySelectorAll(".item_name");
      item_names.forEach((item) => {
        item.addEventListener("click", () => {
          get_recipe(item.innerHTML);
        });
      });
    })
    .catch(() => {
      if (results.innerHTML.length == 0) {

        results.style.height = "100%";
        invalid_input.innerHTML = "";
        invalid_input.innerHTML = `<li class="invalid_input_text">No Results!</li>`;
        invalid_input.innerHTML += `<img class="invalid_input_img" src="./invalid_input.gif" alt="No results" class="">`;
        invalid_input.classList.remove("hide_invalid_input");
        results.style.padding = "0px";
      }
    });
}

function get_recipe(item) {
  let recipe_url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${helper[item][0]}`;
  fetch(recipe_url)
    .then((response) => response.json())
    .then((data) => {
      recipe.innerHTML = `

            <img class="recipe_item_img" src="${helper[item][2]}" alt="Not found..">
            <li class="recipe_item_name">${helper[item][1]}</li>
            <li class="recipe_heading">Recipe:</li>
            <p class="recipe">${data.meals[0].strInstructions.replaceAll("\n","\n")}</p>
            <a class="watch_video" href="${data.meals[0].strYoutube}" target="_blank">Watch Video</a>
            <button class="close" type="button">Close</button>
        `;

      if (data.meals[0].strYoutube.length == 0)
        document
          .querySelector(".watch_video")
          .classList.add("hide_watch_video");
      else
        document
          .querySelector(".watch_video")
          .classList.remove("hide_watch_video");

      let close = document.querySelector(".close");
      close.addEventListener("click", close_recipe);

      recipe_main.classList.remove("hide_recipe");
      recipe.scrollTop = 0;
    });
}

function close_recipe() {
  recipe_main.classList.add("hide_recipe");
  recipe.innerHTML = ``;
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function background_quote() {
  background_element.style.color =
    color_arr[get_random_int(color_arr.length - 1)];
  for (let i = 0; i < background_string.length; i++) {
    await sleep(50);
    background_element.innerHTML += background_string.charAt(i);
  }
}

function get_random_int(limit) {
  return Math.floor(Math.random() * limit);
}

const gap = 16;

const carousel = document.getElementById("carousel"),
  content = document.getElementById("content"),
  next = document.getElementById("next"),
  prev = document.getElementById("prev");

next.addEventListener("click", (e) => {
  carousel.scrollBy(width + gap, 0);
  if (carousel.scrollWidth !== 0) {
    prev.style.display = "flex";
  }
  if (content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
    next.style.display = "none";
  }
});
prev.addEventListener("click", (e) => {
  carousel.scrollBy(-(width + gap), 0);
  if (carousel.scrollLeft - width - gap <= 0) {
    prev.style.display = "none";
  }
  if (!content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
    next.style.display = "flex";
  }
});

let width = carousel.offsetWidth;
window.addEventListener("resize", (e) => (width = carousel.offsetWidth));

document.addEventListener("DOMContentLoaded", function () {
  let Searchbtn = document.getElementById("searchbtn");
  Searchbtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Button pressed");
    FetchApi();
  });
});

const queryStrings = {
  APP_ID: "08adad94",
  API_KEY: "668e6b2c5b8ae9146157b6cb8539a652",
};
const Recipe_dishes = document.getElementById("dishes");
// const dishType = ['biscuits and cookies', 'Alcohol-cocktail','Desserts','Starter','Soup','Pancake','Main course','Condiments and sauces','Salad'];

async function FetchApi() {
  const { APP_ID, API_KEY } = queryStrings;
  try {
    const data = await fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${API_KEY}`
    );
    const response = await data.json();
    let Hits = response.hits;
    return response;
  } catch (e) {
    console.log(e, "something went wrong");
    return e;
  }
}

const dishTypes = [
  "biscuits and cookies",
  "Alcohol-cocktail",
  "Desserts",
  "Starter",
  "Soup",
  "Pancake",
  "Main course",
  "Condiments and sauces",
];
async function fetchRecipes(dishType) {
  const { APP_ID, API_KEY } = queryStrings;
  const response = await fetch(
    `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${API_KEY}&dishType=${dishType}`
  );
  const data = await response.json();
  return data.hits.map((hit) => ({
    image: hit.recipe.image,
    dishType: hit.recipe.dishType,
    cuisineType: hit.recipe.cuisineType,
    ingredients: hit.recipe.ingredientLines,
    instructions: hit.recipe.ingredients,
    totalTime: hit.recipe.totalTime,
  }));
}

function createRecipeElement(recipe) {
  const div = document.createElement("div");
  div.className =
    "col-lg-3 col-md-6 col-sm-6 mb-4 d-flex justify-content-around flex-column align-items-center  ";
  const div1 = document.createElement("div");
  div1.className = "card";
  const div2 = document.createElement("div");
  div2.className =
    "card-header d-flex justify-content-center align-items-center";
  const div3 = document.createElement("div");
  div3.className = "card-body w-100";
  const div4 = document.createElement("div");
  div4.className = "d-flex justify-content-between align-items-center";

  const image = document.createElement("img");
  image.src = recipe.image;
  image.style.width = "250px";

  image.className = "img-fluid ";
  const dishType = document.createElement("h5");
  dishType.className = "mt-2";
  dishType.textContent = recipe.dishType;
  const cuisineType = document.createElement("p");
  cuisineType.textContent = recipe.cuisineType;
  const parag = document.createElement("p");
  // parag.textContent = para;
  const totalTime = document.createElement("h6");
  const totalTimeIcon = document.createElement("i");
  totalTimeIcon.className = "ri-timer-line";
  totalTime.appendChild(totalTimeIcon);
  totalTime.appendChild(document.createTextNode(recipe.totalTime));
  totalTime.className = "total-time";
  const Recipebtn = document.createElement("button");
  Recipebtn.className = "btn bg-warning";
  Recipebtn.textContent = "View Recipe";
  Recipebtn.addEventListener("click", function () {
    console.log("Button clicked");
    openRecipeModal(recipe);
  });

  div.appendChild(div2);
  div.appendChild(div3);
  div2.appendChild(image);
  div3.appendChild(dishType);
  div3.appendChild(cuisineType);
  div3.appendChild(div4);
  div4.appendChild(totalTime);
  div4.appendChild(Recipebtn);
  return div;
}

async function displayRecipes() {
  const dishesContainer = document.getElementById("dishes");
  const displayedDishTypes = new Set();

  for (const type of dishTypes) {
    if (!displayedDishTypes.has(type)) {
      const recipes = await fetchRecipes(type);
      if (recipes.length > 0) {
        const recipeElement = createRecipeElement(recipes[0]);
        dishesContainer.appendChild(recipeElement);
      }
      displayedDishTypes.add(type);
    }
  }
}
function openRecipeModal(recipe) {
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = `
      <h5>${recipe.dishType}</h5>
      <h6>Ingredients:</h6>
      <ul>
          ${recipe.ingredients
            .map((ingredient) => `<li>${ingredient}</li>`)
            .join("")}
      </ul>
      <h6>Instructions:</h6>
      <p>${recipe.instructions
        .map(
          (instruction) =>
            `<li>${instruction.quantity} ${instruction.measure} ${instruction.food} - ${instruction.text}</li>`
        )
        .join("")}</p>
  `;

  const recipeModalElement = document.getElementById("recipeModal");
  const recipeModal = new bootstrap.Modal(recipeModalElement);
  recipeModal.show();
}
displayRecipes().catch((error) =>
  console.error("Error fetching recipes:", error)
);

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  const searchForm = document.getElementById("searchForm");
  if (!searchForm) {
    console.error("Form element with ID 'searchForm' not found");
    return;
  }
  document
    .getElementById("searchbtn")
    .addEventListener("click", async function () {
      console.log("Form submitted");
      var searchTerm = document.getElementById("searchInput").value;
      var displayNone = document.getElementById("display");
      console.log("Search term:", searchTerm);

      if (searchTerm.trim() === "") {
        alert("Please enter a search term");
        return;
      }

      try {
        const recipes = await SearchRecipe(searchTerm);
        if (recipes.length === 0) {
          alert("No recipes found for the entered search term");
          return;
        }
        displayRecipe(recipes);
        displayNone.style.display = "none";
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    });

  async function SearchRecipe(SearchType) {
    try {
      const { APP_ID, API_KEY } = queryStrings;
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${API_KEY}&q=${SearchType}`
      );
      const data = await response.json();
      console.log(data);
      if (!data || !data.hits || data.hits.length === 0) {
        console.log("No recipes found");
        return [];
      }

      return data.hits.map((hit) => ({
        image: hit.recipe.image,
        dishType: hit.recipe.dishType,
        cuisineType: hit.recipe.cuisineType,
        totalTime: hit.recipe.totalTime,
        ingredients: hit.recipe.ingredientLines,
        instructions: hit.recipe.ingredients,
      }));
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  }

  function createRecipe(recipe) {
    const div = document.createElement("div");
    div.className =
      "col-lg-3 col-md-6 col-sm-6 mb-4 d-flex justify-content-around flex-column align-items-center";
    const div1 = document.createElement("div");
    div1.className = "card";
    const div2 = document.createElement("div");
    div2.className =
      "card-header d-flex justify-content-center align-items-center";
    const div3 = document.createElement("div");
    div3.className = "card-body w-100";
    const div4 = document.createElement("div");
    div4.className = "d-flex justify-content-between align-items-center";
    const image = document.createElement("img");
    image.src = recipe.image;
    image.style.width = "250px";
    image.className = "img-fluid";
    const dishType = document.createElement("h5");
    dishType.className = "mt-2";
    dishType.textContent = recipe.dishType;
    const cuisineType = document.createElement("p");
    cuisineType.textContent = recipe.cuisineType;
    const totalTime = document.createElement("h6");
    const totalTimeIcon = document.createElement("i");
    totalTimeIcon.className = "ri-timer-line";
    totalTime.appendChild(totalTimeIcon);
    totalTime.appendChild(document.createTextNode(recipe.totalTime));
    totalTime.className = "total-time";
    const Recipebtn = document.createElement("button");
    Recipebtn.className = "btn bg-warning";
    Recipebtn.textContent = "View Recipe";

    Recipebtn.addEventListener("click", function () {
      console.log("bhhbh");
      openRecipeModal(recipe);
    });

    div.appendChild(div2);
    div.appendChild(div3);
    div2.appendChild(image);
    div3.appendChild(dishType);
    div3.appendChild(cuisineType);
    div3.appendChild(div4);
    div4.appendChild(totalTime);
    div4.appendChild(Recipebtn);
    return div;
  }

  function displayRecipe(recipes) {
    const dishesContainer = document.getElementById("Search_Dishes");
    dishesContainer.innerHTML = "";
    for (const recipe of recipes) {
      const recipeElement = createRecipe(recipe);
      dishesContainer.appendChild(recipeElement);
      console.log(recipe);
    }
  }

  function openRecipeModal(recipe) {
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = `
          <h5>${recipe.dishType}</h5>
          <h6>Ingredients:</h6>
          <ul>
              ${recipe.ingredients
                .map((ingredient) => `<li>${ingredient}</li>`)
                .join("")}
          </ul>
          <h6>Instructions:</h6>
          <p>${recipe.instructions
            .map(
              (instruction) =>
                `<li>${instruction.quantity} ${instruction.measure} ${instruction.food} - ${instruction.text}</li>`
            )
            .join("")}</p>


      `;
    const recipeModalElement = document.getElementById("recipeModal");
    const recipeModal = new bootstrap.Modal(recipeModalElement);
    recipeModal.show();
  }
});

let cocktailList = [];
let recommendCocktail = [];

let url = new URL(
  `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink`
);

let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");
let menus = document.querySelectorAll(".side-menu button");
let cocktailInfo = document.getElementById("cocktail-board");

menus.forEach((menu) =>
  menu.addEventListener("click", (e) => {
    getCocktailByCategory(e);
  })
);

const getCocktails = async () => {
  cocktailList = [];
  recommendCocktail = [];
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(response.status);

    if (response.status === 200) {
      if (!data.drinks || data.drinks.length < 1) {
        throw new Error("No result for this search.");
      } else {
        cocktailList = data.drinks;
        totalResults = cocktailList.length;
        if (data.drinks.length === 1) {
          recommendCocktail = data.drinks;
        }
      }
      console.log(data);
      console.log("cc", cocktailList);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getRandomCocktails = async () => {
  url = new URL(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);
  await getCocktails();
  recommendRender();
};

const getCocktailByCategory = async (e) => {
  document.getElementById("error-board").style.display = "none";
  page = 1;
  console.log("l", totalResults);

  const category = e.target.textContent;
  console.log(category);
  url = new URL(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
  );
  await getCocktails();
  render();
  paginationRender();
};

const getCocktailByKeyword = async () => {
  document.getElementById("error-board").style.display = "none";
  page = 1;
  console.log("l", totalResults);
  let keyword = searchInput.value;
  console.log(keyword);
  url = new URL(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${keyword}`
  );
  await getCocktails();
  render();
  paginationRender();
};

searchButton.addEventListener("click", getCocktailByKeyword);
searchButton.addEventListener("click", () => {
  if (searchInput.value.trim() === "") {
    searchInput.placeholder = "Please enter a keyword!";
    return;
  }
  getCocktailByKeyword();
  searchInput.value = "";
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (searchInput.value.trim() === "") {
      searchInput.placeholder = "Please enter a keyword!";
      return;
    }
    getCocktailByKeyword();
    searchInput.value = "";
  }
});

const errorRender = (error) => {
  document.getElementById("error-board").style.display = "block";
  console.log("e", error);
  const errorHTML = `<div class="alert alert-danger" role="alert">
                          ${error}
                      </div>`;

  document.getElementById("error-board").innerHTML = errorHTML;
  console.log(errorHTML);
};

const render = () => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const paginatedCocktails = cocktailList.slice(start, end);
  const cocktailHTML = paginatedCocktails
    .map((cocktail) => {
      return `
        <div onclick="openModal('${cocktail.idDrink}')">
        <img class="cocktail-thumbnail" src=${cocktail.strDrinkThumb} alt="cocktail-thumbnail" />
        </div>
        <div>
        <div class="cocktail-name">${cocktail.strDrink}</div>
        </div>
        `;
    })
    .join("");

  document.getElementById("cocktail-board").innerHTML = cocktailHTML;
};

const recommendRender = () => {
  const recommendHTML = recommendCocktail.map((cocktail) => {
    let ingredients = "";
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredients += `<div>${
          measure ? measure.trim() : ""
        } ${ingredient.trim()}</div>`;
      }
    }

    return `<div class="recommend-thumbnail-box">
                <img
                id="recommend-thumbnail"
                class="recommend-thumbnail"
                src=${cocktail.strDrinkThumb}
                alt="${cocktail.strDrink}"
                />
            </div>
            <div class="recommend-info">
                <h4>${cocktail.strDrink}</h4>
                <div>${cocktail.strAlcoholic}</div>
                <div>${cocktail.strCategory}</div>
                <p id="recommend-recipe" class="recommend-recipe">
                    ${ingredients}
                </p>
            </div>`;
  });
  document.getElementById("recommend-cocktail").innerHTML = recommendHTML;
};

let totalResults = 0;
let page = 1;
const pageSize = 5;
const groupSize = 5;

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);

  const pageGroup = Math.ceil(page / groupSize);

  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = `
  ${
    page == firstPage
      ? ""
      : `<li class="page-item" onclick="moveToPage(${firstPage})">
  <a class="page-link"aria-label="Previous">
  <span aria-hidden="true">&laquo;</span>
  </a>
  </li>
  <li class="page-item ${page == firstPage ? "disabled" : ""}"
  onclick="moveToPage(${page == firstPage ? page : page - 1})"
  }>
    <a class="page-link"aria-label="Previous">
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`
  }`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  `<li class="page-item">
                            <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item">
                            <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>`;

  document.querySelector(".pagination").innerHTML =
    paginationHTML +
    `${
      page == lastPage
        ? ""
        : `<li class="page-item ${page == lastPage ? "disabled" : ""}"
    onclick="moveToPage(${page == lastPage ? page : page + 1})">
    <a class="page-link" aria-label="Next">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li><li class="page-item" onclick="moveToPage(${lastPage})">
    <a class="page-link" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>`
    }`;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  render();
  paginationRender();
};

const openModal = async (cocktailId) => {
  const modalBody = document.getElementById("cocktail-Modal");

  try {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`
    );
    const data = await response.json();
    const drink = data.drinks[0];

    let ingredients = "";
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients += `<div>${measure || ""} ${ingredient}</div>`;
      }
    }

    modalBody.innerHTML = `<div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${drink.strDrink}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <img class="modal-image" src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="img-fluid mb-2"/>
            <p>${drink.strCategory} / ${drink.strAlcoholic}</p>
            <div class="modal-instructions">Instructions:</div><p>${drink.strInstructions}</p>
            <div class="modal-ingredient">Ingredients:</div>${ingredients}
          </div>
        </div>
      </div>`;

    const modal = new bootstrap.Modal(
      document.getElementById("cocktail-Modal")
    );
    modal.show();
  } catch (err) {
    console.error(err);
    modalBody.innerHTML = "<p>Failed to load cocktail info.</p>";
  }
};

getRandomCocktails();
getCocktailByCategory({ target: { textContent: "Cocktail" } });

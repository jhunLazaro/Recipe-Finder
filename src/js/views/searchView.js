// export const add = (a, b) => a + b;
// export const multiply = (a, b) => a * b;
// export const ID = 23;
import { elements } from "./base";

export const getInput = () => elements.searchInput.value; // one line automatically return

export const clearInput = () => {
  elements.searchInput.value = "";
};
export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};
export const HighlSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
  // a[] css selector a for attributes
  document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.add("results__link--active");
};
/**
 * title = 'Pasta with tomato and spinach'
 * acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
 * acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
 * acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
 * acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato'] this >17
 */
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    // return result
    return `${newTitle.join(" ")} ...`; // join opposite of split
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
                <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${
    recipe.title
  }">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(
                              recipe.title
                            )}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup); // all of this executed 30 time because of foreach
};
// type : 'prev' or 'next'
const createButton = (page, type) => `

            <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
            <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${
                      type === "prev" ? "left" : "right"
                    }"></use>
                </svg>
            </button>

`;
const renderButton = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage); // ex 4.1 round it to 5
  let button;

  if (page === 1 && pages > 1) {
    // Only button to go to next
    button = createButton(page, "next");
  } else if (page < pages) {
    // Both button
    button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")};`;
  } else if (page === pages && pages > 1) {
    // Only button to go to previous
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};
export const renderResult = (recipes, page = 1, resPerPage = 10) => {
  // api give 30 results
  // Render results of current page
  const start = (page - 1) * resPerPage; // 1-1 * 10 = 0 / in page 2 (2-1) * 10 = 10
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  // Render pagination button
  renderButton(page, recipes.length, resPerPage);
};

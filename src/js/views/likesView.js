import { elements } from "./base";
import * as searchView from "./searchView";

export const toggleLikedBtn = (isLiked) => {
  const iconStr = isLiked ? "icon-heart" : "icon-heart-outlined";
  document
    .querySelector(".recipe__love use")
    .setAttribute("href", `img/icons.svg#${iconStr}`);
  //img/icons.svg#icon-heart-outlined
};

export const toggleLikesMenu = (numLikes) => {
  elements.likesField.style.visibility = numLikes > 0 ? "visible" : "hidden";
};

export const renderLikesMenu = (like) => {
  const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${searchView.limitRecipeTitle(
    like.title
  )}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${searchView.limitRecipeTitle(
                      like.title
                    )}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
  elements.likesMenuList.insertAdjacentHTML("beforebegin", markup);
};

export const dellikes = (id) => {
  const del = document.querySelector(`.likes__link[href="#${id}"]`);
  if (del) del.parentElement.removeChild(del);
};

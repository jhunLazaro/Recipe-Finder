// /// global controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/**Glbaal state of the app
 * -Search object
 * -current list object
 * -shopping list object
 * -liked recipe 
 */
const state = {}
// For testing
//window.state = state;

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
        //1) Get  query from view
        const query = searchView.getInput();
        //console.log(query);
        
        if(query) {
            //2) New search object and add to state
            state.search = new Search(query);
            //3) Prepare UI for results
            searchView.clearInput();
            searchView.clearResults(); 
            renderLoader(elements.parentSrch);
            try {
                    //4) Search for recipes
                    await state.search.getResults();
                    //5) Render results on UI
                    clearLoader();
                    searchView.renderResult(state.search.result);
            }catch(err) {
                alert(err);
                clearLoader();
            }
        }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // to not reload the page 
    controlSearch();

}); 

// Page button
elements.searchResPages.addEventListener('click', e => {
    const btn =  e.target.closest('.btn-inline');
   // console.log(btn);
   if(btn) {
       const goToPage = parseInt(btn.dataset.goto, 10); //convert the string with base 10
       searchView.clearResults(); 
       searchView.renderResult(state.search.result, goToPage);
       //console.log(goToPage);
   }
});

/**
 * RECIPE CONTROLLER
 */

// For Testing
//  const r = new Recipe(46956);
//  r.getRecipe();
//  console.log(r);

const controlRecipe = async () => {
    //windows.location the entire URl
    // Get the ID from the URL
    const id =  window.location.hash.replace('#', '');
    //console.log(id);
    

    if (id){
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // Highligth Selected item 
        if(state.search) searchView.HighlSelected(id);
        
        // Create new recipe Object
        state.recipe = new Recipe(id);
       
        try {
                // Get recipe Data and ParseIngredients
                await state.recipe.getRecipe();
                //console.log(state.recipe.ingredients);
                state.recipe.parseIngredients();
                // Calculate servings and time
                state.recipe.calcTime();
                state.recipe.calcServings();
                // Render recipe
                clearLoader();
                recipeView.renderRecipe(
                    state.recipe,
                    state.likes.isLiked(id)
                    );
            
        } catch(err) {
            alert(err);
        }
    }
};
/**
 * LIKE CONTROLLER
 */

    const controlLike = () => {
        if (!state.likes) state.likes = new Likes();
        const curID = state.recipe.id;

        // User has NOT liked current recipe 
        if (!state.likes.isLiked(curID)){
            // Add like to state
            const newLike = state.likes.addLike(
                curID,
                state.recipe.title,
                state.recipe.author,
                state.recipe.img
            );
            // Toggle the like button
            likesView.toggleLikedBtn(true);
            // Add like to UI
            likesView.renderLikesMenu(newLike);
            //console.log(state.likes);
        // User has liked current recipe
        } else {
            // Remove like to state
            state.likes.deleteLike(curID);
            // Toggle the like button
            likesView.toggleLikedBtn(false);
            // Remove like to UI
            likesView.dellikes(curID);
            //console.log(state.likes);
        }
        likesView.toggleLikesMenu(state.likes.numLikes());
    };

    // ADD event handler when the page loads
    window.addEventListener('load', () => {
        state.likes = new Likes();
        // restore likes
        state.likes.retrieveStorage();
        // Toggle like button
        likesView.toggleLikesMenu(state.likes.numLikes());
        // Render the existing likes
        state.likes.likes.forEach(like => likesView.renderLikesMenu(like));
    });

//This is for global object (window)
        // window.addEventListener('hashchange', controlRecipe); 
        // window.addEventListener('load', controlRecipe);
//or
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
    /**
     * List Controller
     */
        const controlList = () => {
            // Creatae a new list if theres NONE yet
            if (!state.list) state.list = new List();

            // Add the ingredients to list  and UI 
            state.recipe.ingredients.forEach(el => {
                const item = state.list.addItem(el.count, el.unit, el.ingredient);
                listView.renderItem(item);
            });
        };
        // Handling delete and update list item event
        elements.shoplist.addEventListener('click', e => {
            const id = e.target.closest('.shopping__item').dataset.itemid;

            // Handle the delete Button
            if (e.target.matches('.shopping__delete, .shopping__delete *')){
                // Del from state
                state.list.deleteItem(id);
                // Del from UI
                listView.deleteItem(id);
                // handle the count update 
            } else if (e.target.matches('.shopping__count-val')){
                const val = parseFloat(e.target.value, 10);
                state.list.updateCount(id, val);
            }
        });
        // handing recipe btn click
        elements.recipe.addEventListener('click', e => {
            if (e.target.matches('.btn-decrease, .btn-decrease *')) {
                // Decrease button is click
                if (state.recipe.servings > 1) {
                    state.recipe.updateServing('dec');
                    recipeView.updateServeIng(state.recipe);
                }
            } else if (e.target.matches('.btn-increase, .btn-increase *')) {
                // Increase button id click
                state.recipe.updateServing('inc');
                recipeView.updateServeIng(state.recipe);
            } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
                // Add ingredients to Shopping list
                controlList();
            } else if (e.target.matches('.recipe__love, .recipe__love *')) {
                // LIKE controller
                controlLike();
            }
            //console.log(state.recipe);
        });
        //for testing
        //window.l = new List();

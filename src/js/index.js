// /// global controller
// import str from './models/Search';
// //import { add as a, ID, multiply} from './views/searchView';
// import * as searchV from './views/searchView'; // This can import everything from searchView
// console.log(`The sum of 2 num is ${searchV.add(searchV.ID, 2)}. and ${searchV.multiply(3, 5)} and string of ${str}`);
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
/**Glbaal state of the app
 * -Search object
 * -current list object
 * -shopping list object
 * -liked recipe 
 */
const state = {}
/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
        //1) Get  query from view
        const query = searchView.getInput();
        console.log(query);
        
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


elements.searchResPages.addEventListener('click', e => {
    const btn =  e.target.closest('.btn-inline');
   // console.log(btn);
   if(btn) {
       const goToPage = parseInt(btn.dataset.goto, 10); //convert the string with base 10
       searchView.clearResults(); 
       searchView.renderResult(state.search.result, goToPage);
       console.log(goToPage);
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
    console.log(id);
    

    if (id){
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create new recipe Object
        state.recipe = new Recipe(id);
       
        try {
                // Get recipe Data and ParseIngredients
                await state.recipe.getRecipe();
                console.log(state.recipe.ingredients);
                state.recipe.parseIngredients();
                // Calculate servings and time
                state.recipe.calcTime();
                state.recipe.calcServings();
                // Render recipe
                clearLoader();
                recipeView.renderRecipe(state.recipe);
            
        } catch(err) {
            alert(err);
        }

   
    }
};

//This is for global object (window)
        // window.addEventListener('hashchange', controlRecipe); 
        // window.addEventListener('load', controlRecipe);
//or
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
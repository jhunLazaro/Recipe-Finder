import axios from "axios";
import { key } from "../config";
export default class recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      //console.log(this.ingredients);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
  calcTime() {
    // Assuming that we need 15 minutes in 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...unitShort, "kg", "g"];

    const newIngredients = this.ingredients.map((el) => {
      //1 Uniform units
      let ingredient = el.toLowerCase(); // convert to lower case
      unitLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      //2 Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); //(...) this is regular expression

      //3 Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        //There is a UNIT
        //ex. 4 1/2 cups arrCount = [4, 1/2] --> eval("4+1/2") -->  4.5
        //ex. 4 cup arrCount = [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        //There is NO unit, but 1st element is num
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        //There is NO unit and NO num in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
  updateServing(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach((ing) => {
      //ing.count =  ing.count * (newServings / this.servings);
      ing.count *= newServings / this.servings;
    });
    this.servings = newServings;
  }
}

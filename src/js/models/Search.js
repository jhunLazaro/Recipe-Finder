import axios from "axios"; // importing package is not using a Path only package name
import { Food2ForkToken, proxy } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    //error handling

    axios({
      method: "get",
      url: `/search/?page=1&query=${this.query}`,
      baseURL: `${proxy}https://food2fork.ca/api/recipe`,
      headers: {
        Authorization: Food2ForkToken,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((result) => {
        console.log("REsult", result);
        this.result = result.data.results;
      })
      .catch((err) => alert(err));
  }
}

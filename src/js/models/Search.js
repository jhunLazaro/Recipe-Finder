// export default 'Im jun jun Lazaro';


import axios from 'axios'; // importing package is not using a Path only package name
import { key, proxy } from '../config';

export default class Search {
    constructor(query){
        this.query = query;
    }
    async getResults() {
        
        //error handling
        try{ 
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`); // axios is same as fetch but it work in all of the browser
            console.log(res);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error){
             alert(error);
        }
    
    }

}


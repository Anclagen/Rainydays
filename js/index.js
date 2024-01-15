import {baseUrl, keys, increaseResults, searchForm, featuredQuery} from "./data/constants.js";
import {checkCart, productSearch, getFeaturedProducts} from "./data/components.js"
checkCart();
searchForm.addEventListener("submit", productSearch);

const featuredProductsContainer = document.querySelector(".product-list-grid");
//creating url to call
let url = baseUrl + keys + increaseResults + featuredQuery;

//fills the featured products
getFeaturedProducts(url, featuredProductsContainer);
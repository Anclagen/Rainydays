import {searchForm} from "./data/constants.js";
import {checkCart, productSearch} from "./data/components.js"
checkCart();
searchForm.addEventListener("submit", productSearch);
import {baseUrl, keys, increaseResults, searchForm} from "./data/constants.js";
import {checkCart, callApi, addLoader, createToggleContent, errorMessage, createProductItemHTML, getProductPriceHTML, getBrand, getColours, productSearch} from "./data/components.js"
checkCart();
searchForm.addEventListener("submit", productSearch);

//query string grabs
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const sex = params.get("sex");
const saleOn = params.get("on_sale");
const searchTerms = params.get("search");

//containers and elements
const h1 = document.querySelector("h1");
const searchTermContainer = document.querySelector(".search-terms-container");
const title = document.querySelector("title");
const productList = document.querySelector(".products-page-grid");
const saleLink = document.querySelector(".sale-products");
const mensLink = document.querySelector(".mens-products");
const womensLink = document.querySelector(".womens-products");
const filterCategoriesLiHeading = document.querySelectorAll(".filter-items");
const filterCategoriesUl = document.querySelectorAll(".filter-container");
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const productsContainer = document.querySelector(".products-page-grid");
const selector = document.querySelector("#sort");

//creating url to call
let url = baseUrl + keys + increaseResults;

// variable for initial filtered data to use with filter options
let filteredData = [];

//set the current page/titles/headings/search-terms
if(sex === "women"){
  const capSex = sex.charAt(0).toUpperCase() + sex.slice(1);
  womensLink.setAttribute("id","current");
  h1.innerText = `${capSex}'s Products`;
  title.innerText = `Browse ${capSex}'s Jackets | Rainydays`
} else if(sex === "men"){
  const capSex = sex.charAt(0).toUpperCase() + sex.slice(1);
  h1.innerText = `${capSex}'s Products`;
  title.innerText = `Browse ${capSex}'s Jackets | Rainydays`
  mensLink.setAttribute("id", "current");
} else if(saleOn === "true"){
  title.innerText = `Browse Sale Jackets | Rainydays`
  saleLink.setAttribute("id","current");
  h1.innerText = "Sale Items";
} else if(searchTerms !== null){
  title.innerText = `Search Products | Rainydays`
  h1.innerText = "Search Results:";
  let searchTermsArray = searchTerms.split(",");
  searchTermContainer.innerHTML = `<p>Keywords: ${searchTermsArray.join(", ")}</p>`
  console.log(searchTerms)
  url = baseUrl + keys + increaseResults + `&search=${searchTerms}`
}

//filters products for sex or on-sale
function filterSale(data){
  if (data.on_sale){ 
      return true;
    } 
  } 

function filterSex(data){
  const capSex = sex.charAt(0).toUpperCase() + sex.slice(1);
  if(data.attributes[3].options[0] === capSex || data.attributes[3].options[1] === capSex){
    return true;
  }
}

// collapsable filter categories, toggles a class
createToggleContent(filterCategoriesLiHeading, filterCategoriesUl, "collapsed-section");



async function buildPageContent(url) {
  try{
    addLoader(productsContainer);
    const data = await callApi(url);
    
    //filter for sex/sale
    if(saleOn === "true"){
      filteredData = data.filter(filterSale);
    } else if(sex === "women" || sex === "men"){
      filteredData = data.filter(filterSex);
    } else {
      filteredData = data;
    }

    //sorts pages initial results by default low-high
    sortData();
    // filteredData.sort((a, b) => a.price - b.price);

    createProductsHtml(filteredData);
  } catch(error){
    console.log(error);
    errorMessage(productsContainer);
  }
}

buildPageContent(url);

function createProductsHtml(data){
  productsContainer.innerHTML = "";
  for(let i = 0; i < data.length; i++){
    let id = data[i].id;
    let img = data[i].images[0].src;
    let alt = data[i].images[0].alt;
    let name = data[i].name;
    let brand = getBrand(data[i]);
    let colours = getColours(data[i]);

    //price of product updated if its on sale
    let regularPrice = (data[i].price_html).match(/[\d\.]+/);
    let price = getProductPriceHTML(regularPrice, data[i].on_sale, data[i].price)

    productsContainer.innerHTML += createProductItemHTML(id, img, alt, name, brand, colours, price)
  }
}

// --- The page filters and sorters ---

//sort products
selector.addEventListener("change", sortData);

function sortData(){
  productsContainer.innerHTML= "";
  if(selector.value === "price-high-low"){
    filteredData.sort((a, b) => b.price - a.price);
  } else if(selector.value === "price-low-high"){
    filteredData.sort((a, b) => a.price - b.price);
  }else if(selector.value === "brand-a-z"){
    filteredData.sort(function(a, b){
      const brandA = a.attributes[2].options[0].toUpperCase();
      const brandB = b.attributes[2].options[0].toUpperCase();
      if(brandA < brandB){
        return -1;
      }
      if(brandA > brandB){
        return 1;
      }
      return 0;
    }); 
  } else if(selector.value === "brand-z-a"){
    filteredData.sort(function(a, b){
      const brandA = a.attributes[2].options[0].toUpperCase();
      const brandB = b.attributes[2].options[0].toUpperCase();
      if(brandA < brandB){
        return 1;
      }
      if(brandA > brandB){
        return -1;
      }
      return 0;
    }); 
  } 
  //maintains selected filter options 
  filteredList = createFilteredArray(filter, filteredData);
  createProductsHtml(filteredList);
}



//defining filter variables
let filterSettings = [];
let filter = {category:[], brand:[], sizes:[], colours:[], price:[], featured:[]};
let filteredList = [];

//looping through all the checkboxes, to push the values for the filter settings
checkboxes.forEach(function(checkbox) {
  //assign event listener to all checkboxes
  checkbox.addEventListener('change', function() {
    //create an array with category(key) and name from each checked checkbox when any check box is checked
    filterSettings = Array.from(checkboxes).filter(i => i.checked).map(i => [i.getAttribute("key"), i.name]);

    //sorts the array into an object with keys for all categories, and arrays of the values
    filter = {category:[], brand:[], sizes:[], colours:[], price:[], featured:[]};
    for (let i = 0; i < filterSettings.length; i++){
      if(filterSettings[i][0] === "category"){
        filter.category.push(filterSettings[i][1]);
      } else if(filterSettings[i][0] === "brand"){
        filter.brand.push(filterSettings[i][1]);
      } else if(filterSettings[i][0] === "sizes"){
        filter.sizes.push(filterSettings[i][1]);
      } else if(filterSettings[i][0] === "colours"){
        filter.colours.push(filterSettings[i][1]);
      } else if(filterSettings[i][0] === "price"){
        filter.price.push(JSON.parse(filterSettings[i][1]));
      } else if(filterSettings[i][0] === "featured"){
        console.log("yes")
        filter.featured.push(filterSettings[i][1]);
      } //else if required in case other checkboxes checked.
    }

    productList.innerHTML = "";
    //filters initial product list with current filter setting and updates the html
    filteredList = createFilteredArray(filter, filteredData);
    createProductsHtml(filteredList)
  })  
});


// creates a new list of products based on the initial list and the filter settings
function createFilteredArray(filter, filteredData){
  let list = [];
  //function for comparing Arrays in the filter object and initial product list.
  function compareArraysIncludes(list, filter) {
    return list.some(property => filter.includes(property));
  }

  //function to check the filtered product contains all the properties in the filter key.
  function compareArraysIncludesAll(list, filter) {
    return filter.every(property => list.includes(property));
  }

  //filters products within range between a high and low value
  function checkPriceRange(filter, price){
    let x = filter.length - 1;
    if(price > filter[0][0] && price < filter[x][1]){
      return true;
    } else {
      return false;
    }
  }

  // used to filter out results based on filter object settings
  for(let i = 0; i < filteredData.length; i++){
    if (filter.category.length === 0 || compareArraysIncludesAll(filteredData[i].attributes[5].options, filter.category)){
      if (filter.brand.length === 0 || filter.brand.includes(filteredData[i].attributes[2].options[0])){
        if (filter.sizes.length === 0 || compareArraysIncludes(filteredData[i].attributes[1].options, filter.sizes)){
          if (filter.colours.length === 0 || compareArraysIncludes(filteredData[i].attributes[0].options, filter.colours)){
            if (filter.price.length === 0 || checkPriceRange(filter.price, filteredData[i].price)){
              if(filter.featured.length === 0 || filteredData[i].featured)
              list.push(filteredData[i]);
            }
          }
        }
      } 
    } 
  };

  return list
}
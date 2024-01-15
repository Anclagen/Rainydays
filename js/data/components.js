// --- Icon Status Updates (cart, account) ---

// updates cart status on pages
export function checkCart(){
  const cartContainer = document.querySelector("#cart");

  //checks if cart exists in local storage, error on parsing undefined on phone/tablet
  if(localStorage.cart === undefined){
    cartContainer.innerHTML = `<img src="images/interface_and_logo/empty_cart_icon_1@2x.png" alt="Cart Empty" class="navigation-icons" /> <span class="desktop-nav">Cart</span>`;
  } else {
    const cart = JSON.parse(localStorage.cart);
    if(localStorage.cart !== null && cart.length !== 0){
      cartContainer.innerHTML = `<img src="images/interface_and_logo/full_cart.png" alt="Full Cart" class="navigation-icons" /> <span class="desktop-nav">Cart</span>`;
    } else {
      cartContainer.innerHTML = `<img src="images/interface_and_logo/empty_cart_icon_1@2x.png" alt="Cart Empty" class="navigation-icons" /> <span class="desktop-nav">Cart</span>`;
    }
  }
}
// --- utilities ---

// call api
export async function callApi(url){
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

//gets featured products from api
export async function getFeaturedProducts(url, featuredProductsContainer) {
  try{
    addLoader(featuredProductsContainer);
    const data = await callApi(url);
    createFeaturedProducts(data, featuredProductsContainer);
  } catch(error){
    console.log(error);
    errorMessage(featuredProductsContainer);
  }
}

// collapsable content toggle toggles a class, accepts node list of clickables and containers.
export function createToggleContent(clickables, contentContainer, toggleClass){
  for(let i=0; i < clickables.length; i++){
    clickables[i].addEventListener("click", function(){
      contentContainer[i].classList.toggle(toggleClass);
    })
  }
}

// toggle for individual items
export function createToggleContentSingle(clickables, contentContainer){
    clickables.addEventListener("click", function(){
      contentContainer.classList.toggle("collapsed-section");
    })
}

// search function
export function productSearch(submit) {
  submit.preventDefault();
  const searchInput = document.querySelector(".search-bar");
  const searchTerms = searchInput.value.split(" ");
  window.location = `products.html?search=${searchTerms}`;
}

// --- Input Validations ---

//validates text inputs
export function validatedInputLength(input, length, errorContainer) {
  if (input.value.trim().length > length) {
    errorContainer.innerText = "";
    input.style.border ="2px solid green";
    return true;
  } else {
    input.style.border ="2px solid red";
    errorContainer.innerText = `Your ${input.name} must have a minimum of ${length + 1} characters.`;
  }
}

//validates number only inputs
export function validatedNumberInputLength(input, length, errorContainer){
  const numberRegEx = /^\d+$/;
  const validInput = numberRegEx.test(input.value);
  if(validInput && input.value.trim().length === length){
    errorContainer.innerText = "";
    input.style.border ="2px solid green";
    return true;
  } else {
    errorContainer.innerText = `Please enter a ${length} digit number.`
    input.style.border ="2px solid red";
  }
}

// validate date input
export function validateDateMM(mm){
    if(mm.value.length === 2 && mm.value > 0 && mm.value < 13){
      mm.style.border ="2px solid green";
      return true;
    } else {
      mm.style.border ="2px solid red";
      return false;
    }
}

export function validateDateYY(yy){
  if(yy.value.length === 2 && yy.value > 21){
    yy.style.border ="2px solid green";
    return true;
  } else {
    yy.style.border ="2px solid red";
    return false;
  }
}

//validate emails
export function validateEmailInput(email, errorContainer) {
  const emailRegEx = /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  const validateEmail = emailRegEx.test(email.value);
  if (validateEmail){ 
    errorContainer.innerText = "";
    email.style.border ="2px solid green";
    return true;
  } else {
    errorContainer.innerText = `Please enter a valid email address`;
    email.style.border ="2px solid red";
  }
}

// --- Payment/account pages prefill forms/store form data storage ---

//function to prefill form with existing user data, probably a tidier way to do this.
export function prefillFormFields(storage, firstName, lastName, addressLine1, addressLine2, city, postCode, country, email,cardNumber, nameCard, securityCode, month, year){
  const userDetails = JSON.parse(storage)
  firstName.value = userDetails.firstName;
  lastName.value = userDetails.lastName;
  addressLine1.value = userDetails.addressLine1;
  addressLine2.value = userDetails.addressLine2;
  city.value = userDetails.townCity;
  postCode.value = userDetails.postCode;
  country.value = userDetails.country;
  email.value = userDetails.email;
  //probably not good security to store card info in local storage
  cardNumber.value = userDetails.cardNumber;
  nameCard.value = userDetails.nameCard;
  securityCode.value = userDetails.securityCode;
  month.value = userDetails.expirationDate[0];
  year.value = userDetails.expirationDate[1];
};

// creates payment details for next page as well as to save for user
export function createPaymentDetails(firstName, lastName, addressLine1, addressLine2, city, postCode, country, email,cardNumber, nameCard, securityCode, month, year){
  let details = {
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    townCity: "",
    postCode: "",
    country: "",
    email: "",
    cardNumber: "",
    nameCard: "",
    securityCode: "",
    expirationDate:[],
  };

  details.firstName = firstName.value;
  details.lastName = lastName.value;
  details.addressLine1 = addressLine1.value;
  details.addressLine2 = addressLine2.value;
  details.townCity = city.value;
  details.postCode = postCode.value;
  details.country = country.value;
  details.email = email.value;
  details.cardNumber = cardNumber.value;
  details.nameCard = nameCard.value;
  details.securityCode = securityCode.value;
  details.expirationDate = [month.value, year.value];

  return JSON.stringify(details);
};

//create cart data
export function createCartArrayData(data, cartItems){
  let arrayData = [];
  for(let j = 0; j < cartItems.length; j++){
    for(let i = 0; i < data.length; i++){
      if(Number(cartItems[j][0]) === data[i].id){
        arrayData.push(data[i]);
        break;
      }
    }
  }
  return arrayData;
}


// --- Content Creators ---

// create loader for api fetches

export function addLoader(container){
  container.innerHTML = `<div class="loader">
                          <div class="outer-loader"></div>
                          <div class="inner-loader"></div>
                          <p>Getting products, please wait...</p>
                        </div>`;
}

// catch error message generator
export function errorMessage(container){
  container.innerHTML = `<div class="error message">
                          <p> An error occurred while fetching the data </p>
                          <p> Please try reloading the page, if this error persists please contact us using a query form </p>
                        </div>`;
}

// --- create product cards ----

// create a products price html depending on if on sale
export function getProductPriceHTML(itemPrice, onSale, salePrice){
  let price = "";
  if (!onSale){
    price = "£" + itemPrice;
  } else {
    // get rid of decimal madness
    let savings = Math.round((itemPrice - salePrice)* 100 + Number.EPSILON ) / 100;
    price = `<span class="sale-price">£${salePrice}</span> 
            <span class="previous-price"> £${itemPrice}</span> 
            <span class="save-price"> Save £${savings}</span>`
  }
  return price;
}

//Function to get the colours out of the attributes technically not needed after sorting attributes in woo-commerce
export function getColours(product){
  let colours = "";
  for(let j = 0; j < product.attributes.length; j++){
    if(product.attributes[j].name === "Colours"){
      colours = product.attributes[j].options.join(", ");
    }
  }
  return colours
}

//Function to get the brand out of the attributes
export function getBrand(product){
  let brand = "";
  for(let j = 0; j < product.attributes.length; j++){
  if(product.attributes[j].name === "Brand"){
    brand = product.attributes[j].options[0];
    }
  }
  return brand
}

// create the html for product cards on various pages
export function createProductItemHTML(id, imageSrc, imageAlt, name, brand, colours, price){
  let item = `<div class="product-item">
                <a href="product.html?id=${id}">
                  <div class="overlay"></div>
                  <img src="${imageSrc}" alt="${imageAlt}" />
                </a>
                <h3>${name}</h3>
                <div>
                  <p>${brand}</p>
                  <p>${colours}</p>
                  <p>${price}</p>
                </div>
              </div> `
  return item
}

//create a featured product section
export function createFeaturedProducts(products, container) {
  let bestSellers = ""
  let l = 0
  for (let i=0; i < products.length; i++){
    let brand = getBrand(products[i]);

    //get the colours of the product
    let colours = getColours(products[i]);

    //price variable assignment for sale or not
    let price = products[i].price;
    let onSale = products[i].on_sale
    let regularPrice = (products[i].price_html).match(/[\d\.]+/);
    price = getProductPriceHTML(regularPrice, onSale, price)
    l = l + 1; 
    if(l > 4){break}
    bestSellers += createProductItemHTML(products[i].id, products[i].images[0].src, products[i].images[0].alt, products[i].name, brand, colours, price); 
  }
  container.innerHTML = bestSellers;
}

// --- Product page ---

// create colour selector
export function createColourSelector(colours){
  let colourSelections = "";
  for(let i = 0; i < colours.length; i++){
    if(colours[i].name === "Colours"){
      for (let j = 0; j < colours[i].options.length; j++){
        let colour = colours[i].options[j];
        colourSelections += `<option value="${colour}">${colour}</option>`;
      }
    }
  }
  return colourSelections;
}

//create size selector
export function createSizeSelector(sizes){
  let sizeSelections = "";
  for(let i = 0; i < sizes.length; i++){
    if(sizes[i].name === "Sizes"){
      for (let j = 0; j < sizes[i].options.length; j++){
        let size = sizes[i].options[j];
        sizeSelections += `<option value="${size}">${size}</option>`;

      }
    }
  }
  return sizeSelections
}

// create a success lightbox
export function createSuccessLightbox (container, colour, size, quantity, name, imageSrc, imageAlt){
  checkCart();

  //creating required elements
  const lightboxContainer = document.createElement("div");
  lightboxContainer.classList = "lightbox-background";

  const contentContainer = document.createElement("div");
  contentContainer.classList = "lightbox-content";

  const h2 = document.createElement("h2");
  h2.innerText = "Success, added to cart.";

  const h3 = document.createElement("h3");
  h3.innerText = name;

  const lightboxImage = `<img src=${imageSrc} alt=${imageAlt} class="lightbox-image"/>`
  const imageDiv = document.createElement("div");
  imageDiv.innerHTML = lightboxImage;

  const colourP = document.createElement("p");
  colourP.innerText = "Colour: " + colour;

  const sizeP = document.createElement("p");
  sizeP.innerText = "Size: " + size.toUpperCase();

  const quantityP = document.createElement("p");
  quantityP.innerText = "Quantity: " + quantity;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList = "lightbox-button-container";

  const cartLink = document.createElement("button");
  cartLink.innerText = "Go to cart";
  cartLink.classList = "cta cta-green";
  cartLink.addEventListener("click", function gotoCart(){window.location.href="cart.html";});

  const continueShoppingLink = document.createElement("button");
  continueShoppingLink.innerText = "Close";
  continueShoppingLink.classList = "cta";
  continueShoppingLink.addEventListener("click", function removeLightbox(){container.innerHTML = "";});

  //adding to light box container
  container.appendChild(lightboxContainer);
  lightboxContainer.appendChild(contentContainer);
  contentContainer.appendChild(h2);
  contentContainer.appendChild(h3);
  contentContainer.appendChild(imageDiv);
  contentContainer.appendChild(colourP);
  contentContainer.appendChild(sizeP);
  contentContainer.appendChild(quantityP);
  contentContainer.appendChild(buttonDiv);
  buttonDiv.appendChild(continueShoppingLink);
  buttonDiv.appendChild(cartLink);
}
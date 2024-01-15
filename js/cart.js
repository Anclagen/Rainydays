import {baseUrl, keys, increaseResults, searchForm} from "./data/constants.js";
import { checkCart, addLoader, callApi, errorMessage, productSearch, createCartArrayData} from "./data/components.js"
checkCart();
searchForm.addEventListener("submit", productSearch);

// DOM containers/inputs/etc..
const cartItemsContainer = document.querySelector(".cart-items");
// delivery options
const standardDeliveryBtn = document.querySelector("#standard-delivery");
const expressDeliveryBtn = document.querySelector("#express-delivery");
const nextDayDeliveryBtn = document.querySelector("#next-day-delivery");
const deliveryRadioBtns = document.querySelectorAll('input[type="radio"]');
// Price outputs
const subtotalContainer = document.querySelector(".subtotal");
const deliveryContainer = document.querySelector(".delivery");
const vatContainer = document.querySelector(".vat");
const totalPriceContainer = document.querySelector(".total");
// delivery selection form 
const form = document.querySelector("#delivery-type");
const submitBtn = document.querySelector("#submit-btn");

//global variables for use
let cartArrayData = [];
let data = [];
let deliveryPrice = 0;
let totalPrice = 0;
let deliveryType = "";
let deliveryDetails = [];
//Check if cart exist before parse avoid error on mobile and tablet.
let cartItems = [];
if(localStorage.getItem("cart") !== undefined){
  cartItems = JSON.parse(localStorage.getItem("cart"));
}

async function callApiGenerateCart(){
  if (cartItems[0] !== undefined){
    try{
      //gets ids for api query
      let id = cartItems[0][0];
      for(let i = 1; i < cartItems.length; i++){
        id += "," + cartItems[i][0];
      }
      addLoader(cartItemsContainer);
      //creates url to call
      let url = baseUrl  + keys + "&include=" + id + increaseResults;
      data = await callApi(url);
      //creates an array of items as duplicate IDs in call are consolidated in the call data. Probably a better way of doing it, to explore later when I have more time but for now I am integrating the calls into existing code.
      cartArrayData = createCartArrayData(data, cartItems);
      createCartHtml(cartArrayData);
    } catch(error){
      console.log(error);
      errorMessage(imageProduct);
    }
  } else {
    cartItemsContainer.innerHTML = "<p>Nothing in cart :(</p>";
  }

}

callApiGenerateCart()


//creates cart items and updates prices.
function createCartHtml(products) {
  totalPrice = 0;
  cartItemsContainer.innerHTML = "";
  if (cartItems[0] !== undefined) {
    submitBtn.disabled = false;
    for (let i = 0; i < cartItems.length; i++) {
      let colour = cartItems[i][1];
      let size = cartItems[i][2];
      let quantity = cartItems[i][3];

      let imageSrc = products[i].images[0].src;
      let imageAlt = products[i].images[0].alt;
      let brand = getBrand(products[i]);
      let name = products[i].name;
      let price = Number(products[i].price);

      totalPrice += (price * quantity);

      //create initial container
      let cartItem = document.createElement("div");
      cartItem.classList.add(`cart-product-item-grid`);

      //create image container and images
      let imageContainer = document.createElement("div");
      let imageItem = document.createElement("img");
      imageItem.src = `${imageSrc}`;
      imageItem.alt = `${imageAlt}`;
      imageContainer.appendChild(imageItem);

      //create item details
      let detailsItem = document.createElement("div");
      let h2 = document.createElement("h2");
      let pSize = document.createElement("p");
      let pColour = document.createElement("p");
      let pPrice = document.createElement("p");
      pPrice.classList.add("items-price");
      let pQuantity = document.createElement("p");
      let pQuantityUpdater = document.createElement("p");
      let btnAdd = document.createElement("button");
      btnAdd.textContent = "+";
      btnAdd.classList.add("plus-button");
      let btnMinus = document.createElement("button");
      btnMinus.textContent = "-";
      btnMinus.classList.add("minus-button");
      //pre-disable button if quantity is 1
      if (quantity < 2) {
        btnMinus.disabled = true;
      }

      let quantitySpan = document.createElement("span");
      quantitySpan.classList.add("quantity-value");
      quantitySpan.innerText = quantity;
      pQuantityUpdater.appendChild(btnMinus);
      pQuantityUpdater.appendChild(quantitySpan);
      pQuantityUpdater.appendChild(btnAdd);
      let btnRemove = document.createElement("button");
      btnRemove.classList.add("remove-button");

      //if calling a function with parameters create it inside another as it will run automatically.
      btnMinus.addEventListener("click", function () { minusItem(i) });
      btnAdd.addEventListener("click", function () { addItem(i) });
      btnRemove.addEventListener("click", function () { removeItem(i) });

      h2.innerHTML = `<a href="product.html?id=${products[i].id}">${brand} -${name}</a>`;
      pSize.textContent = `Size: ${size}`;
      pColour.textContent = `Colour: ${colour}`;
      pPrice.textContent = `Price: £${price}`;
      pQuantity.innerHTML = `Quantity:`;
      btnRemove.textContent = "remove";


      cartItemsContainer.appendChild(cartItem);
      cartItem.appendChild(imageContainer);
      cartItem.appendChild(detailsItem);
      detailsItem.appendChild(h2);
      detailsItem.appendChild(pSize);
      detailsItem.appendChild(pColour);
      detailsItem.appendChild(pPrice);
      detailsItem.appendChild(pQuantity);
      detailsItem.appendChild(pQuantityUpdater);

      detailsItem.appendChild(btnRemove);
    }
  } else {
    submitBtn.disabled = true;
    cartItemsContainer.innerHTML = "<p>Nothing in cart =(</p>"
  }
  createCartPrices()
}

//gets the brand name out of the attribute data
function getBrand(products){
  let brand ="";
  for(let i = 0; i < products.attributes.length; i++){
    if(products.attributes[i].name === "Brand"){
      brand = products.attributes[i].options[0];
    }
  }
  return brand;
}

//add to quantity
function addItem(i) {
  const quantityContainer = document.getElementsByClassName("quantity-value");
  const minusButton = document.getElementsByClassName("minus-button");
  const plusButton = document.getElementsByClassName("plus-button");
  let itemQuantity = Number(quantityContainer[i].innerText);
  let newQuantity = itemQuantity + 1;

  //enables minus button
  if (newQuantity > 1) {
    minusButton[i].disabled = false;
  }
  //Disables if it reached the stock level for the item
  if (newQuantity === Number(cartItems[i][4])) {
    plusButton[i].disabled = true;
  }

  totalPrice = totalPrice + Number(cartArrayData[i].price);
  createCartPrices()
  quantityContainer[i].innerText = newQuantity;
  cartItems[i][3] = newQuantity;
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

//minus quantity
function minusItem(i) {
  const quantityContainer = document.getElementsByClassName("quantity-value");
  const minusButton = document.getElementsByClassName("minus-button");
  const plusButton = document.getElementsByClassName("plus-button");
  let itemQuantity = Number(quantityContainer[i].innerText);
  let newQuantity = itemQuantity - 1;

  //disables minus button at 1 quantity
  if (newQuantity < 2) {
    minusButton[i].disabled = true;
  }
  plusButton[i].disabled = false;

  totalPrice = totalPrice - Number(cartArrayData[i].price);
  createCartPrices()
  quantityContainer[i].innerText = newQuantity;
  cartItems[i][3] = newQuantity;
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

//fills in the cart prices
function createCartPrices() {
  let subtotal = totalPrice * 0.875;
  let vat = totalPrice * 0.125;
  //js does some random math some times fixed to 2 dp.
  subtotalContainer.innerHTML = "£" + subtotal.toFixed(2);
  vatContainer.innerHTML = "£" + vat.toFixed(2);
  totalPriceContainer.innerHTML = "£" + (totalPrice + deliveryPrice).toFixed(2);
}



deliveryRadioBtns.forEach(function (event) {
  event.addEventListener("click", updateDeliveryPrice);
})



//updates delivery price
function updateDeliveryPrice() {
  if (standardDeliveryBtn.checked) {
    deliveryPrice = 0;
    deliveryType = "Standard delivery";
    totalPriceContainer.innerHTML = "£" + (totalPrice + deliveryPrice).toFixed(2);
  } else if (expressDeliveryBtn.checked) {
    deliveryPrice = 5;
    deliveryType = "Express delivery";
    totalPriceContainer.innerHTML = "£" + (totalPrice + deliveryPrice).toFixed(2);
  } else if (nextDayDeliveryBtn.checked) {
    deliveryPrice = 10;
    deliveryType = "Next day delivery";
    totalPriceContainer.innerHTML = "£" + (totalPrice + deliveryPrice).toFixed(2);
  }
  console.log(deliveryPrice);
  deliveryContainer.innerHTML = `£${deliveryPrice.toFixed(2)}`
  deliveryDetails = [deliveryType, deliveryPrice];
}

// remove an item from your cart, updates local storage and re-creates html
function removeItem(index) {
  cartItems.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  //update cart array data and create new html
  cartArrayData = createCartArrayData(data, cartItems);
  createCartHtml(cartArrayData);
  createCartPrices();
  checkCart();
}

// add relevant details to a local storage value for use later, and go to next page
function submitAndPay(submit) {
  updateDeliveryPrice();
  submit.preventDefault();
  localStorage.setItem("delivery", JSON.stringify(deliveryDetails))
  window.location = "details_checkout.html"
}



form.addEventListener("submit", submitAndPay);
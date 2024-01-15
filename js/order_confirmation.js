import {baseUrl, keys, increaseResults, searchForm} from "./data/constants.js";
import {checkCart, callApi, errorMessage, productSearch, createCartArrayData} from "./data/components.js";
checkCart();
searchForm.addEventListener("submit", productSearch);

//  containers and elements
const addressContainer = document.querySelector("address");
const paymentTypeContainer = document.querySelector("#payment-type");
const itemsContainer = document.querySelector("table");
const emailContainer = document.querySelector(".email-container");
const deliveryContainer = document.querySelector("#delivery-type");
const priceContainer = document.querySelector("#total-price");
const btn = document.querySelector("button");

//  local, and session storage
const cartItems = JSON.parse(localStorage.getItem("cart"));
const deliveryDetails = JSON.parse(localStorage.getItem("delivery"));
let paymentDetails = JSON.parse(localStorage.getItem("Payment Details"));
//check if temp storage is being used
if(window.sessionStorage.getItem("Payment Details")){
  paymentDetails = JSON.parse(window.sessionStorage.getItem("Payment Details"));
  console.log("yes");
}

//if undefined will cause error on some browsers when parsed so check for undefined first
const orderHistoryJSON = localStorage.getItem("Order History");
let cartArrayData = [];

// order summary details
const address= `${paymentDetails.firstName} ${paymentDetails.lastName}<br />
${paymentDetails.addressLine1}<br />
${paymentDetails.addressLine2}<br />
${paymentDetails.townCity}<br />
${paymentDetails.postCode}<br />
${paymentDetails.country}`;
const email = paymentDetails.email;
const delivery = `${deliveryDetails[0]} £${deliveryDetails[1]}.00 `;
let totalPrice = deliveryDetails[1];

// API call and page creation
async function callApiGenerateConfirmation(){
  if (cartItems[0] !== undefined){
    try{
      //gets ids for api query
      let id = cartItems[0][0];
      for(let i = 1; i < cartItems.length; i++){
        id += "," + cartItems[i][0];
      }
      //creates url to call
      let url = baseUrl  + keys + "&includes=" + id + increaseResults;
      let data = await callApi(url);
      //creates an array of items as duplicate IDs in call are consolidated in the call data. Probably a better way of doing it, to explore later when I have more time but for now I am integrating the calls into existing code.
      cartArrayData = createCartArrayData(data, cartItems);
      createOrderSummary(cartArrayData);
    } catch(error){
      console.log(error);
      errorMessage(itemsContainer);
    }
  } else {
    cartItemsContainer.innerHTML = "<p>Nothing in cart :(</p>";
  }
}

callApiGenerateConfirmation();

//  creates order summary based on stored info from cart, delivery, and payment details.
function createOrderSummary(products){
  //add address
  addressContainer.innerHTML = address;
  emailContainer.innerText = email;
  //add payment type
  paymentTypeContainer.innerText = `Visa/Credit Card ending in: ${String(paymentDetails.cardNumber).slice(-4)}`;

  //define total price, added to in for loop
  for (let i = 0; i < cartItems.length; i++){
    let price = (Number(products[i].price) * Number(cartItems[i][3])).toFixed(2);
    totalPrice += Number(products[i].price) * Number(cartItems[i][3]);
    //creates a table item for each item in cart
    itemsContainer.innerHTML +=    `<tr>
                                      <td class="product-name">
                                        <a href="product.html?id=${products[i].id}"  target="_blank">${products[i].name}</a>
                                      </td>
                                      <td>${cartItems[i][3]}</td>
                                      <td>£${price}</td>
                                    </tr>`;
  }
  // delivery and total price values
  deliveryContainer.innerText = delivery;
  priceContainer.innerText = `£${totalPrice.toFixed(2)}`;
}

// order item to add to order history
let orderItem = {
  orderNumber: Math.floor(100000000000 + Math.random() * 900000000000),
  productsArray: cartItems,
  deliveryText: delivery,
  deliveryAddressHTML: address,
  totalText: totalPrice.toFixed(2),
  email: email,
}

//create a random order and clear cart
function createOrderHistory(){
  let orderHistory = [];
  //checks if there are previous orders and updates order history
  if(orderHistoryJSON !== null){
    orderHistory = JSON.parse(orderHistoryJSON);
  }
  //pushes the current order to the history amd clears cart
  orderHistory.push(orderItem);
  let orderHistoryStringy = JSON.stringify(orderHistory);
  localStorage.setItem("cart", "[]");
  window.sessionStorage.removeItem("Payment Details");
  localStorage.setItem("Order History", orderHistoryStringy);
  window.location.href="order_success.html";
}

btn.addEventListener("click", createOrderHistory);

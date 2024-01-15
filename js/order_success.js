import {baseUrl, keys, increaseResults, searchForm} from "./data/constants.js";
import {checkCart, productSearch} from "./data/components.js";
checkCart();
searchForm.addEventListener("submit", productSearch);

const orderNumberContainer = document.querySelector("#order-number");
const addressContainer = document.querySelector("address");
const deliveryDateContainer = document.querySelector("#delivery-date");
const orderHistory = JSON.parse(localStorage.getItem("Order History"));

//get the last order pushed to array
const orderIndex = (orderHistory.length - 1);
const orderNumber = orderHistory[orderIndex].orderNumber;
const address = orderHistory[orderIndex].deliveryAddressHTML;

orderNumberContainer.innerHTML =`<a href="account.html?id=${orderIndex}"> ${orderNumber}</a>`
addressContainer.innerHTML =  address;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const dates = new Date();
let month = months[dates.getMonth()];
let day = dates.getDate();
let day2 = (dates.getDate() + 2);
deliveryDateContainer.innerText = `Between ${month}, ${day} - ${day2}.`; 

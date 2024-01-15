export const baseUrl = "https://rainydays.ajbarrett.tech/wp-json/wc/v3/products";
export const keys = "?consumer_key=ck_c8a0d358f632fe5216b5c5a6e74f66cc906a3deb&consumer_secret=cs_5664fa81e9a949e8fc8d630a6c2acb973d6f5c00";
export const increaseResults = "&per_page=100";
export const featuredQuery = "&featured=true";

//search bar
export const searchForm = document.querySelector("#search-form");

// Page containers and inputs for account and checkout page
export const paymentForm = document.querySelector("#details-form");
export const firstName = document.querySelector("#first-name");
export const firstNameError = document.querySelector("#error-first-name");
export const lastName = document.querySelector("#last-name");
export const lastNameError = document.querySelector("#error-last-name");
export const addressLine1 = document.querySelector("#address-1");
export const addressLine1Error = document.querySelector("#error-address-1");
export const addressLine2 = document.querySelector("#address-2");
// const addressLine2Error = document.querySelector("#error=address-2");
export const city = document.querySelector("#town-city");
export const cityError = document.querySelector("#error-town-city");
export const postCode = document.querySelector("#post-code");
export const postCodeError = document.querySelector("#error-post-code");
export const country = document.querySelector("#country");
export const countryError = document.querySelector("#error-country");
export const email = document.querySelector("#email");
export const emailError = document.querySelector("#error-email");
export const cardNumber = document.querySelector("#card-number");
export const cardNumberError = document.querySelector("#error-card-number");
export const nameCard = document.querySelector("#name-card");
export const nameCardError = document.querySelector("#error-name-card");
export const securityCode = document.querySelector("#security-code");
export const securityCodeError = document.querySelector("#error-security-code");
export const month = document.querySelector("#expiration-date-month");
export const year = document.querySelector("#expiration-date-year");
export const dateError = document.querySelector("#error-date");

// session storage get requests for payment details
export const detailsSessionStorage = window.sessionStorage.getItem("Payment Details");
export const detailsLocalStorage = localStorage.getItem("Payment Details");

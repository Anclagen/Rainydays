import {baseUrl, keys, increaseResults, searchForm, firstName, firstNameError, lastName, lastNameError, addressLine1, addressLine1Error, addressLine2, city, cityError, postCode, postCodeError, country, countryError, email, emailError, cardNumber, cardNumberError, nameCard, nameCardError, securityCode, securityCodeError, month, year, dateError, detailsLocalStorage} from "./data/constants.js";
import {checkCart, callApi, addLoader, errorMessage, productSearch, prefillFormFields, createPaymentDetails, validateEmailInput, validatedInputLength, validatedNumberInputLength, validateDateYY, validateDateMM} from "./data/components.js";
checkCart();
searchForm.addEventListener("submit", productSearch);

// page containers and inputs
const loginSection = document.querySelector(".login");
const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#email-login");
const emailLoginError = document.querySelector("#error-email-login");
const detailsForm = document.querySelector("#details-form");
const itemsContainer = document.querySelector("table");
const passwordInput = document.querySelector("#password");
const passwordErrorContainer = document.querySelector("#error-password");
const confirmPasswordLabel = document.querySelector("#confirm-password-label")
const confirmPasswordInput = document.querySelector("#confirm-password");
const submitBtn = document.querySelector("#submit-btn");
const signUpText = document.querySelector(".paragraph");
const signUpBtn = document.querySelector("#sign-up");
const accountDetailsSection = document.querySelector(".account-details");
const orderHistorySection = document.querySelector(".order-history");
// local storage grabs
const orderHistoryJSON = localStorage.getItem("Order History");
const userLoginJSON = localStorage.getItem("User Login");
//user login info variable
let userLoginData = {email: "", password: "", loggedIn: false,}
//checks if there is stored login info before filling data
if(userLoginJSON){
  userLoginData = JSON.parse(userLoginJSON);
  loginEmail.value = userLoginData.email;
}

// check if user details exist to fill page on load defaults to session storage for the moment.
if(detailsLocalStorage){
  prefillFormFields(detailsLocalStorage, firstName, lastName, addressLine1, addressLine2, city, postCode, country, email,cardNumber, nameCard, securityCode, month, year);

} else {
  itemsContainer.innerHTML = "<p>No Orders Found<p>"
}

// --- Login/Sign Up Form ---

// swaps between login/signup
function displaySignUpForm(){
  if(signUpBtn.innerText === "Sign Up"){
    signUpBtn.innerText = "Login";
  } else {
    signUpBtn.innerText = "Sign Up"
  }
  if(submitBtn.value === "Sign Up"){
    submitBtn.value = "Login";
  } else {
    submitBtn.value = "Sign Up"
  }
  if(signUpText.innerText === "Don't have an account?"){
    signUpText.innerText = "Already have an account?"
  } else {
    signUpText.innerText = "Don't have an account?"
  }
  confirmPasswordInput.classList.toggle("hidden");
  confirmPasswordLabel.classList.toggle("hidden");
}

// password match for signup
function matchPasswords(){
  if(passwordInput.value === confirmPasswordInput.value && passwordInput.value.length > 8){
    return true
  } else if(passwordInput.value.length <= 8){
    passwordErrorContainer.innerText = `Your passwords must be more than 8 characters`
    return false
  } else {
    passwordErrorContainer.innerText = `Your passwords don't match.`
    return false
  }
}

//user details object for login
let UserLoginDetails = {email: "",
                        password: "",
                        loggedIn: false,}

//checks if user is logged in already
if(userLoginData.loggedIn){
  loginSection.classList.toggle("hidden");
  accountDetailsSection.classList.toggle("hidden");
  orderHistorySection.classList.toggle("hidden");
}

//validates login or signup
function validateLoginSignUp(submit){
  submit.preventDefault();
  //checks if form is login or sign up
  if(submitBtn.value === "Login"){
    if(userLoginData.email === loginEmail.value && userLoginData.password === passwordInput.value && userLoginData.email !== ""){
      loginSection.classList.toggle("hidden");
      accountDetailsSection.classList.toggle("hidden");
      orderHistorySection.classList.toggle("hidden");
    } else if(userLoginData.email !== loginEmail.value || userLoginData.email === ""){
      passwordErrorContainer.innerText = `User doesn't exist, please sign up`
    } else {
      passwordErrorContainer.innerText = `Incorrect Password`
    }
  } else if(submitBtn.value === "Sign Up"){
      let passMatch = false;
      passMatch = matchPasswords()
      const validEmail = validateEmailInput(loginEmail, emailLoginError);

      if(passMatch && validEmail){
        loginSection.classList.toggle("hidden");
        accountDetailsSection.classList.toggle("hidden");
        orderHistorySection.classList.toggle("hidden");
        UserLoginDetails = {email: loginEmail.value,
                        password: passwordInput.value,
                        loggedIn: true}
        }
        // The high point of poor security.
        localStorage.setItem("User Login", JSON.stringify(UserLoginDetails));
  }
}

// --- Account Logged In Code ---
loginForm.addEventListener("submit", validateLoginSignUp);
signUpBtn.addEventListener("click", displaySignUpForm);

// validate the users updates
function validateUpdatedDetails(submission){
  submission.preventDefault();

  //variables assigned true if they pass, and errors generated on fail.
  const a = validatedInputLength(firstName, 0, firstNameError);
  const b = validatedInputLength(lastName, 0, lastNameError);
  const c = validatedInputLength(addressLine1, 3, addressLine1Error);
  const d = validatedInputLength(city, 0, cityError);
  const e = validatedInputLength(postCode, 3, postCodeError);
  const f = validatedInputLength(country, 1, countryError);
  const g = validateEmailInput(email, emailError);
  const h = validatedNumberInputLength(cardNumber, 16, cardNumberError);
  const i = validatedInputLength(nameCard, 2, nameCardError);
  const j = validatedNumberInputLength(securityCode, 3, securityCodeError);
  const k = validateDateMM(month);
  const l = validateDateYY(year);
  if(!l || !k){
    dateError.innerText = "Please enter valid date";
  } else {
    dateError.innerText = "";
  };

  //if all variables true goes to order summary/confirmation 
  if(a && b && c && d && e && f && g && h && i && j && k && l) {
    const userDetails = createPaymentDetails(firstName, lastName, addressLine1, addressLine2, city, postCode, country, email,cardNumber, nameCard, securityCode, month, year);
    localStorage.setItem("Payment Details", userDetails);
    window.location.reload();
  }
};

detailsForm.addEventListener("submit", validateUpdatedDetails);

// --- Create order history ---

async function callApiGenerateOrderHistory(){
  try{
    const orderHistoryArray = JSON.parse(orderHistoryJSON);
    //gets ids for api query
    let id = "";
    for(let j = 0; j < orderHistoryArray.length; j++){
      for(let i = 0; i < orderHistoryArray[j].productsArray.length; i++){
        id += "," + orderHistoryArray[j].productsArray[i][0];
      }
    }
    addLoader(itemsContainer)
    //creates url to call
    let url = baseUrl  + keys + "&include=" + id + increaseResults;
    let data = await callApi(url);
    itemsContainer.innerHTML = "";
    createOrderHistory(data);
  } catch(error){
    console.log(error);
    errorMessage(itemsContainer);
  }
}

//loops through the order history and creates a summary for each
function createOrderHistory(data){
  let totalPrice = 0;
  const orderHistory = JSON.parse(orderHistoryJSON);

  for(let j = (orderHistory.length - 1); j >= 0; j--){
    //creates an array of products from the fetch data for this order
    let currentOrderData = [];
    for (let i = 0; i < orderHistory[j].productsArray.length; i++){
      for(let k = 0; k < data.length; k++){
        if(Number(orderHistory[j].productsArray[i][0]) === data[k].id){
          currentOrderData.push(data[k]);
          break;
        }
      }
    }
    totalPrice = 0;
    let productsOrders = orderHistory[j].productsArray;
    //creates the html for this order
    for (let i = 0; i < productsOrders.length; i++){
      let quantity = orderHistory[j].productsArray[i][3];
      let price = (currentOrderData[i].price) * quantity;
      let orderNumber = "";
      if(i === 0){
        orderNumber = orderHistory[j].orderNumber;
      }
      totalPrice += price;
      //creates a table item for each item in cart
      itemsContainer.innerHTML +=  `<tr>
                                      <td>${orderNumber}</td>
                                      <td class="product-name">
                                        <a href="product.html?id=${currentOrderData[i].id}"  target="_blank">${currentOrderData[i].name}</a>
                                      </td>
                                      <td></td>
                                    </tr>`;
    }
    itemsContainer.innerHTML +=`<tr>
                                  <th class="total"colspan="4">£${totalPrice.toFixed(2)}</th>
                                </tr>`
  }
}

if(orderHistoryJSON){
  callApiGenerateOrderHistory();
} 

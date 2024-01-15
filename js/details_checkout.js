import {searchForm, firstName, firstNameError, lastName, lastNameError, addressLine1, addressLine1Error, addressLine2, city, cityError, postCode, postCodeError, country, countryError, email, emailError, cardNumber, cardNumberError, nameCard, nameCardError, securityCode, securityCodeError, month, year, dateError, detailsSessionStorage, detailsLocalStorage} from "./data/constants.js";
import {checkCart, productSearch, prefillFormFields, createPaymentDetails, validateEmailInput, validatedInputLength, validatedNumberInputLength, validateDateYY, validateDateMM} from "./data/components.js"
checkCart();
searchForm.addEventListener("submit", productSearch);
// Page containers and inputs
const paymentForm = document.querySelector("#details-form");
const rememberDetails = document.querySelector("#remember-me");

// check if user details exist to fill page on load defaults to session storage for the moment.
if(detailsSessionStorage){
  prefillFormFields(detailsSessionStorage, firstName, lastName, addressLine1, addressLine2, city, postCode, country, email,cardNumber, nameCard, securityCode, month, year);
}else if(detailsLocalStorage){
  prefillFormFields(detailsLocalStorage, firstName, lastName, addressLine1, addressLine2, city, postCode, country, email,cardNumber, nameCard, securityCode, month, year);
};

//---- validating the whole form -----
function validatePaymentDetails(submission){
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
    const paymentDetails = createPaymentDetails(firstName, lastName, addressLine1, addressLine2, city, postCode, country, email,cardNumber, nameCard, securityCode, month, year);

    if(rememberDetails.checked){
      localStorage.setItem("Payment Details", paymentDetails);
    } else {
      window.sessionStorage.setItem("Payment Details", paymentDetails);
    }

    window.location.href="order_confirmation.html";
  }
};

//on submit run form validation
paymentForm.addEventListener("submit", validatePaymentDetails);
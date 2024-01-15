import {searchForm} from "./data/constants.js";
import {checkCart, productSearch, validateEmailInput, validatedInputLength, validatedNumberInputLength} from "./data/components.js"

checkCart();
searchForm.addEventListener("submit", productSearch);

// defined page containers
const contactForm = document.querySelector("#contact-form");
const fullname = document.querySelector("#fullname");
const fullnameError = document.querySelector("#error-name");
const email = document.querySelector("#email");
const emailError = document.querySelector("#error-email");
const subject = document.querySelector("#subject");
const subjectError = document.querySelector("#error-subject");
const message = document.querySelector("#message");
const messageError = document.querySelector("#error-message");
const orderNumber = document.querySelector("#order-number");
const orderNumberError = document.querySelector("#error-order-number");
const successContainer = document.querySelector(".success");

// return grey borders on form submission
function resetBorders(input){
  input.style.border = "2px solid grey";
}

//validate form
function validateContactForm(submission){
  submission.preventDefault();

  //clear success container if resubmitted wrong, remove main class to avoid green box
  successContainer.innerHTML = "";
  successContainer.classList.remove("main-item");

  //variables assigned true if they pass, and errors generated on fail.
  const a = validatedInputLength(fullname, 0, fullnameError);
  const b = validatedInputLength(message, 29, messageError);
  const c = validateEmailInput(email, emailError);
  const d = validatedInputLength(subject, 5, subjectError);
  
  //order number optional but needs validating if entered.
  let e = true;
  orderNumberError.innerText = "";
  if(orderNumber.value.length > 0){
    e = validatedNumberInputLength(orderNumber, 12, orderNumberError);
  }

  //if all variables true form submitted and success div displayed 
  if(a && b && c && d && e) {
    successContainer.classList.add("main-item");
    successContainer.innerHTML = "<p>Success, your query has been submitted.</p>";
    //scrolls to success container on submit. useful for phones

    successContainer.scrollIntoView({behavior: "smooth", block: "center"});
    contactForm.reset();
    resetBorders(fullname);
    resetBorders(message);
    resetBorders(email);
    resetBorders(subject);
    resetBorders(orderNumber);
  }
}

//on submit run form validation
contactForm.addEventListener("submit", validateContactForm);
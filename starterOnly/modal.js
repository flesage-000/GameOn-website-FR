function editNav() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalCloseBtn = document.querySelectorAll(".close");
const formData = document.querySelectorAll(".formData input:not([type='submit'])");
const formSub = document.querySelectorAll("form");
const errorsList = [
  { 'name' : 'birthdate',    'valid' : true,  'message' : 'Vous devez entrer votre date de naissance.' },
  { 'name' : 'checkTerms',   'valid' : true,  'message' : 'Vous devez vérifier que vous acceptez les termes et conditions.'  },
  { 'name' : 'email',        'valid' : true,  'message' : 'Veuillez entrer une adresse email valide.'  },
  { 'name' : 'minLength',    'valid' : true,  'message' : 'Veuillez entrer 2 caractères ou plus pour le champ du nom.' },
  { 'name' : 'minMax',       'valid' : true,  'message' : 'Veuillez entrer entre 0 et 99 (compris).' },
  { 'name' : 'required',     'valid' : true,  'message' : 'Le champs est requis.'  },
  { 'name' : 'selectOption', 'valid' : true,  'message' : 'Vous devez choisir une option.' }];

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// close modal event
modalCloseBtn.forEach((btn) => btn.addEventListener("click", closeModal));

// form validation
// formData.forEach((input) => input.addEventListener("focusout", formCheck));
formData.forEach((input) => input.addEventListener("blur", formCheck));
formData.forEach((input) => input.addEventListener("change", formCheck));
formSub.forEach((form) => form.addEventListener("submit", formSubmit));
// launch modal form
function launchModal() { modalbg.style.display = "block"; }
// close modal form
function closeModal() { modalbg.style.display = "none"; }

function formSubmit(e) { console.log('formSubmit', e, formData);
  e.preventDefault();
  formData.forEach((input) => { console.log('input #' + input.id, '|', input.value.length);
    let inputAttr = input.attributes;
    let inputType = inputAttr.type.value;
    let inputValue = input.value;
    let radioChecked = false;

    if (inputType === "checkbox") { // console.log('Checkbox : required', inputAttr.required, ', checked', input.checked)
      // Get required attribute
      let isRequired = inputAttr.required;
      // Input is required ?
      if (isRequired) errorManagement(inputAttr.id.value, 'checkTerms', input.checked);
    } else if (inputType === "date") {
      // Checks that value is present
      let validDate = dateValue(inputValue);
      // Manage error
      errorManagement(inputAttr.id.value, 'birthdate', validDate);
    } else if (inputType === "email" ) {
      // Check that email input value is valid
      let validEmail = emailValue(inputValue);
      // Manage error
      errorManagement(inputAttr.id.value, 'email', validEmail);
    } else if (inputType === "number" ) {
      // Checks that value is > to MAX
      let validMax = maxValue(inputAttr, inputValue);
      // Manage error
      errorManagement(inputAttr.id.value, 'minMax', validMax);
      if (validMax) {
        // Checks that value is <= to MAX
        let validMin = minValue(inputAttr, inputValue);
        // Manage error
        errorManagement(inputAttr.id.value, 'minMax', validMin);
      }
    } else if (inputType === "text" ) { // console.log('inputAttr.required', inputAttr.required);
      // Input is required ?
      if (inputAttr.required) {
        // Checks that value is present
        let validRequired = isRequired(inputValue);
        // Manage error
        errorManagement(inputAttr.id.value, 'required', validRequired);
      }

      // input has minlength ?
      if (inputAttr.minlength) {
        // Check that value has length
        let validRequired = minlengthValue(inputAttr, inputValue);
        // Manage error
        errorManagement(inputAttr.id.value, 'minLength', validRequired);
      }
    } else if (inputType === "radio" ) { // console.log('radio', input.name);
      let radioName = document.getElementsByName(input.name);
      let i = 0;
      while(i < radioName.length){
        if (radioChecked === false && radioName[i].checked) radioChecked = true;
        i++;
      }
      // Manage error
      errorManagement(inputAttr.id.value, 'selectOption', radioChecked);
    }
  })
}

// value is required
function formCheck(e) {
  let inputAttr = e.target.attributes;
  let inputType = inputAttr.type.value;
  let inputValue = e.target.value;
  let radioChecked = false;

  if (inputType === "checkbox") { // console.log('Checkbox : required', inputAttr.required, ', checked', input.checked)
    // Get required attribute
    let isRequired = inputAttr.required;
    // Input is required ?
    if (isRequired) errorManagement(inputAttr.id.value, 'checkTerms', e.checked);
  } else if (inputType === "date") {
    // Checks that value is present
    let validDate = dateValue(inputValue);
    // Manage error
    errorManagement(inputAttr.id.value, 'birthdate', validDate);
  } else if (inputType === "email" ) {
    // Check that email input value is valid
    let validEmail = emailValue(inputValue);
    // Manage error
    errorManagement(inputAttr.id.value, 'email', validEmail);
  } else if (inputType === "number" ) {
    // Checks that value is > to MAX
    let validMax = maxValue(inputAttr, inputValue);
    // Manage error
    errorManagement(inputAttr.id.value, 'minMax', validMax);
    if (validMax) {
      // Checks that value is <= to MAX
      let validMin = minValue(inputAttr, inputValue);
      // Manage error
      errorManagement(inputAttr.id.value, 'minMax', validMin);
    }
  } else if (inputType === "text" ) { // console.log('inputAttr.required', inputAttr.required);
    // Input is required ?
    if (inputAttr.required) {
      // Checks that value is present
      let validRequired = isRequired(inputValue);
      // Manage error
      errorManagement(inputAttr.id.value, 'required', validRequired);
    }

    // input has minlength ?
    if (inputAttr.minlength) {
      // Check that value has length
      let validRequired = minlengthValue(inputAttr, inputValue);
      // Manage error
      errorManagement(inputAttr.id.value, 'minLength', validRequired);
    }
  } else if (inputType === "radio" ) { console.log('radio', inputAttr.name.value);
    let radioName = document.getElementsByName(inputAttr.name.value);
    let i = 0;
    while(i < radioName.length){
      if (radioChecked === false && radioName[i].checked) radioChecked = true;
      i++;
    }
    // Manage error
    errorManagement(inputAttr.id.value, 'selectOption', radioChecked);
  }
}

function checkboxRequired(attr, value) {
  console.log('checkboxRequired');
  return
}
/**
 * Check that date value is valid date
 * @param {string} value
 * @returns boolean
 */
function dateValue(value) {
  let dateValue = new Date(value);
  if (dateValue.getTime() === dateValue.getTime()) dateValid = true;
  else dateValid = false;
  return dateValid
}

function maxValue(attr, value) {
  console.log('maxValue', value, attr.max.value, (parseInt(attr.max.value) > parseInt(value) ? true : false));
  return parseInt(value) <= attr.max.value ? true : false
}

function minValue(attr, value) { console.log('minValue', value, attr.min.value, (parseInt(value) >= attr.min.value ? true : false));
  return parseInt(value) >= attr.min.value ? true : false
}
/**
 * Check that email value is valid email
 * @param {string} value
 * @returns boolean
 */
function emailValue(value) { console.log('emailValue', value !== '');
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let emailRegex = new RegExp(regex);
  let emailValid = emailRegex.test(value);
  return emailValid
}
/**
 * Check that input has value
 * @param {string} value
 * @returns boolean
 */
function isRequired(value) { // console.log('isRequired', value !== '');
  return (value !== '' ? true : false)
}
/**
 * Check input's value length
 * @param {Array} attr Input's attributes array.
 * @param {string} value Input's value.
 * @returns boolean
 */
function minlengthValue(attr, value) {
  return (value.length >= attr.minlength.value ? true : false)
}
/**
 * Add/remove errorMessage for input
 * @param {string} input The input's ID
 * @param {string} errorType The error message ID
 * @param {boolean} isValid If true, the error message will be remove from error node. Default 'false'.
 * @returns
 */
function errorManagement(input, errorType, isValid) { console.log('errorManagement', errorType, isValid);
  // Get error container node
  let errorContainer = document.querySelector('#' + input + '~ .error', '#' + input + '~ label .error');
  // Get current error container
  let currentErrorContainer = errorContainer.querySelector('.' + errorType);

  // Error valid set to true and message is removed in case input of validation
  console.log('isValid && currentErrorContainer', isValid, currentErrorContainer, isValid && currentErrorContainer);
  if (isValid) {
    // Set valid to false
    errorsList.find(x => x.name == errorType).valid = true;
    // Remove error message from DOM
    if (currentErrorContainer) currentErrorContainer.remove();
  } else {
    // Check if errorType already exist as a class for input's error container
    // In case of detection the script return false to avoid duplicated error message
    if (errorContainer.querySelector('.' + errorType)) return false

    // Set valid to false
    errorsList.find(x => x.name == errorType).valid = false;
    // Get error message
    let newErrorMessage = errorsList.find(x => x.name == errorType).message;
    // Create SPAN node
    let newerrorManagement = document.createElement('SPAN');
    // Add errorType as a className to SPAN node
    newerrorManagement.classList.add(errorType);
    // Create textNode and assign error message
    let newErrorTextNode = document.createTextNode(newErrorMessage);
    // Add textNode to SPAN node
    newerrorManagement.appendChild(newErrorTextNode);
    // Add SPAN node to DOM
    errorContainer.insertAdjacentElement('beforeend', newerrorManagement);
  }
}
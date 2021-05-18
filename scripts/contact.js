const form = document.querySelector("form");

const formName = document.querySelector("#name");
const formEmail = document.querySelector("#email");
const formMessage = document.querySelector("#message");
const formButton = document.querySelector("#button");
const formNotifications = document.querySelector("#form-notifications");

const errorMessages = {
  name: "please provide a valid name",
  email: "please provide a valid email",
  message: "please provide a valid message",
  default: "please fill in the form fields before submitting",
};


/**
 * Render error notifications and change button state
 * @param {Object} hasErrors
 */

function renderFormState(hasErrors) {
  formNotifications.innerHTML = ""; // removes previous notifications

  if (hasErrors.length === 1) {
    formNotifications.innerHTML = `<span class="--block">${hasErrors[0]}</span>`;
    changeButtonState();
  }

  if (hasErrors.length > 1) {
    hasErrors.forEach((errMsg) => {
      let spanTag = document.createElement("span");
      spanTag.setAttribute("class", "--block");
      spanTag.innerHTML = errMsg;
      formNotifications.appendChild(spanTag);
    });
    changeButtonState();
  }  

  if (hasErrors === false) {
    formName.value = "";
    formEmail.value = "";
    formMessage.value = "";
    changeButtonState("success");
  }
}

/**
 * Validate form fields values
 * @param {Object} fields
 * @returns false || Object
 */

function formValidator(fields) {
  let emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  let responses = [];
  let errCounter = 0;

  fields.forEach((field) => {
    if (!field.value) {
      errCounter++;

      errCounter === 3
        ? (responses = [errorMessages.default])
        : responses.push(errorMessages[field.type]);
    }
    if (
      field.value &&
      field.type === "email" &&
      emailPattern.test(field.value) === false
    ) {
      errCounter++;

      responses.push(errorMessages[field.type]);
    }
  });

  if (errCounter > 0) return responses;
  if (errCounter === 0) return false;
}

/**
 * Change the button UI according to it's state
 * @param {string} type
 */

function changeButtonState(type) {
  switch (type) {
    case "loading":
      formButton.setAttribute("class", "btn btn--loading");
      formButton.innerHTML =
        '<span class="fas fa-circle-notch fa-spin"></span>';
      break;
    case "success":
      formButton.setAttribute("class", "btn btn--success");
      formButton.innerHTML = "Thank you! 🙏";
      break;
    default:
      formButton.setAttribute("class", "btn btn--orange");
      formButton.innerHTML = "Send";
  }
}


/**
 * On form submit event steps:
 * 1 - trims the required values if any
 * 2 - validate the form fields
 * 3 - changes button to a loading state
 * 4 - wait 3s to update the form and the button UI elements 
 */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let formFields = [
    { value: formName.value.trim(), type: formName.name },
    { value: formEmail.value.trim(), type: formEmail.name },
    { value: formMessage.value.trim(), type: formMessage.name },
  ];

  let hasErrors = formValidator(formFields);

  changeButtonState("loading");

  setTimeout(() => renderFormState(hasErrors), 3000);
});

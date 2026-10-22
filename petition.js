// The petition page's script. It's separate from script.js, because
// script.js expects the donation form's parts and would break here.
//
// This file is loaded with "defer", so it only runs once the whole page
// has been built. That's why there's no DOMContentLoaded wrapper here.
//
// Nothing is sent or stored: no cookies, no storage, no logging.

// ----------------------------------------------------------
// The parts of the page we work with
// ----------------------------------------------------------

const form = document.querySelector("#petition-form");
const petitionHeading = document.querySelector("#petition-heading");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const emailInput = document.querySelector("#email");
const postalCodeInput = document.querySelector("#postal-code");

const thankYou = document.querySelector("#petition-thank-you");
const thankYouHeading = document.querySelector("#petition-thank-you-heading");
const signerName = document.querySelector("#signer-name");
const restartButton = document.querySelector("#restart-petition");

const errorSummary = document.querySelector("#error-summary");
const errorSummaryTitle = document.querySelector("#error-summary-title");
const errorSummaryList = document.querySelector("#error-summary-list");

// ----------------------------------------------------------
// The data
// ----------------------------------------------------------

// Error messages, worded the same as on the donation page
const errorMessages = {
  firstName: "Please enter your first name.",
  lastName: "Please enter your last name.",
  emailMissing: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address, like name@example.com.",
  postalCode: "Please enter your postal code.",
};

// A valid email: some text, an @, some text, a dot, some text,
// and no spaces anywhere. It can't catch every typo, but no check can.
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ----------------------------------------------------------
// Showing and clearing errors
//
// These functions are copied from script.js on purpose, so the tested
// donation page stays untouched. In a bigger project they would be
// shared in one file that both pages load.
//
// Each input's group is the nearest ".field" around it, and its
// error spot has the input's id plus "-error", like "email-error".
// ----------------------------------------------------------

// Shows a message under a field: a "!" icon, a hidden "Error:" for
// screen readers, then the words. Also marks the field and its group.
function showError(input, message) {
  const errorSpot = document.getElementById(input.id + "-error");

  // The "!" is decoration, so screen readers skip it
  const icon = document.createElement("span");
  icon.className = "error-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "!";

  // Screen readers hear "Error:" first, so it doesn't sound like a hint
  const errorLabel = document.createElement("span");
  errorLabel.className = "visually-hidden";
  errorLabel.textContent = "Error: ";

  const words = document.createElement("span");
  words.textContent = message;

  errorSpot.textContent = "";
  errorSpot.append(icon, errorLabel, words);
  input.setAttribute("aria-invalid", "true");
  input.closest(".field").classList.add("has-error");
}

// Puts a field back to normal.
// We empty the error spot instead of just hiding it, because
// aria-describedby reads hidden text too, so an old message would
// still be read out. We remove aria-invalid instead of setting it to
// "false", so the field is back exactly as it was when the page loaded.
function clearError(input) {
  document.getElementById(input.id + "-error").textContent = "";
  input.removeAttribute("aria-invalid");
  input.closest(".field").classList.remove("has-error");
}

// Moves the cursor into a field and scrolls its label into view too,
// so the person can see what the box is for
function focusField(input) {
  const label = document.querySelector('label[for="' + input.id + '"]');
  label.scrollIntoView();
  input.focus({ preventScroll: true });
}

// Fills the summary box with one link per error and moves focus to it
function showErrorSummary(errors) {
  errorSummaryTitle.textContent =
    "Please fix " + errors.length + " things to continue";
  errorSummaryList.textContent = "";

  errors.forEach(function (error) {
    const link = document.createElement("a");
    link.href = "#" + error.input.id;
    link.textContent = error.message;

    // Clicking a link puts the cursor in that field
    link.addEventListener("click", function (event) {
      event.preventDefault();
      focusField(error.input);
    });

    const item = document.createElement("li");
    item.append(link);
    errorSummaryList.append(item);
  });

  errorSummary.hidden = false;
  errorSummary.focus();
}

function hideErrorSummary() {
  errorSummary.hidden = true;
  errorSummaryList.textContent = "";
}

// Shows the errors. With one error, focus goes to that field.
// With more, the summary box appears. Returns true if there were none.
function reportErrors(errors) {
  hideErrorSummary();

  errors.forEach(function (error) {
    showError(error.input, error.message);
  });

  if (errors.length === 1) {
    errors[0].input.focus();
  } else if (errors.length > 1) {
    showErrorSummary(errors);
  }

  return errors.length === 0;
}

// ----------------------------------------------------------
// Checking the petition
// Returns a list of problems: which input, and what to say.
// ----------------------------------------------------------

function checkPetition() {
  const errors = [];

  [firstNameInput, lastNameInput, emailInput, postalCodeInput].forEach(
    clearError,
  );

  if (firstNameInput.value.trim() === "") {
    errors.push({ input: firstNameInput, message: errorMessages.firstName });
  }

  if (lastNameInput.value.trim() === "") {
    errors.push({ input: lastNameInput, message: errorMessages.lastName });
  }

  const email = emailInput.value.trim();
  if (email === "") {
    errors.push({ input: emailInput, message: errorMessages.emailMissing });
  } else if (!validEmail.test(email)) {
    errors.push({ input: emailInput, message: errorMessages.emailInvalid });
  }

  if (postalCodeInput.value.trim() === "") {
    errors.push({ input: postalCodeInput, message: errorMessages.postalCode });
  }

  return errors;
}

// ----------------------------------------------------------
// After signing, and starting again
// ----------------------------------------------------------

// Hides the form, shows the thank-you and moves focus to its heading
function showThankYou() {
  // textContent shows whatever was typed as plain text
  signerName.textContent = firstNameInput.value.trim();

  form.hidden = true;
  thankYou.hidden = false;
  thankYouHeading.focus();
}

// Puts the petition back as if the page had just loaded
function restartPetition() {
  form.reset();
  [firstNameInput, lastNameInput, emailInput, postalCodeInput].forEach(
    clearError,
  );
  hideErrorSummary();

  thankYou.hidden = true;
  form.hidden = false;
  petitionHeading.focus();
}

// ----------------------------------------------------------
// Listen for changes
// ----------------------------------------------------------

// Pressing Sign the petition: stop the page from reloading, then check
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (reportErrors(checkPetition())) {
    showThankYou();
  }
});

restartButton.addEventListener("click", restartPetition);

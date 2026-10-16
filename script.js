// This file is loaded with "defer", so it only runs once the whole page
// has been built. That's why there's no DOMContentLoaded wrapper here.

// ----------------------------------------------------------
// The parts of the page we work with
// ----------------------------------------------------------

const form = document.querySelector("#donation-form");
const headline = document.querySelector("#headline");
const frequencyFieldset = document.querySelector(".frequency");
const amountFieldset = document.querySelector(".amounts");
const monthlyNote = document.querySelector("#monthly-note");
const otherAmountBox = document.querySelector("#other-amount-box");
const otherAmountInput = document.querySelector("#other-amount");
const impactMessage = document.querySelector("#impact-message");
const otherAmountError = document.querySelector("#other-amount-error");

// The four preset amount radios (not "Other amount"), in page order
const presetRadios = document.querySelectorAll(
  '.amount-option:not(.amount-option-other) input[name="amount"]',
);
const otherRadio = document.querySelector(
  'input[name="amount"][value="other"]',
);

// ----------------------------------------------------------
// The data
// ----------------------------------------------------------

// The preset amounts for each way of giving
const amountsByFrequency = {
  once: [25, 50, 100, 250],
  monthly: [10, 15, 25, 50],
};

// What each amount helps with. $25 and $50 say the same thing
// for once and monthly, so one list keyed by amount covers both.
const impactLines = {
  10: "Helps provide food and a warm bed for a rescued dog each month.",
  15: "Helps cover regular check-ups for dogs in our care.",
  25: "Helps cover a vet check for a rescued dog.",
  50: "Helps provide vaccinations and a safe place to recover.",
  100: "Helps fund a week of care while a dog waits for a home.",
  250: "Helps support the rescue of several dogs from one breeding site.",
};
const otherAmountLine = "Every dollar helps a dog get a second chance.";

// Error messages, worded exactly as in the spec
const errorMessages = {
  amountMissing: "Please choose or enter an amount.",
  amountNotNumber: "Please enter a number, like 25 or 25.50.",
  amountTooSmall: "Please enter an amount of at least $5.",
};

// A valid amount: one or more digits, then optionally
// a dot and one or two digits. So 25, 25.5 and 25.50 pass.
const validNumber = /^\d+(\.\d{1,2})?$/;

// ----------------------------------------------------------
// A/B test: show headline B when the URL ends in ?v=b
// ----------------------------------------------------------

const urlOptions = new URLSearchParams(window.location.search);

if (urlOptions.get("v") === "b") {
  headline.textContent = "Your $50 can help a rescued dog recover";
}

// ----------------------------------------------------------
// Keep step 1 in sync with whatever radios are ticked
// ----------------------------------------------------------

// Reads which radios are actually ticked and updates everything that
// depends on them: amount labels and values, the monthly note,
// the Other amount box and the impact line.
function updateAmounts() {
  const frequency = form.querySelector('input[name="frequency"]:checked').value;
  const amounts = amountsByFrequency[frequency];

  // Give the four preset buttons the amounts for this frequency.
  // Only the text span changes, so the check icon stays in place.
  presetRadios.forEach(function (radio, index) {
    radio.value = amounts[index];
    radio.parentElement.querySelector(".amount-text").textContent =
      "$" + amounts[index];
  });

  // Show the monthly note only for monthly gifts
  monthlyNote.hidden = frequency !== "monthly";

  // Show the "Other amount" box only when that option is picked.
  // When it hides, clear its error so an old message doesn't come back later.
  otherAmountBox.hidden = !otherRadio.checked;
  if (otherAmountBox.hidden) {
    clearError(otherAmountInput, otherAmountBox, otherAmountError);
  }

  // Pick the impact line that matches the chosen amount
  const chosen = form.querySelector('input[name="amount"]:checked');
  let line = otherAmountLine;
  if (chosen && chosen !== otherRadio) {
    line = impactLines[chosen.value];
  }

  // Only change the text if it's different, so screen readers
  // don't repeat the same line
  if (impactMessage.textContent.trim() !== line) {
    impactMessage.textContent = line;
  }
}

// ----------------------------------------------------------
// Showing and clearing errors
// ----------------------------------------------------------

// Shows a message under a field: a "!" icon, a hidden "Error:" for
// screen readers, then the words. Also marks the field and its group.
function showError(input, group, errorSpot, message) {
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
  group.classList.add("has-error");
}

// Puts a field back to normal.
// We empty the error spot instead of just hiding it, because
// aria-describedby reads hidden text too, so an old message would
// still be read out. We remove aria-invalid instead of setting it to
// "false", so the field is back exactly as it was when the page loaded.
function clearError(input, group, errorSpot) {
  errorSpot.textContent = "";
  input.removeAttribute("aria-invalid");
  group.classList.remove("has-error");
}

// ----------------------------------------------------------
// Checking step 1
// ----------------------------------------------------------

// Removes spaces, commas and a "$" at the start,
// so "$25" becomes "25" and "1,000" becomes "1000"
function cleanAmount(typed) {
  return typed.replace(/[\s,]/g, "").replace(/^\$/, "");
}

// Checks step 1. Shows an error and returns false if something is wrong.
function checkStep1() {
  clearError(otherAmountInput, otherAmountBox, otherAmountError);

  // Preset amounts are always fine, so only "Other amount" needs checking
  if (!otherRadio.checked) {
    return true;
  }

  const amount = cleanAmount(otherAmountInput.value);
  let message = "";

  if (amount === "") {
    message = errorMessages.amountMissing;
  } else if (!validNumber.test(amount)) {
    message = errorMessages.amountNotNumber;
  } else if (Number(amount) < 5) {
    message = errorMessages.amountTooSmall;
  }

  if (message) {
    showError(otherAmountInput, otherAmountBox, otherAmountError, message);
    // Moving focus here makes screen readers read the label, hint and error
    otherAmountInput.focus();
    return false;
  }

  return true;
}

// ----------------------------------------------------------
// Listen for changes
// ----------------------------------------------------------

// Switching between once and monthly
frequencyFieldset.addEventListener("change", function () {
  // Keep "Other amount" only if the donor has typed something in it.
  // Otherwise pick the second option ($50 once, $15 monthly).
  const hasTypedAmount = otherAmountInput.value.trim() !== "";
  if (!(otherRadio.checked && hasTypedAmount)) {
    presetRadios[1].checked = true;
  }
  updateAmounts();
});

// Picking an amount
amountFieldset.addEventListener("change", updateAmounts);

// Pressing Continue: stop the page from reloading, then check step 1
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (checkStep1()) {
    // Moving to step 2 comes in the next step
  }
});

// Run once on load too, because browsers can restore
// ticked radios after a refresh
updateAmounts();

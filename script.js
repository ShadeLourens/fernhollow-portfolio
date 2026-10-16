// This file is loaded with "defer", so it only runs once the whole page
// has been built. That's why there's no DOMContentLoaded wrapper here.

// ----------------------------------------------------------
// The parts of the page we work with
// ----------------------------------------------------------

const form = document.querySelector("#donation-form");
const headline = document.querySelector("#headline");
const steps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

// Step 1
const frequencyFieldset = document.querySelector(".frequency");
const amountFieldset = document.querySelector(".amounts");
const monthlyNote = document.querySelector("#monthly-note");
const otherAmountBox = document.querySelector("#other-amount-box");
const otherAmountInput = document.querySelector("#other-amount");
const impactMessage = document.querySelector("#impact-message");

// The four preset amount radios (not "Other amount"), in page order
const presetRadios = document.querySelectorAll(
  '.amount-option:not(.amount-option-other) input[name="amount"]',
);
const otherRadio = document.querySelector(
  'input[name="amount"][value="other"]',
);

// Step 2
const giftAmountText = document.querySelector("#gift-amount");
const giftFrequencyText = document.querySelector("#gift-frequency");
const changeGiftButton = document.querySelector("#change-gift");
const backToStep1Button = document.querySelector("#back-to-step-1");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const emailInput = document.querySelector("#email");
const countrySelect = document.querySelector("#country");
const postalCodeInput = document.querySelector("#postal-code");

// Error summary
const errorSummary = document.querySelector("#error-summary");
const errorSummaryTitle = document.querySelector("#error-summary-title");
const errorSummaryList = document.querySelector("#error-summary-list");

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
  firstName: "Please enter your first name.",
  lastName: "Please enter your last name.",
  emailMissing: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address, like name@example.com.",
  country: "Please select your country.",
  postalCode: "Please enter your postal code.",
};

// A valid amount: one or more digits, then optionally
// a dot and one or two digits. So 25, 25.5 and 25.50 pass.
const validNumber = /^\d+(\.\d{1,2})?$/;

// A valid email: some text, an @, some text, a dot, some text,
// and no spaces anywhere. It can't catch every typo, but no check can.
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ----------------------------------------------------------
// What the donor has chosen so far
// ----------------------------------------------------------

// Which step is showing. We use this, not the button that was pressed,
// because pressing Enter in a text box always "presses" the form's
// first submit button (step 1's Continue), even when it's hidden.
let currentStep = 1;

// Saved when step 1 passes, so later steps read one value
// instead of reading the form again
let giftAmount = 0;
let giftFrequency = "once";

// ----------------------------------------------------------
// A/B test: show headline B when the URL ends in ?v=b
// ----------------------------------------------------------

const urlOptions = new URLSearchParams(window.location.search);

if (urlOptions.get("v") === "b") {
  headline.textContent = "Your $50 can help a rescued dog recover";
}

// ----------------------------------------------------------
// Small helpers
// ----------------------------------------------------------

// Writes an amount as money: whole numbers get commas ("$1,000", "$50"),
// anything else gets two decimals ("$25.50")
function formatMoney(amount) {
  if (Number.isInteger(amount)) {
    return "$" + amount.toLocaleString("en-US");
  }
  return (
    "$" +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Removes spaces, commas and a "$" at the start,
// so "$25" becomes "25" and "1,000" becomes "1000"
function cleanAmount(typed) {
  return typed.replace(/[\s,]/g, "").replace(/^\$/, "");
}

// ----------------------------------------------------------
// Moving between steps
// ----------------------------------------------------------

// Shows one step, hides the others, updates the progress bar
// and moves focus to the new step's heading. Moving focus also
// scrolls the heading into view, so we don't scroll separately.
function showStep(number) {
  currentStep = number;
  hideErrorSummary();

  steps.forEach(function (step, index) {
    step.hidden = index + 1 !== number;
  });

  progressSteps.forEach(function (item, index) {
    const stepNumber = index + 1;
    const isDone = stepNumber < number;

    if (stepNumber === number) {
      item.setAttribute("aria-current", "step");
    } else {
      item.removeAttribute("aria-current");
    }

    // Finished steps keep an amber bar, and screen readers hear "(completed)"
    item.classList.toggle("is-complete", isDone);
    item.querySelector(".completed-text").textContent = isDone
      ? " (completed)"
      : "";
  });

  steps[number - 1].querySelector("h2").focus();
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
    clearError(otherAmountInput);
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
// so the donor can see what the box is for
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

// Shows a step's errors. With one error, focus goes to that field.
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
// Checking each step
// Each check returns a list of problems: which input, and what to say.
// ----------------------------------------------------------

function checkStep1() {
  clearError(otherAmountInput);

  // Preset amounts are always fine, so only "Other amount" needs checking
  if (!otherRadio.checked) {
    return [];
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
    return [{ input: otherAmountInput, message: message }];
  }
  return [];
}

function checkStep2() {
  const errors = [];

  [
    firstNameInput,
    lastNameInput,
    emailInput,
    countrySelect,
    postalCodeInput,
  ].forEach(clearError);

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

  if (countrySelect.value === "") {
    errors.push({ input: countrySelect, message: errorMessages.country });
  }

  if (postalCodeInput.value.trim() === "") {
    errors.push({ input: postalCodeInput, message: errorMessages.postalCode });
  }

  return errors;
}

// Saves the chosen gift and writes it into step 2's summary line
function saveGift() {
  giftFrequency = form.querySelector('input[name="frequency"]:checked').value;

  if (otherRadio.checked) {
    giftAmount = Number(cleanAmount(otherAmountInput.value));
  } else {
    giftAmount = Number(
      form.querySelector('input[name="amount"]:checked').value,
    );
  }

  giftAmountText.textContent = formatMoney(giftAmount);
  giftFrequencyText.textContent =
    giftFrequency === "monthly" ? "monthly" : "one-time";
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

// "Change" and "Back" both go back to step 1
changeGiftButton.addEventListener("click", function () {
  showStep(1);
});

backToStep1Button.addEventListener("click", function () {
  showStep(1);
});

// Pressing Continue: stop the page from reloading,
// then check the step that's showing
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (currentStep === 1) {
    if (reportErrors(checkStep1())) {
      saveGift();
      showStep(2);
    }
  } else if (currentStep === 2) {
    if (reportErrors(checkStep2())) {
      // Moving to step 3 comes in the next step
    }
  }
});

// Run once on load too, because browsers can restore
// ticked radios after a refresh
updateAmounts();

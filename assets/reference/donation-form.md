# Donation form spec

**Status: DRAFT.** Written by Claude from `docs/Fernhollow-Donation-Form.html` and CLAUDE.md, with the owner's decisions applied. Nothing here is approved until the owner has reviewed it. Items marked **Open** still need a decision.

## Goal

A three-step donation form (amount, details, payment) and a thank-you step for the Second Chances campaign. It shows how custom CSS and TypeScript enhance eCRM-generated form markup without editing it.

## Scope

**In:** steps 1–3, the thank-you step, inline validation, the mocked payment, and the headline A/B variant.

**Out (per CLAUDE.md):** real payment processing, the donation receipt email, the impact story, and the script monitor.

## Page structure

- `template.html` (ours, editable) holds the header, hero, footer and the empty `.df-card`. It already exists.
- `platform.html` (read-only once written) holds the form markup the eCRM would generate: all fields for all steps, as native inputs.
- Our TypeScript splits that markup into steps, validates, and moves focus. Our Sass styles it. Neither edits `platform.html`.
- `mock-gateway.js` stands in for the payment provider's script.
- **Without JavaScript,** the form still works as one long page, with every step visible. The mocked payment needs the gateway script, just as real provider-hosted card fields do.

**Platform markup:** modeled on Engaging Networks naming conventions (`en__` classes and dotted field names such as `supporter.firstName`), without copying any real organization's page. The owner approves a sample before the file is written.

## All steps

- A progress bar shows three steps: Amount, Your details, Payment. The current step has `aria-current="step"`. Current and completed segments use `$amber`, and upcoming ones use `$line-light`. Inactive labels are `$slate`, which is on white, so it passes.
- The heading of each step reads "Step N of 3: …". When the step changes, focus moves to that heading.
- A line near the top states: "All fields are required unless marked optional."
- A privacy link sits near every step that collects data.
- **Control borders use `$slate`** (4.9:1): text inputs, the select, checkboxes, and the unselected amount and Other amount options. This replaces the design's `$grey-400` and `$grey-300`, which fall below the 3:1 that form controls need.

## Step 1: Choose your gift

| Element | Detail |
|---|---|
| Heading | "Step 1 of 3: Choose your gift" |
| Frequency | Native radios in a `<fieldset>`, legend "How often would you like to give?". Options "Give once" and "Give monthly". Default: once. Monthly is never preselected. Styled as the design's two-part toggle. |
| Monthly note | When monthly is chosen: "Monthly gifts let us plan rescues ahead. Cancel any time." |
| Amounts | Native radios in a `<fieldset>`, legend "Choose an amount". Once: $25, $50, $100, $250. Monthly: $10, $15, $25, $50. Plus "Other amount". |
| Default amount | $50, the second one-time option, is preselected on load. |
| Switching frequency | Preselects the second option of the new set ($50 once, $15 monthly). If the donor chose Other amount and typed a value, Other stays selected and the value is kept. |
| Selected amount | `$orange` border and `$cream` background as in the design, **plus a check icon**, so selection doesn't rely on color (CLAUDE.md). |
| Other amount | Shown when "Other amount" is picked. Label "Other amount (USD)", hint "Minimum gift is $5", with a `$` prefix. Accepts digits and up to two decimals. |
| Impact message | Updates with the amount, in a polite live region. See the impact lines below. |
| Button | "Continue" |

**Impact lines** (placeholders, not real statistics):

| Amount | Line |
|---|---|
| $25 once or monthly | Helps cover a vet check for a rescued dog. |
| $50 once or monthly | Helps provide vaccinations and a safe place to recover. |
| $100 once | Helps fund a week of care while a dog waits for a home. |
| $250 once | Helps support the rescue of several dogs from one breeding site. |
| $10 monthly | Helps provide food and a warm bed for a rescued dog each month. |
| $15 monthly | Helps cover regular check-ups for dogs in our care. |
| Other amount | Every dollar helps a dog get a second chance. |

## Step 2: Your details

| Element | Detail |
|---|---|
| Heading | "Step 2 of 3: Your details" |
| Gift summary | "Your gift: **$50** one-time." (or "monthly"), with a "Change" link back to step 1 |
| First name | `autocomplete="given-name"` |
| Last name | `autocomplete="family-name"` |
| Email address | `type="email"`, `autocomplete="email"`, hint "We'll send your receipt here." |
| Country | `<select>` with "Select…" plus US, Canada, UK, Australia, Ireland, New Zealand, South Africa |
| Postal code | Required. `autocomplete="postal-code"`. Every country in the list uses postal codes. |
| Email opt-in | Checkbox, **unticked by default**, separate from giving: "Yes, email me updates about rescues and ways to help. You can unsubscribe at any time." |
| Buttons | "Back" and "Continue to payment" |
| Privacy line | "We use your details to process your gift and send your receipt. Read our Privacy Policy." |

The receipt wording stays as realistic demo copy. The thank-you step says that no email is sent.

## Step 3: Payment

| Element | Detail |
|---|---|
| Heading | "Step 3 of 3: Payment" |
| Demo note | "This is a demo. No payment will be processed. Use the test card 4242 4242 4242 4242 with any future expiry date and any 3-digit CVC." (`$peach` note with an `$orange` stripe) |
| Card fields | Card number, Expiry date (MM/YY), Security code (CVC). These sit in `platform.html` and stand in for provider-hosted fields. |
| Fee cover | Checkbox, **unticked by default**: "Add $X to cover processing fees, so more of my gift goes to animals." Fee = 2.9% + $0.30. |
| Monthly notice | "You'll be charged **$X** today and then every month until you cancel. You can cancel at any time." |
| Submit | "Give $X once" (or "monthly"). It includes the fee when the box is ticked. While processing it reads "Processing your gift…", and repeat submits are blocked. |
| Failure | Alert: "We couldn't process your payment. Please check your details or try another card." |
| Security line | "Your card details are entered in a secure field and are never stored by Fernhollow." |
| Buttons | "Back" and the submit button |

**Mock gateway:**
- `mock-gateway.js` validates the card fields, as a real provider's script would. It sends error events with the messages listed under Validation. Our code shows those messages in the standard error pattern **without reading card values**.
- Card number `4242 4242 4242 4242` succeeds, and any other number fails. Our code only listens for the gateway's success, failure and validation events.

## Thank-you step

- Logo mark, then the heading "Thank you, {first name}." Focus moves to the heading.
- "Your **$X one-time** gift is helping dogs like Biscuit get the care and the home they deserve. A receipt is on its way to **{email}**."
- A small line under it: "Demo: no email is actually sent."
- Two cards:
  - **Add your voice:** "Sign our petition to end puppy mill cruelty." with a "Sign the petition" link to the petition page.
  - **Spread the word:** "Share this campaign with a friend." with a "Copy link" button, which reads "Link copied" after a click.
- If the donor didn't opt in: "Want to hear how your gift is used?" with a "Sign up for updates" button. After a click: "You're signed up for updates." (status message)
- "Restart demo" button

## Validation and errors

- Validate when the donor tries to continue, not while they type.
- **Inline errors** sit under the field, linked to it with `aria-describedby`, and set `aria-invalid="true"`. Each has an error icon as well as color.
- **With more than one error,** an error summary appears ("Please fix N things to continue") and focus moves to it. With one error, focus moves to that field.
- Card field errors come from `mock-gateway.js` events, not from our code reading the fields.

| Field | Message |
|---|---|
| Amount, none chosen | Please choose or enter an amount. |
| Other amount, not a number | Please enter a number, like 25 or 25.50. |
| Other amount, under $5 | Please enter an amount of at least $5. |
| First name | Please enter your first name. |
| Last name | Please enter your last name. |
| Email, empty | Please enter your email address. |
| Email, invalid | Please enter a valid email address, like name@example.com. |
| Country | Please select your country. |
| Postal code | Please enter your postal code. |
| Card number (gateway) | Your card number looks incomplete. |
| Expiry (gateway) | Please check your expiry date. |
| CVC (gateway) | Please enter your 3-digit security code. |

## Where the build differs from the design (CLAUDE.md wins)

1. The frequency toggle and the amounts are **native radios**, not buttons with `role="radio"` or `aria-pressed`.
2. The selected amount gets a **check icon**.
3. On errors, **focus moves** to the summary or the field. The design only makes an announcement.
4. The page includes the **"All fields are required"** statement.
5. Smooth scroll-to-top and the submit spinner respect **`prefers-reduced-motion`**.
6. **Control borders** are `$slate`, not `$grey-400` or `$grey-300`.

## Analytics

- **No GA4 or Iubenda on the donation page.** The reason: fewer third-party scripts on a payment page. PCI DSS v4 requires every script on a payment page to be authorized, inventoried and monitored for changes.
- A/B events push to `window.dataLayer` only. The code says that in production they would go to GA4 after analytics consent.
- `docs/script-inventory.md` lists the donation page as having no third-party scripts. `mock-gateway.js` is ours and stands in for the provider.

## A/B test: headline

- **Change:** only the hero headline.
  - A (control): "Give a dog the second chance they deserve"
  - B: "Your $50 can help a rescued dog recover" (matches the $50 default)
- **Demo assignment:** `?v=b` shows B, and anything else shows A.
- **Primary metric:** successful step 1 completions (donors who moved to step 2), divided by visitors assigned to that variant.
- Per CLAUDE.md, the hypothesis, metric and variants go in `docs/ab-tests.md` **before** building. That includes how a real testing platform would assign variants.
- The design file's "default frequency" A/B option is left out. CLAUDE.md allows one change per test.

## Done when

The Definition of done in CLAUDE.md is met for this page:
- `npm run test:a11y` reports 0 axe violations.
- Lighthouse budgets are met.
- `npm run lint` passes.
- The owner has done a keyboard and screen-reader pass.

## 2026-10-15

**Asked Claude to:** plan and build the page structure and the styling for step 1 (Choose your gift).

**What I changed:**

- Created `index.html`: header, campaign story with Biscuit's photo, the form card with step 1 inside `<form novalidate>`, and the footer.
- Created `styles.css`: brand colors and fonts as variables, phone-first layout that becomes two columns from 900px.
- Added a "Give now" link under the intro that jumps to the form on phones.

**Decisions I made:**

- Continue is a real submit button, and step 1 has its own `<section>`.
- Amount radios have real values (25, 50, 100, 250, other).
- Biscuit's photo isn't lazy-loaded, because it's near the top of the page.
- The selected amount gets a 3px orange border, cream fill and a check icon, so it stands out from the 2px slate borders.
- Focus outlines go on the visible box, because the real radios are hidden.
- Nunito's font weight range is set to 200 1000, so bold isn't faked.
- Smooth scrolling only happens if the visitor hasn't turned on reduced motion.
- The A/B headline B will be "Your $50 can help a rescued dog recover".

**Still to do:**

- `script.js`: Other amount box, monthly switch, impact message, `?v=b` headline.
- Decide how error messages look (the design has no error color yet).
- Maybe swap the placeholder `#` links in the header and footer.
- Test with only a keyboard.

### Later on 2026-10-16

**Asked Claude to:** build step 2 (Your details) with the error summary box, tidy up the layout on very small phones, add bullets to the error summary, and save testing screenshots.

**What I changed:**

- Added step 2: gift summary with a "Change" button, first and last name, email, country, postal code, the email opt-in checkbox, Back and "Continue to payment", and the privacy line.
- Added moving between steps: `currentStep` and `showStep()`. The progress bar updates, finished steps say "(completed)" to screen readers, and focus moves to the new step's heading.
- Added `formatMoney()`: "$1,000" for whole numbers, "$25.50" otherwise. The chosen amount is saved as a number when step 1 passes.
- Added the error summary box: it shows with more than one error, has links that jump to each field (and show its label), and uses amber bullets.
- Made `showError()` and `clearError()` simpler with a naming rule: the error spot is the input's id plus "-error".
- Gave all text boxes and the select one shared `.text-input` style.
- Put country next to postal code from 480px, like first and last name (`.field-row`).
- Very small phones (under 375px): "Give / once" on two lines, the impact icon above its text, and smaller button text.
- Added `text-wrap: balance` to headings and legends, so no word is left alone on the last line.
- Created `testing-screenshots/` and added it to CLAUDE.md.

**Decisions I made:**

- Back and Change are `type="button"`, so they don't submit the form.
- Continue checks `currentStep`, not which button was pressed, because Enter always "presses" the first submit button.
- Kept the browser's own select arrow (clear over clever, and it works in high-contrast mode).
- Added `autocomplete="country-name"` so browsers can fill in the country.
- Fields stay stacked under 480px, because side by side they'd be too narrow at 320px and at 200% zoom.
- The error summary stays one column without numbers, but with bullets so each error is easy to tell apart.

**Tested:**
Keyboard only on steps 1 and 2: Tab moves between groups and fields, the arrows move inside the option groups, and Enter submits.

**Still to do:**

- Maybe add `text-wrap: pretty` so error messages don't leave one word alone on the last line.
- Step 3 (Payment), with the "This is a demo" note.
- Commit step 2 on the `fernhollow/step-2-your-details` branch and open a pull request.

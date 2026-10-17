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
- Step 3 (Payment), with the "This is a demo" note. ✔
- Commit step 2 on the `fernhollow/step-2-your-details` branch and open a pull request. ✔

## 2026-10-17

**Asked Claude to:** build step 3 (Payment), commit it with Claude as co-author, and update the timeline for the new October 26 deadline.

**What I changed:**

- Added step 3: demo note, card number, expiry and CVC, the fee checkbox, the monthly notice, Back and the "Give $X" button.
- Card checks: 13–19 digits, a real expiry that isn't in the past, and a 3-digit CVC.
- Fee is 2.9% + $0.30, worked out in whole cents so rounding is exact. The Give button and monthly notice show the total.
- Fake payment: 4242 4242 4242 4242 succeeds and any other card shows "We couldn't process your payment" in the navy summary box.
- While processing: the button says "Processing your gift…", gets `aria-disabled`, a hidden status message is announced, and extra presses are ignored.
- Updated CLAUDE.md so Claude can commit and push when I ask, with a co-author line.
- Made the site live on GitHub Pages.
- Merged step 2 and step 3 into `main`.

**Decisions I made:**

- Card fields have no `name`, so the browser can never include them in a form submission.
- Card boxes are emptied after a successful payment, and nothing is ever logged.
- I didn't disable the Give button, because it would lose focus. I used `aria-disabled` and a status message instead.
- Changed the spec's security line to "This is a demo, so card details are never sent or stored", because ours aren't real secure fields.
- Skipped adding spaces while typing the card number, card type icons and a spinner, to stay on schedule.
- Claude co-authors my commits, to show my experience working with AI coding tools, which the job asks for.

**Tested:**

- Automated checks: fee maths, card checks, processing, success and decline.

**Still to do:**

- Thank-you step: petition card with a "(demo)" note, Copy link with a fallback message, updates sign-up, Restart demo. ✔
- Test Copy link and "Processing your gift…" with VoiceOver on the live GitHub Pages link.
- Maybe keep the test card number on one line at 320px.
- New timeline: Oct 20 README, Oct 21–23 email, Oct 24 polish, Oct 25 cover letter and submit.

### Later on 2026-10-17

**Asked Claude to:** build the thank-you step (the last part of the donation page).

**What I changed:**

- Added the thank-you step: logo mark, "Thank you, {first name}.", the gift line with the charged total ("$51.75 one-time" or "$15.74 monthly") and the email.
- Put "Demo: no email is actually sent." right under the receipt sentence it's about.
- Repeated the impact line from step 1 as "Your gift helps…", with the general line for Other amounts.
- Petition card with a "Sign petition (demo)" button that explains there's no petition page, instead of a dead link.
- Copy link button: copies the page address without `?v=b` or `#donate`, says "Link copied", and shows a select-to-copy box if copying fails.
- Updates sign-up, only for donors who didn't tick the email box in step 2.
- Restart demo: resets every field, flag, message and the progress bar.
- Fixed extra space under the card headings (added `h3` to the margin reset).
- Less padding in the thank-you boxes on small phones, so buttons are wider.

**Decisions I made:**

- The thank-you step sits outside the `<form>`, so its buttons can never submit it.
- Removing `?v=b` from the shared link stops friends from all landing in one A/B group.
- The sign-up message and the thank-you heading have `tabindex="-1"`, so focus can move to them. When the sign-up button disappears, focus goes to the message, so keyboard users aren't sent back to the top.
- "Link copied" and the petition note are status messages, so screen readers read them out.
- The impact line on the thank-you step is stewardship: telling donors what their money does right after they give.
- The two cards stack at every width, because the form card is too narrow for them side by side.
- I might build a minimal petition page next week if there's time. Then the button becomes a real link.

**Tested:**

- Automated checks: a full donation, Restart, then two more donations with nothing left over. Copy link working and failing, petition note, sign-up focus.

**Still to do:**

- After merging: test Copy link on the live GitHub Pages link, and force the fallback with
  `navigator.clipboard.writeText = () => Promise.reject()` in the Console.
- VoiceOver check: "Processing your gift…", "Link copied", the petition note and the sign-up message.
- Run axe and Lighthouse again on step 3 and the thank-you step.

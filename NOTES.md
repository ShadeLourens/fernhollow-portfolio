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

## 2026-10-21

**Asked Claude to:** plan and build the petition page, link it from the donation thank-you step, and update the README and CLAUDE.md.

**What I changed:**

- Added `petition.html` and `petition.js`: first name, last name, email and postal code, an unticked opt-in, a demo note, a privacy line, and "Sign the petition".
- Same validation, error summary and focus rules as the donation page. The error functions are copied from `script.js`, so the tested donation page didn't change.
- After signing: "Thank you, {first name}. You've signed the petition.", a demo line, and a $50 ask linking to the donation page with UTM tags (`utm_source=petition`, `utm_content=petition-thank-you`) and no personal details.
- Petition styles added at the end of `styles.css`, reusing the donation page's classes.
- The donation thank-you step's "Sign petition (demo)" button is now a real "Sign the petition" link.
- README: the petition page, the supporter journey with the emails project, the Engaging Networks chaining note, and my own "How I built it" wording.
- CLAUDE.md: mentions the petition, plus the new files and `local-reference/`.
- Created `local-reference/` (in `.gitignore`) for my private reference files.
- This repo now commits with my GitHub noreply email. Older commits keep the old address.

**Decisions:**

- I wrote the petition brief and designed the page. My Claude chat wrote the website copy. The petition statement sits in a cream box, like my design.
- The "Sign now" jump link on phones (Same as Donation page)
- Fields without a `name`, so details can never end up in a page address: Claude suggested it, and I approved it.
- Copying the error functions instead of sharing them: from my reviewer chat. I agreed, because it keeps the tested donation page untouched.
- Postal code hint ("So lawmakers can see how many people in their area have signed"): I asked for a line, and approved Claude's wording.
- No cookie banner, because the page sets no cookies, so a banner would be misleading.
- No personal details in the $50 link. Claude found the same advice in Engaging Networks' docs.
- Claude checked Engaging Networks' docs before the README mentions chaining (which carries supporter details between pages), and quotes them.
- Claude pointed out that UTM tags on links within one site can overwrite the original source in Google Analytics. I kept them, because there's no analytics here, and the README explains a real setup would use chaining.
- Claude confirmed the WCAG 2.2 rules for me.

**Tested:**

- Claude's automated checks: empty form, summary links, one error, signing, the $50 link, restart, no named fields, no cookies or storage, and the donation page still working.

**Still to do:**

- Oct 22: test the petition page myself: keyboard, VoiceOver, axe (form, errors, thank-you) and Lighthouse (Navigation and Snapshot modes). Add the results to the README's Testing table.
- Commit and merge the petition branch.

## 2026-10-22

**Asked Claude to:** pick up from the handoff notes after my restart, walk me through testing the petition page, check all the files before pushing, commit and push the petition branch, rename my test screenshots, and draft the petition rows for the README's Testing table.

**What I changed:**

- Committed the petition page in two commits, pushed the `petition-page` branch, and merged pull request #5.
- Made a `testing-screenshots/petition-page/` folder for the petition screenshots.
- README: added petition rows to the Testing table (keyboard, VoiceOver, small screens and zoom, Lighthouse and axe), with screenshot links.

**Decisions:**

- Kept "Give $50 today" as a link, even though Space doesn't press it. Claude explained that links work with Enter and buttons with Enter and Space, and it's a link because it goes to another page.
- Kept Restart demo on the petition thank-you.
- On the donation page, I once saw the "Give monthly" layout break in Safari. When I tested again, everything was normal, so I left it.
- My Claude chat reviewed the Testing rows and suggested adding the small screens and zoom row and checking the donation thank-you step again. I agreed.

**Tested:**

- Me, on my computer: keyboard only (skip link, form, error summary links, one error, thank-you, $50 link, Restart demo, "Sign now" at 320px) and VoiceOver in Safari (headings, labels, postal code hint, errors, thank-you heading, link and button names).
- Me, on the live site: axe on the form, the form with errors and the thank-you (0 issues), and Lighthouse mobile (100 for all four, and 23/23 accessibility checks on the thank-you in Snapshot mode).
- Me: the donation thank-you step again with Lighthouse Snapshot after the petition link change (26/26 accessibility checks).
- Claude, by script: the $50 link works with Enter, and the live petition page has no sideways scrolling at 320px or at 200% zoom.
- After merging, the live site showed old files at first. A hard reload (Cmd+Shift+R) fixed it, because GitHub Pages lets browsers keep saved copies for 10 minutes.

**Still to do:**

- Commit the test results, screenshots and these notes.

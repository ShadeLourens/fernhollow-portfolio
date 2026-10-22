# Fernhollow Animal Alliance: donation form and petition

A multi-step donation form and a petition page for a fictional animal charity, built with plain HTML, CSS and JavaScript. No framework, no build step, no third-party scripts, no cookies.

**[Try the donation form](https://shadelourens.github.io/fernhollow-portfolio/)**. Use the test card `4242 4242 4242 4242` with any future expiry date and any 3-digit CVC. No payment is processed.

**[Try the petition](https://shadelourens.github.io/fernhollow-portfolio/petition.html)**. No signatures are stored.

Built by **Shade Lourens** · [LinkedIn](https://www.linkedin.com/in/shadelourens)

> Fernhollow Animal Alliance is fictional, created for this portfolio.

![The donation form on desktop](testing-screenshots/final-desktop-1280.png)

## What it does

1. **Choose your gift:** give once or monthly, preset amounts or your own, with a message showing what each amount does.
2. **Your details:** name, email, country and postal code, with an email opt-in that's unticked by default.
3. **Payment:** a demo card form with an optional processing fee (2.9% + $0.30) and the total on the Give button.
4. **Thank you:** the donor's name and total, what their gift does, a link to the petition, Copy link, an updates sign-up and Restart demo.

There's also an **A/B test** on the headline: add `?v=b` to the address to see variant B.

### The petition page

- **Fields:** first name, last name, email and postal code. The postal code shows lawmakers how many signers live in their area, and the page says so.
- **Opt-in:** an email opt-in that's unticked by default, a "This is a demo" note and a privacy line.
- **The same validation, error summary and focus rules** as the donation form.
- **After signing:** a thank-you, then a next ask. "Give $50 today" links to the donation form with UTM tags (`utm_source=petition`, `utm_content=petition-thank-you`), so reports can show which gifts came from the petition. The link carries no personal details.

### The supporter journey

Together with the [Fernhollow emails](https://shadelourens.github.io/fernhollow-emails/) ([code](https://github.com/ShadeLourens/fernhollow-emails)), the portfolio covers two paths a supporter can take:

- appeal email → donation form → thank-you → receipt email
- petition → thank-you → donation form

## Accessibility

Built to WCAG 2.2 AA from the start, not checked at the end.

- Real radio buttons, labels, fieldsets and legends, so it works with a keyboard and screen readers without extra code.
- Errors are shown in words under each field, with an icon and a hidden "Error:" for screen readers, so they never rely on color.
- With more than one error, a summary box appears with links that jump to each field.
- Focus moves to each new step's heading, and status messages are announced ("Processing your gift…", "Link copied").
- Brand colors only, with every text pair at 4.5:1 or more. Orange is used only for decoration, never text.
- Buttons and options are well over the 24px minimum tap size, and nothing sticky covers a focused element (both new in WCAG 2.2).
- Works on a 320px phone, at 200% zoom, and respects reduced motion.

## Testing

| Check                          | Result                                                                           | Proof                                                                                                                                                                                                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard only                  | Every step, the errors and the thank-you step work without a mouse               | Tested by hand                                                                                                                                                                                                                                                               |
| Screen reader                  | Tested with VoiceOver in Safari                                                  | Tested by hand                                                                                                                                                                                                                                                               |
| Lighthouse (mobile, live site) | 100 for Performance, Accessibility, Best Practices and SEO                       | [Scores](testing-screenshots/live-lighthouse-scores.png)                                                                                                                                                                                                                     |
| axe DevTools                   | 0 issues on steps 1, 2 and 3, the thank-you step, and step 2 with errors showing | [Step 1](testing-screenshots/axe-step1.png) · [Step 2](testing-screenshots/axe-step2.png) · [Step 2 with errors](testing-screenshots/axe-step2-with-errors.png) · [Step 3](testing-screenshots/live-axe-step3.png) · [Thank you](testing-screenshots/live-axe-thank-you.png) |

The free version of axe checks the WCAG 2.1 AA rules. The two rules added in 2.2 that apply here (tap size and focus not being hidden) were checked against the design by my reviewer chat: buttons are well over 24px, and nothing sticky covers a focused element.

More screenshots, including phone layouts and error states, are in [`testing-screenshots/`](testing-screenshots/).

## Decisions worth mentioning

- **No third-party scripts.** The payment card security standard, PCI DSS v4 (requirement 6.4.3), says every script on a payment page must be authorized and monitored. With none, there's nothing to track.
- **Card details are never sent or stored.** The card fields have no `name`, so the browser can never include them in a form submission, and they're emptied after payment.
- **Fees are worked out in whole cents**, so rounding is always exact.
- **The shared link drops `?v=b`**, so friends aren't all put into one A/B group.
- **The impact line repeats on the thank-you step**, telling donors what their money does straight after they give.
- **The petition's fields have no `name` either**, so a signer's details can never end up in a page address, browser history or server log.
- **No personal details in links between pages.** Engaging Networks' own documentation says: "We do not recommend including personally identifiable information or sensitive data in a URL" ([source](https://knowledge.engagingnetworks.net/youraccount/pre-populating-form-fields)).
- **The petition copies the donation page's error functions** instead of sharing them, so the tested donation page didn't have to change. In a bigger project they'd be shared in one file.

### In a real Engaging Networks setup

The petition and the donation form would be built as Engaging Networks pages and joined with **"Link to campaign" (chaining)**. Engaging Networks' documentation says chaining keeps "any supporter information which means it can pre-populate any supporter fields on the landing page", and that it's "especially useful when linking to a donation page from an advocacy page" ([source](https://knowledge.engagingnetworks.net/pages/pages-chaining-and-redirecting)). So a signer wouldn't have to type their details again. This demo can't do that on GitHub Pages, so it uses a plain link with UTM tags instead.

## How I built it

I designed the donation page, the emails, the brand board and the logos, and I set the rules before any code was written: the brand, accessibility and "clear over clever" standards in [`CLAUDE.md`](CLAUDE.md). The petition page uses the same design as the donation page.

Claude Code wrote the plans and the code. I reviewed each plan myself and with a separate Claude conversation, then edited, rejected or approved it. Some ideas started with me, like the "Give now" jump link on phones and building out the full thank-you step. Others came from the review, like the hidden "Error:" text that tells screen reader users a message is an error. Either way, the final call was mine.

I tested everything myself with a keyboard, VoiceOver, axe and Lighthouse. The build commits from step 2 onward are co-authored with Claude, and [`NOTES.md`](NOTES.md) records what I asked for and why.

## What I'd do next

- **A real payment provider's hosted card fields**, so card details never touch the page at all.
- **A proper A/B testing tool** instead of `?v=b`, with random assignment and results tracking.

## Files

```
index.html             the donation form
petition.html          the petition page
styles.css             all the styling, with brand colors as CSS variables
script.js              the donation form: steps, validation and the fake payment
petition.js            the petition: validation and the thank-you
assets/                logos, photos and fonts
testing-screenshots/   Lighthouse, axe and layout screenshots
NOTES.md               my working notes
CLAUDE.md              project rules for Claude Code
```

## Credits

- Fonts: [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) and [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/), both under the SIL Open Font License.
- Photo of Biscuit: AI-generated with Google Gemini, so the page doesn't use a real charity's photos or a real animal. Biscuit, like Fernhollow, is fictional.

# CLAUDE.md

Owner: Shade Lourens. I want to understand and be able to explain every line in this project.

## What this is

One donation page for **Fernhollow Animal Alliance**, a fictional animal charity, built as a portfolio piece. It's plain HTML, CSS and a small amount of JavaScript. There's no framework, no build step and no npm.

Fernhollow is fictional. Never use a real organization's name, logo or branding.

## Files

```
index.html     the page
styles.css     all the styling
script.js      steps, validation and the fake payment
assets/        logos, Biscuit photos, fonts
assets/reference/   design and old notes (reference only, never edit)
```

Don't add new files or folders without asking me first.

## Reference files

- `assets/reference/Fernhollow-Donation-Form.html` is the approved design. Match how it looks, but don't copy its code (it's React).
- `assets/reference/donation-form.md` has the copy, fields and error messages. It was written for an older, more complex setup, so **ignore** anything about Webpack, npm, `platform.html`, `template.html`, a mock gateway script, `dataLayer` or analytics.
- `assets/reference/_tokens.scss` lists the colors and which pairs pass contrast. Use it as a cheat sheet only. We use plain CSS variables, not Sass.

## Keep it simple

- Write code a beginner could read. Choose clear over clever.
- If something can't be explained in two sentences, suggest a simpler way first.
- No frameworks, libraries, build tools or third-party scripts.
- No inline styles and no inline event handlers (like `onclick=""`). CSS goes in `styles.css`, and JavaScript goes in `script.js`.
- Use simple class names that say what something is, like `.amount-option` or `.error-message`.
- Put the brand colors and fonts as CSS variables at the top of `styles.css`.

## Comments

Add short, plain-English comments that anyone could understand. Say what a section is for, or why it's done that way. Don't describe every line. For example:

```css
/* Brand colors, so we only have to change them in one place */
```

```js
// Show the "Other amount" box only when that option is picked
```

## Brand rules

- Mostly white backgrounds with navy text. Orange is only for highlights.
- Buttons are amber with **navy** text. Never use white text on orange or amber.
- Orange on white is only for borders, underlines and decoration (selected amount, link underlines, progress bar, logo). Never use it for text.
- The selected amount also gets a check icon, so it doesn't rely on color alone.
- Form control borders use slate, so they have enough contrast.
- Fonts come from `assets/fonts/`, with Nunito Sans for headings and buttons and Atkinson Hyperlegible for body text. Use `font-display: swap`.

## Accessibility basics

- Every field has a visible `<label>`. Related options (frequency, amounts) sit in a `<fieldset>` with a `<legend>`.
- Errors show under the field in words, not just color, and screen readers announce them.
- Everything works with a keyboard, with a clear focus outline.
- Text contrast is at least 4.5:1. The page works on a 320px-wide phone and at 200% zoom.
- Animation respects `prefers-reduced-motion`.

## Fast loading

- Images have a width and height set. Phones get the 480px Biscuit photo (`srcset`).
- Keep CSS and JavaScript small, with no extra downloads.

## Payment (fake)

- No real payment. The card number `4242 4242 4242 4242` succeeds and anything else fails.
- Never send, store or log card details anywhere.
- The page shows a clear "This is a demo" note, and the footer says the organization is fictional.

## A/B test

If the page URL ends in `?v=b`, show the second headline. Otherwise, show the normal one.

## How to work with me

1. Explain your plan in plain words before writing code, and wait for my OK.
2. Work in small steps, one part of the page at a time.
3. After a change, tell me simply what you changed and why.
4. If I ask how something works, explain it line by line, without jargon.
5. Ask before creating, moving or deleting files.
6. Never commit or push. I do that myself.
7. At the end of a session, remind me to add a line to `NOTES.md` about what I asked you to do and what I changed.

## Done means

- It looks like the design on desktop and mobile.
- It works with only a keyboard.
- Chrome's Lighthouse (in DevTools) shows a good mobile score, and the axe DevTools browser extension shows no errors.
- I can explain how it works.

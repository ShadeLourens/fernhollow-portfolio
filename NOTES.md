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

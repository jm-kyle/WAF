# Wild America Fund — Audit TODO

## Critical

- [x] **Focus trap missing in bio modal** — Keyboard focus can escape behind the modal. Must trap focus inside `.bio-modal__card` when open and return focus to the triggering `.member__more` link on close. (`main.js:576-635`, `index.html:819-841`) — WCAG 2.4.3
- [x] **Resource download links use `href="#"`** — The two resource links navigate nowhere. Replace with real download URLs or disable them accessibly with `aria-disabled="true"`. (`index.html:724,752`) — WCAG 2.1.1, 4.1.2

## High

- [x] **Stats lack semantic grouping** — `.stat__number` + `.stat__label` are bare `<span>` elements. Screen readers read them as disjointed fragments. Consider `<dl>`/`<dt>`/`<dd>` or `role="group"` with `aria-label`. (`index.html:166-202`) — WCAG 1.3.1
- [x] **"Learn More" links are indistinguishable** — All three use `href="#"` and identical text. Add `aria-label` per member (e.g., `aria-label="Learn more about Kim Elliman"`). (`index.html:557,613,706`) — WCAG 2.4.4
- [x] **Body background uses hard-coded `#fff`** — Should use `var(--white)` to stay consistent with the token system. (`styles.css:42`)
- [x] **Bio modal close button touch target too small** — ~29x29px; minimum should be 44x44px. Increase padding on `.bio-modal__close`. (`styles.css:942-951`) — WCAG 2.5.8
- [x] **`innerHTML` assignment in bio modal** — `bioBio.innerHTML = bio` is safe now (same-page source) but fragile. Consider cloning nodes instead. (`main.js:583`)

## Medium

- [x] **Hero `will-change: background-position`** — `will-change` is most effective for `transform`/`opacity`. This may waste GPU memory without benefit. (`styles.css:196`)
- [x] **Hero overlay gradient uses hard-coded hex** — `#706e680d`, `#000000` should be expressed via tokens. (`styles.css:203-211`)
- [x] **Bio modal backdrop uses hard-coded rgba** — `rgba(27, 67, 50, 0.6)` is `--dark-green` at 60% but not tokenized. (`styles.css:922`)
- [x] **Map has no JS fallback** — If JS fails, `.map-placeholder` is empty with `role="img"` but no visible content. Add fallback text or a static `<img>`. (`index.html:378-383`) — WCAG 1.1.1
- [x] **`.resources__heading` has fixed `width: 25em`** — May cramp content on narrow tablets (768-905px). Consider `max-width` instead. (`styles.css:1011`)
- [x] **`.contact__right` has fixed `width: 25em`** — Same issue as resources heading. (`styles.css:1121`)
- [x] **Google Fonts loads 3 families, only 2 preloaded** — Plus Jakarta Sans has no preload, risking FOUT. (`index.html:40-42`)
- [x] **Modal inner elements have `aria-hidden="true"`** — Lines 837-839 have `aria-hidden="true"` on child elements that stay hidden even when modal opens. Remove from children; keep only on container. (`index.html:837-839`) — WCAG 4.1.2
- [x] **Root font-size clamp max is 1.5rem** — At 4K (3840px), base font hits 24px, making the site oversized. Cap lower or add a max-width breakpoint. (`styles.css:34`)

## Low

- [x] **GSAP animations hard-code `#f8f6f1`** — Resource row hover animation uses literal hex instead of reading from CSS variables. (`main.js:500`)
- [x] **`will-change` permanently set on `.bio-modal__card`** — Should only apply during animation to avoid constant GPU layer promotion. (`styles.css:939`)
- [ ] **`styles-alt-fonts.css` loaded as separate file** — If the font swap is permanent, merge into `styles.css` to eliminate an HTTP request. (`index.html:45`)
- [ ] **`font-family` redeclared ~30 times** — Most classes repeat the font stack instead of inheriting from parent/section rules. (`styles.css` throughout)
- [x] **Hero section has no `aria-labelledby`** — Minor since heading hierarchy is intact, but adding it would improve landmark navigation. (`index.html:94`) — WCAG 1.3.1

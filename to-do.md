# Wild America Fund — Approved Content Pass

Master copy: `Website edits - clean 070726.docx`

This file tracks the approved client content pass separately from the existing `TODO.md` audit backlog.

## Scope rules

- The Word document is the master copy and supersedes all current website wording.
- Use the approved copy as written. Do not retain, blend in, or write replacement content from outside the document.
- Work down the existing page section by section. Preserve the current section order and overall page structure.
- Update section labels/headings to the new names in the document.
- Do not reorder sections or redesign unrelated sections.
- The only structural/interface changes in this pass are:
  1. combining the two maps into one reveal comparison; and
  2. changing the four-pillar presentation.
- Square-bracketed `if using a teaser` language is an implementation note, not visible website copy.
- Struck copy is deleted copy and must not appear on the final site.
- Preserve the existing contact form, footer, privacy link, legal copy, bio modal behavior, and other functional elements while replacing their surrounding content.
- Primary implementation files: `index.html`, `styles.css`, and `main.js`.

## P0 — Structural changes

### Combined map reveal

- [x] Combine the biodiversity-risk map and WAF priority-regions map into one drag/reveal comparison. The base implementation is already present in the current working tree.
- [x] Refine the reveal component without changing the surrounding section order.
- [x] Use the biodiversity-risk caption and Hamilton et al. attribution for the science side.
- [x] Use the approved priority-regions caption for the WAF side.
- [x] Keep concise interaction instructions near the reveal.
- [x] Verify the comparison works with mouse, touch, and keyboard and remains understandable on mobile.

### Four-pillar presentation

- [x] Change the pillar presentation so all four pillars receive equal visual weight.
- [x] Use the approved teaser copy for the collapsed/summary state and retain the full approved copy in the expanded state.
- [x] Keep the four pillars in the document’s approved order:
  1. `Targeted conservation`
  2. `Deal-ready capital`
  3. `Expert transaction team`
  4. `Effective partnerships`
- [x] Remove all square brackets and `if using a teaser` instructions from visible copy.
- [x] Make the interaction accessible: keyboard operation, visible focus, correct expanded-state announcements, and usable no-JavaScript content.

## P1 — Section-by-section master copy update

### Opening / hero

- [x] Replace the current headline with `Biodiversity is the essence of life.`
- [x] Replace the current support copy with the three approved paragraphs beginning:
  - `But it is disappearing at an alarming rate...`
  - `The Wild America Fund (WAF) was created to catalyze land protection...`
  - `WAF is led by nationally recognized conservation leaders...`
- [x] Rename the primary CTA to `Our Approach` and point it to the four-pillars section.
- [x] Retain `Join Us` as the secondary CTA.

### What’s at Risk

- [x] Update the section label to `WHAT'S AT RISK`.
- [x] Update the section heading to `Biodiversity Challenge`.
- [x] Replace the current introductory/challenge copy with the approved document copy.
- [x] Retain the six approved statistics and dagger footnote exactly as supplied.
- [x] Change the current singular `40% of U.S. forest at risk of collapse` to the approved plural `40% of U.S. forests at risk of collapse`, including the accessibility label.
- [x] Add the approved closing copy beginning `It’s not too late. The science tells us where to act.` and the two paragraphs that follow it.
- [x] Remove current challenge copy that is not present in the master document rather than blending it with the approved copy.

### Where We Work

- [x] Keep this section in its current position and update its label to `WHERE WE WORK`.
- [x] Update the heading to `Protecting Priority Biodiversity`.
- [x] Replace the section copy with the approved paragraphs covering:
  - protection of the most scientifically critical landscapes before they are lost;
  - the one-million-acre goal by 2030;
  - work with nonprofit partners, government agencies, and philanthropy; and
  - development of the priority map with ecologists for maximum biodiversity impact.
- [x] Apply the approved captions to the combined reveal component.
- [x] Remove superseded copy from the former separate map sections.

### Our Approach

- [x] Update the section label to `OUR APPROACH`.
- [x] Retain the heading `The four pillars of our work`.
- [x] Replace the intro with the approved paragraph beginning `Up against private-sector real estate firms and private equity...`.
- [x] Replace every pillar title, teaser, and body with the approved document copy.
- [x] Do not reuse current pillar wording that differs from the master copy.
- [x] Remove the struck `Why It Works / Changing the conservation paradigm` copy and its struck supporting paragraphs wherever that legacy wording remains.

### Getting Started

- [x] Update the section label to `GETTING STARTED`.
- [x] Update the section heading/title to `Gaviota Coast`.
- [x] Replace the existing Gaviota content with the approved copy in the same content order:
  - first region of focus and relationship to the 16 identified regions;
  - `Initial Engagement`;
  - `Gaviota Coast, Santa Barbara`;
  - acquisition of private parcels to augment protected lands;
  - the 76-mile coastline and named species/habitats; and
  - the closing case-study paragraph including `strategic dealmaking`.
- [x] Do not add or retain case-study copy that is outside the approved master document.
- [x] Preserve the current section layout and an accurate Gaviota image/alt description.

### Leadership & Staff

- [x] Update the section label to `Leadership & Staff`.
- [x] Update the heading to `Run by some of the nation's most esteemed conservation leaders`.
- [x] Replace the current two-paragraph team introduction with the approved document copy.
- [x] Replace all three full bios paragraph by paragraph from the master document; do not merge them with the current bios.
- [x] Keep Kim Elliman’s visible role as `Co-founder | Advisor`.
- [x] Keep Michael Mantell’s visible role as `Co-founder | Advisor`.
- [x] Change Michael Bell’s visible role to `Founding CEO` and use the approved bio opening: `Michael is the founding CEO of Wild America Fund.`
- [x] Preserve the existing accessible `Learn More` modal behavior.

### Join Us / About

- [x] Retain the section label `JOIN US`.
- [x] Use the approved headline: `Protecting our nation's last and most biodiverse ecological resources is one of the great causes of our time.`
- [x] Replace the current Join Us body with the approved invitation beginning `Join us to protect one million acres of America’s most precious landscapes...`.
- [x] Add the `About` label and the approved paragraph beginning `Wild America Fund launched on October 1, 2025...`.
- [x] Include the approved mission wording and the 5–10 annual transactions / up to $100 million per year targets exactly as supplied.
- [x] Keep About inline and visually secondary in this pass; do not introduce a popup as a third structural change.
- [x] Preserve the existing contact form and its behavior.

### Navigation and anchors

- [x] Update header/footer labels to match the new section names without changing section order.
- [x] Update the hero, header, footer, and mobile navigation targets so they all point to the surviving section IDs.
- [x] Remove obsolete navigation wording such as `Model`, `Challenge`, `Pillars`, `Proof`, and `Team` where it no longer matches the approved section names.

## P2 — Editorial and implementation QA

- [x] Correct the apparent source typo `Wild American Fund` to `Wild America Fund` in Pillar 03.
- [x] Add the missing terminal period to the approved Pillar 02 body copy.
- [x] Use the document as the authority for names, dates, statistics, acreages, transaction counts, and dollar figures; do not supplement it with outside copy.
- [x] Check punctuation, apostrophes, dash style, and `U.S.`/`US` consistency without substantively rewriting the client’s wording.
- [x] Verify no struck copy, editorial brackets, Word comment text, or superseded website copy appears on the site.
- [x] Confirm the six biodiversity statistics, dagger footnote, Hamilton et al. attribution, dates, acreages, transaction counts, and dollar figures match the master document.
- [x] Review every updated section at mobile, tablet, and desktop widths.
- [x] Run `npm run build` and smoke-test navigation, map reveal, pillar interaction, bio modals, contact form layout, and responsive wrapping.

## Deferred / outside this content pass

- New wildlife photography is deferred until approved assets are supplied.
- No unrelated section redesign, section reordering, or new marketing copy is included.

## Definition of done

- [x] The existing page order is preserved.
- [x] Every section uses its new approved name and master copy.
- [x] No wording from the current site survives where it conflicts with the document.
- [x] Every struck passage is absent.
- [x] The map reveal and four-pillar presentation are the only structural changes.
- [x] The site builds cleanly and passes desktop/mobile visual and interaction review.

## Completion evidence

- Approved master copy applied section by section without reordering.
- Combined map reveal verified with pointer-event support, keyboard arrows, and responsive desktop/mobile layouts.
- Native disclosure-based pillars verified for keyboard access, visible focus treatment, equal collapsed weight, and no-JavaScript readability.
- Header/mobile/footer navigation, bio modal, contact layout, and responsive wrapping smoke-tested in the in-app browser.
- `npm run build` and `git diff --check` pass.

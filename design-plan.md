# Design plan — Central Reklame V3

## Deterministic creative selection
Python randomization used seed `917` (stable seed derived from the project's preserved content inventory).

```text
Hero architecture: Editorial Split
Typography: Satoshi
Component architecture: Asymmetrical image bento; Feedback testimonial carousel; Infinite brand marquee
GSAP paradigms: Magnetic desktop CTA; ScrollTrigger scrubbed image reveal
```

The existing visual identity and section structure are retained; the editorial split is expressed through wide typography, a clean copy block, and a full-width cinematic visual stage rather than replacing the established homepage.

## AIDA
- Navigation: minimal glass navigation with working mobile menu.
- Attention: headline, dual CTA, and three-state cinematic hero slideshow.
- Interest: service presentation and asymmetrical industry-reference imagery.
- Desire: native horizontal portfolio, process sequence, testimonials, and ScrollTrigger image reveals.
- Action: high-contrast WhatsApp CTA, contact information, map, and footer.

## Hero and accessibility
- Wide responsive headline with controlled wrapping at small breakpoints.
- Three genuine image elements with independent slide state, manual controls, dot navigation, swipe, and timed autoplay.
- No decorative stamp icons or spam tags.
- Keyboard-operable controls and `aria-live` slide counter.
- Reduced-motion preference disables timed motion and smooth transitions.

## Gallery interaction model
- Native overflow scrolling and `scroll-snap-type: x mandatory` across breakpoints.
- Mobile touch is not intercepted by custom drag handlers.
- Desktop mouse drag is supported without transform-driven track movement.
- GSAP is limited to non-blocking entrance reveals; no pinned transform hijacks native scroll.

## Content preservation
- 9 service rows and all 17 original portfolio entries remain present.
- Existing filter categories, lightbox, process, testimonials, 4.6/5 rating with 18 reviews, contact, map, and footer are retained.
- SOFITEL and Mercedes-Benz imagery is explicitly identified as industry reference imagery, not Central Reklame client work.

## Verification notes
- `node --check script.js` passes.
- All local image references resolve.
- All WebP assets decode successfully.
- Counts verified: 3 hero slides, 17 gallery items, 9 service rows.
- WhatsApp links resolve to `6285746153991`.
- A headless browser runtime was attempted but blocked by the execution environment; therefore device-level gesture and console checks are not claimed as completed.

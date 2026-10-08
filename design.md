# The Walkthrough AI — Design System

Brochure site. Fresh concept, deliberately different from the current cyan/Syne "command center" site:
this is **quiet-luxury editorial cinema**. A near-white gallery wall that dissolves into a dark
screening room. Type does the talking; imagery is full-bleed and atmospheric.

Derived from the supplied reference (layout, typography rhythm, color temperature, spacing) —
content and copy are entirely ours.

## Concept

"The archive of places." We don't sell software features, we sell presence — a place you can walk
before you arrive. Real estate, resorts & hotels, golf courses.

## Color

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F7F7F9` | Page top, hero backdrop, light sections |
| `--ink` | `#0E1011` | Primary dark surface (dominant color of the page) |
| `--void` | `#060607` | Deepest sections, image bleed, footer |
| `--char` | `#16191A` | Raised cards on ink |
| `--line` | `rgba(255,255,255,0.09)` | Hairlines on dark |
| `--line-dark` | `rgba(14,16,17,0.12)` | Hairlines on paper |
| `--ember` | `#EFA096` | Accent — dusty rose. Micro-labels, active pill, focus ring, underlines |
| `--copper` | `#B4614F` | Accent shadow/hover, gradient partner to ember |
| `--slate` | `#405358` | Cool secondary, chart/stat accents |
| Text on dark | `#F2F2F3` / `rgba(242,242,243,.62)` / `rgba(242,242,243,.38)` | Primary / body / meta |
| Text on paper | `#0E1011` / `rgba(14,16,17,.60)` | Primary / body |

Dominant color is near-black. Accent is used sparingly — never fills a large area.
No purple. No gradient-on-white. No cyan (that's the old site).

## Typography

- **Display:** `Newsreader` (400/500, and 300 italic for pull quotes). High-contrast transitional
  serif. Used at large sizes, tight leading (0.98–1.05), letter-spacing `-0.02em`. Sentence case with
  full stops, stacked over 2–3 short lines, centered in the hero and left-aligned elsewhere.
- **Body:** `Hanken Grotesk` (300/400/500). Line-height 1.7, max-width ~58ch, color at 62% opacity.
- **Micro-labels:** Hanken Grotesk 500, `0.68rem`, `letter-spacing: .22em`, uppercase, ember or 38%
  white. Always numbered: `01 — REAL ESTATE`.
- Never Inter, Space Grotesk, Roboto, or Poppins.

Scale: display `clamp(2.6rem, 7vw, 6.4rem)`; section head `clamp(2rem, 4.4vw, 3.6rem)`;
body `1rem/1.7`; small `0.85rem`.

## Layout

- Container `max-w-[1240px]`, gutters `px-6 md:px-10`.
- **Off-center is the default.** Editorial text blocks sit in a narrow column starting at ~28–34% of
  the width (as in the reference), not centered, with a numbered label in the left margin.
- Full-bleed imagery breaks the container; light sections are inset with generous negative space.
- Section rhythm: `py-28 md:py-40`. Hairline dividers, no card borders with big radii.
- Radii: `2px` on inputs/cards, full pills on buttons only. No 16px rounded-card grid look.

## Signature moves

1. **Paper-to-void hero.** White page → hazy aerial photograph whose top fog blends into the paper →
   image darkens into `--ink` with no visible seam (mask gradient, not a hard edge).
2. **Sector switcher.** One segmented pill (Real Estate / Resorts / Golf) swaps a large frame + copy
   card in place — same pipeline, three horizons.
3. **Hover-reveal before/after.** Cursor position wipes the AI result off to show the original
   capture underneath. Touch falls back to a drag handle.
4. **Feature marquee.** Single-line infinite scroller of capability chips, low contrast.
5. **Estimator.** Property type + square-footage slider + feature toggles compute a live number at
   $250 per 2,500 sq ft; the result is carried into the brief form as a summary line.

## Motion

One orchestrated page load: staggered fade-and-rise (`opacity 0→1`, `translateY 18px→0`, 90ms
stagger, `cubic-bezier(.16,1,.3,1)`), then scroll-triggered reveals per section using `Motion`'s
`whileInView` (once: true). Hero image has a slow 12s scale drift. Respect
`prefers-reduced-motion` — reveals become instant.

## Components

- **Pill button:** 1px border, transparent fill, `px-6 py-3`, `0.8rem` label with `.08em` tracking;
  on hover the border goes ember and a soft `--copper` glow appears beneath.
- **Solid button:** paper fill, ink text (used once, in the final CTA).
- **Input:** bottom-hairline only, transparent background, uppercase micro-label, ember focus line.
- **Stat:** display serif number + micro-label caption.
- **Frame:** image with 1px `--line` inset, `2px` radius, subtle vignette.

## Voice

Short declaratives. No exclamation marks, no "revolutionize", no "unleash". Numbers stated plainly
with a source-y caption. Sector nouns: listing, suite, fairway.

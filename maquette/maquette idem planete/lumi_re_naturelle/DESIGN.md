---
name: Lumière Naturelle
colors:
  surface: '#FFFFFF'
  surface-dim: '#d8dbd8'
  surface-bright: '#f8faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f1'
  surface-container: '#eceeeb'
  surface-container-high: '#e7e9e6'
  surface-container-highest: '#e1e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#40493d'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#eff1ee'
  outline: '#707a6c'
  outline-variant: '#bfcaba'
  surface-tint: '#1b6d24'
  primary: '#0d631b'
  on-primary: '#ffffff'
  primary-container: '#2e7d32'
  on-primary-container: '#cbffc2'
  inverse-primary: '#88d982'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#2e6033'
  on-tertiary: '#ffffff'
  tertiary-container: '#477949'
  on-tertiary-container: '#caffc6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f69c'
  primary-fixed-dim: '#88d982'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005312'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#b8f1b6'
  tertiary-fixed-dim: '#9dd49b'
  on-tertiary-fixed: '#002106'
  on-tertiary-fixed-variant: '#1f5125'
  background: '#f8faf7'
  on-background: '#191c1b'
  surface-variant: '#e1e3e0'
  text-primary: '#1A1A1A'
  text-secondary: '#6B7280'
  status-pending: '#F59E0B'
  status-validated: '#2E7D32'
  status-refused: '#DC2626'
typography:
  display-lg:
    fontFamily: manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter-mobile: 16px
  margin-mobile: 16px
  gutter-desktop: 24px
  margin-desktop: auto
  max-width-desktop: 1200px
---

## Brand & Style

The design system is crafted for a nature-focused association management platform, balancing environmental stewardship with professional administration. The brand personality is **dependable, revitalizing, and transparent**, evoking the feeling of a well-organized community effort dedicated to the planet.

The chosen design style is **Corporate / Modern with an Airy, Organic twist**. It utilizes heavy whitespace to provide a sense of calm and focus, while subtle nature-inspired accents ensure the UI feels grounded in its mission. The aesthetic avoids the clutter of traditional management tools, favoring a clean, high-performance interface that feels as fresh as the environments the association seeks to protect. 

Visual hierarchy is established through clear typographic scale and soft, tactile depth, ensuring that both members and administrators can navigate complex logistical data—like membership status and fee tracking—with ease.

## Colors

The palette is rooted in **Nature Green (#2E7D32)**, representing growth and vitality. This is paired with a **Dark Primary (#1B4D22)** for deep contrast in text or high-importance UI elements. **Warm Gold (#D4AF37)** serves as the secondary accent, reserved for specialized highlights, premium indicators, or "call to action" moments that require a touch of prestige.

The background uses a soft **Off-white (#F7F9F6)** to reduce screen glare and create a sophisticated, paper-like feel. Surfaces are pure white to distinguish functional containers from the backdrop. 

Semantic colors follow a strict logic for status management:
- **Pending:** Amber gold for caution and ongoing processing.
- **Validated:** Primary green for success and activity.
- **Refused:** High-visibility red for errors or rejections.

## Typography

This design system uses a dual-sans-serif approach to balance character with utility. **Manrope** is used for headlines, providing a modern, refined geometric structure that feels authoritative yet approachable. **Inter** is utilized for body text and labels, ensuring maximum legibility across dense data sets, such as contribution tables and member lists.

Headlines should use tight letter-spacing to maintain a "bold" editorial look. Body text leverages generous line heights to ensure long-form content, like association news and activity descriptions, remains highly readable on mobile devices.

## Layout & Spacing

The layout follows a **Fluid-to-Fixed grid model**. On mobile devices, a 4-column fluid grid is used with 16px margins to maximize screen real estate. On desktop, the layout shifts to a 12-column grid with a maximum container width of 1200px to ensure administrative dashboards remain legible and do not stretch excessively.

A base unit of **4px** governs the rhythm. All padding, margins, and component heights should be multiples of this unit (e.g., 8px, 16px, 24px, 32px). This "8pt-grid" derivative ensures a consistent vertical rhythm and visual harmony across the entire application.

## Elevation & Depth

The design system uses **Tonal Layers** combined with **Ambient Shadows** to communicate hierarchy.

1.  **Level 0 (Base):** The off-white background (#F7F9F6).
2.  **Level 1 (Surface):** Cards and main content containers use pure white (#FFFFFF). They are elevated by a very soft, diffused shadow (0px 4px 20px, 4% opacity of text-primary) and a 1px low-contrast outline in a light grey.
3.  **Level 2 (Interaction):** Hover states or active modals use a slightly more pronounced shadow (0px 8px 30px, 8% opacity) to suggest they are floating above the workspace.

This subtle approach avoids the "heavy" feeling of traditional box-shadows, maintaining the "airy" and professional aesthetic required for a modern association app.

## Shapes

The shape language is **Rounded**, reflecting the organic and friendly nature of IDEM Planète. 

- **Standard Elements:** Buttons, input fields, and small cards use a **0.5rem (8px)** corner radius.
- **Large Containers:** Dashboard widgets and main activity cards use **1rem (16px)**.
- **Visual Accents:** Image thumbnails and profile pictures should follow the same rounded logic unless they are specifically designated as circular (e.g., profile avatars in the navigation bar).

## Components

### Buttons
- **Primary:** Solid Nature Green (#2E7D32) with white text. 8px rounded corners.
- **Secondary:** Outline Nature Green with 1.5px border.
- **Tertiary/Ghost:** No border, Nature Green text, used for low-priority actions like "Cancel".

### Input Fields
- Use a white surface with a 1px border (#E5E7EB).
- Labels should use `label-md` in `text-secondary`.
- Active states should use a 2px Nature Green border.

### Chips & Status Badges
- Small, rounded pills.
- Use a 10% opacity background of the status color with 100% opacity text for high legibility (e.g., Validated chip has a light green background and dark green text).

### Cards
- White background, 16px rounded corners, soft ambient shadow.
- Inner padding should be 24px for desktop and 16px for mobile.
- Use outline icons (24px) for consistency across the dashboard.

### Lists
- Use "divided" lists with a 1px horizontal separator (#F1F5F9).
- Each item should have a generous 16px vertical padding to maintain the "airy" feel.

### Progress Indicators
- For "Mes participations" and fee tracking, use thin 4px linear progress bars in Nature Green to show completion or validation stages.
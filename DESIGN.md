---
name: Dracox
description: A clear, responsive strength-training reference sheet.
colors:
  deep-pine: "#244b49"
  pine-hover: "#193d3c"
  measure-teal: "#3f685d"
  teal-wash: "#d8e7df"
  rust-mark: "#9e4f39"
  rust-wash: "#f0e0d8"
  mineral-ground: "#dfe9e4"
  clean-surface: "#f5f8f4"
  raised-paper: "#ffffff"
  muted-surface: "#eaf1ec"
  forest-ink: "#223a36"
  soft-ink: "#4a6059"
  muted-ink: "#52675f"
  rule-line: "#c3d0ca"
  strong-rule: "#99aaa3"
  error-red: "#873e38"
  completed-green: "#2e624a"
  completed-tint: "#e4eee7"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(30px, 3.1vw, 40px)"
    fontWeight: 680
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(20px, 2vw, 25px)"
    fontWeight: 680
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 680
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.2
  navigation:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 560
    lineHeight: 1.2
rounded:
  field: "4px"
  compact: "5px"
  control: "6px"
  card: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.deep-pine}"
    textColor: "{colors.raised-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.pine-hover}"
  button-secondary:
    backgroundColor: "{colors.teal-wash}"
    textColor: "{colors.deep-pine}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.forest-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
    height: "44px"
  nav-primary:
    backgroundColor: "{colors.deep-pine}"
    textColor: "{colors.teal-wash}"
    typography: "{typography.navigation}"
  input-search:
    backgroundColor: "{colors.raised-paper}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.field}"
    padding: "9px 11px"
    height: "44px"
  chip-active:
    backgroundColor: "{colors.deep-pine}"
    textColor: "{colors.raised-paper}"
    rounded: "{rounded.field}"
    padding: "7px 12px"
    height: "36px"
  routine-card:
    backgroundColor: "{colors.raised-paper}"
    rounded: "{rounded.card}"
  movement-row:
    typography: "{typography.body}"
    height: "68px"
  completed-set:
    backgroundColor: "{colors.completed-tint}"
    height: "53px"
---

# Design System: Dracox

## Overview

**Creative North Star: "Atlas de movimiento"**

Dracox reads like a contemporary strength-training reference sheet: cool mineral paper, deep green ink, quiet teal measures, restrained rust markers, and rules that keep each entry legible. The voice is practical and calm, with a compact system typeface that stays clear during a workout.

Training information leads the composition. Numbered movement rows, tabular figures, and thin dividers make planned work and completed work easy to scan; a completed set changes in its own row so its status stays beside its measurements. The visual world avoids anatomical illustration and decorative grid patterns.

**Key Characteristics:**
- Cool mineral surfaces with deep green text and actions.
- Numbered movement entries and aligned, tabular training figures.
- Flat, rule-led structure with teal measures and restrained rust state cues.
- Responsive navigation that keeps the training routes reachable on small screens.

## Colors

The palette uses mineral neutrals for reading space, green ink for hierarchy and action, teal for measured progress, and rust for meaningful state cues.

### Primary
- **Deep Pine** (`deep-pine`): The main navigation field, primary actions, active filters, and selected controls.
- **Pine Shade** (`pine-hover`): The hover state for primary actions.

### Secondary
- **Measure Teal** (`measure-teal`): Progress bars and volume marks; it signals a quantity rather than an alert.
- **Teal Wash** (`teal-wash`): Quiet selected states and secondary actions.

### Tertiary
- **Rust Marker** (`rust-mark`): Numbering, current-day emphasis, and visible keyboard focus.
- **Rust Wash** (`rust-wash`): A soft state surface where the rust cue needs context.

### Neutral
- **Mineral Ground** (`mineral-ground`): The page canvas.
- **Clean Surface** (`clean-surface`): Status and secondary information surfaces.
- **Raised Paper** (`raised-paper`): Inputs and white card surfaces.
- **Muted Surface** (`muted-surface`): Quiet panels and supporting groups.
- **Forest Ink** (`forest-ink`): Headings and primary reading text.
- **Soft Ink** (`soft-ink`): Supporting descriptions and metadata.
- **Muted Ink** (`muted-ink`): Dates, labels, and lower-emphasis values.
- **Rule Line** (`rule-line`): Row and card boundaries.
- **Strong Rule** (`strong-rule`): Section boundaries and table structure.

### Semantic states
- **Error Red** (`error-red`): Error status and destructive feedback.
- **Completed Green** (`completed-green`): A set or action that has been completed.
- **Completed Tint** (`completed-tint`): The quiet row surface that keeps completed measurements visible.

**The Measured Accent Rule.** Teal carries quantities; rust marks a meaningful state. Keep both subordinate to the training data.

## Typography

**Display Font:** system-ui (with the platform sans-serif stack)
**Body Font:** system-ui (with the platform sans-serif stack)
**Label/Mono Font:** System sans-serif for labels; monospace is reserved for dense administrator log payloads.

**Character:** The system typeface is neutral, compact, and immediately legible. Headings use a firm weight and close tracking; labels stay quieter, while numeric training values use tabular figures in the interface.

### Hierarchy
- **Display** (weight 680, responsive 30–40px, line-height 1.2): Page headings.
- **Headline** (weight 680, responsive 20–25px, line-height 1.2): Main panel headings.
- **Title** (weight 680, 18px, line-height 1.2): Smaller section headings.
- **Body** (weight 400, 15px, line-height 1.5): Reading text; the base size tightens slightly on narrow phones.
- **Label** (weight 650, 14px, line-height 1.2): Primary action labels; smaller metadata labels remain compact and muted.

**The Figures Stay Tabular Rule.** Use tabular numerals for sets, reps, weights, dates, duration, and volume so changing values stay aligned.

## Layout

The desktop shell has a full-width top bar and a centered page region capped at 1,370px. The content inset steps from 48px on wide screens to 30px below 1,050px, then 24px below 850px; the smallest layout uses a 17px inset. The dashboard gives the next session the wider share of a two-column workspace, with the weekly muscle summary beside it. At 850px and below, the workspace stacks with the session first.

The top bar is 78px tall on desktop and compacts at tablet and phone widths. At 850px and below, the primary routes move to a fixed bottom bar with four equal destinations, or five when Admin is present; the page content reserves space for it and the device safe area. The principal breakpoints are 1,050px, 850px, and 600px. Repeated spacing uses a compact 4–32px rhythm, with wider page insets reserved for the outer frame.

Training summaries and logs favor aligned rows, section rules, and open horizontal space over a dense wall of cards. Keep the movement order, measurement columns, and supporting context readable when a layout collapses.

## Elevation & Depth

The interface is flat by default. Depth comes from tonal surfaces, a clear line hierarchy, and restrained top rules; the modal is the one lifted surface, with a broad shadow to separate it from the page. Keyboard focus uses a visible rust outline, and reduced-motion settings shorten transitions and disable smooth scrolling.

### Shadow Vocabulary
- **Modal separation** (`0 16px 38px rgba(12, 32, 28, 0.22)`): Keep this shadow for modal surfaces that sit above the application.

**The Flat-by-Default Rule.** Use tonal contrast and rules for ordinary content; reserve the broad shadow for the modal layer.

## Shapes

Forms stay compact and controlled: small radii on fields and filters, slightly softer corners on controls, and the largest radius on cards and modal surfaces. Thin square-edged rules organize lists and tables. Avoid pill-shaped containers except for the small circular profile avatar and status dots.

## Components

Components feel direct and quiet. They use clear text labels, visible boundaries, and familiar state changes rather than decorative effects.

### Buttons
- **Shape:** Use the control radius from the token scale.
- **Primary:** Deep Pine fill with light text; the frontmatter records its 44px minimum height and 10px-by-17px padding.
- **Hover / Focus:** Primary actions darken on hover; keyboard focus receives the shared 3px rust outline with a 3px offset.
- **Secondary:** Teal Wash fill with Deep Pine text and a rule that strengthens on hover.
- **Outline:** Transparent fill with a strong neutral boundary; hover adds a muted surface.
- **Disabled:** Lower the contrast and retain the control's shape so its unavailable state remains clear.

### Chips
- **Style:** Muscle filters are compact outlined controls; the active filter uses Deep Pine with light text.
- **State:** Keep inactive filters quiet and allow the filter row to scroll horizontally when needed.

### Cards / Containers
- **Corner Style:** Routine and modal surfaces use the card radius from the token scale; ordinary logged exercise sections stay open and rule-divided.
- **Background:** Raised Paper identifies contained content; Muted Surface groups supporting summaries.
- **Shadow Strategy:** Use the flat treatment by default and the modal shadow only for an overlay.
- **Border:** Routine cards use a thin boundary plus a colored top rule; training rows use separators.
- **Internal Padding:** Routine cards use 20px horizontal insets; the exact pattern is captured in the frontmatter and sidecar.

### Inputs / Fields
- **Style:** Raised Paper with a strong thin boundary, compact field radius, and a clear label above.
- **Focus:** Strengthen the deep-green border and add a visible green-tinted outline; number fields use a compact focus halo.
- **Error / Disabled:** Keep error feedback in the semantic error red; preserve readable labels and units.

### Navigation
- **Desktop:** Deep Pine top bar, compact route labels, inline icons, and a short rust rule under the active route. Sync state and profile remain on the right.
- **Mobile:** Fixed surface-colored bottom bar with evenly divided routes, centered icon and label, and a Teal Wash active destination. Include Admin only when the user has that route.

### Numbered Movement and Set Rows
Movement entries start with a rust position number, then the movement name and muscle/equipment context, with the target aligned at the opposite edge. In the workout log, set number, editable measurements, and completion action remain in one row; completing a set shades that row and changes its action to Completed Green. The user can still correct that row in place.

**The Set-in-Place Rule.** A completed set keeps its measurements and correction action in the same row; status must not displace the training data.

## Do's and Don'ts

### Do:
- **Do** keep movement names, muscle context, and targets together in numbered rows.
- **Do** align training quantities with tabular numerals and use rules to clarify their columns.
- **Do** keep primary actions and route state in the deep-green family, reserving teal for measures and rust for state cues.
- **Do** preserve the order of training content when the layout stacks on mobile.

### Don't:
- **Don't** add anatomical illustrations or decorative grid patterns.
- **Don't** turn the workout into a row of competing metric cards; keep the next session and its data easy to scan.
- **Don't** use teal and rust as interchangeable accents or add unsupported performance claims.

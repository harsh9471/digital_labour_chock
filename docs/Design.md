# Design.md — Digital Labour Chowk

> **Product Design System & UI/UX Reference**
> Version 1.0 | For Product Designers, Frontend Engineers, and AI Coding Agents
> Platform: Labour Marketplace & Workforce Management System

---

## Table of Contents

1. [Design Vision](#1-design-vision)
2. [Design System](#2-design-system)
3. [UI Component Standards](#3-ui-component-standards)
4. [Dashboard Design](#4-dashboard-design)
5. [Mobile App Design](#5-mobile-app-design)
6. [UX Workflows](#6-ux-workflows)
7. [Accessibility Standards](#7-accessibility-standards)
8. [Responsive Design Rules](#8-responsive-design-rules)
9. [Page Design Specifications](#9-page-design-specifications)
10. [Animation Guidelines](#10-animation-guidelines)
11. [Design Tokens](#11-design-tokens)
12. [Design-to-Code Standards](#12-design-to-code-standards)
13. [Recommended UI Libraries](#13-recommended-ui-libraries)

---

## 1. Design Vision

### Product Experience Goals

Digital Labour Chowk serves users with dramatically different contexts — a mason checking attendance on a ₹6,000 Android phone at a dusty construction site, and an enterprise HR manager reviewing compliance reports on a 27" monitor in an air-conditioned office. The design must work for both without compromise.

**Five non-negotiable experience goals:**

| Goal | Definition | How we measure it |
|---|---|---|
| **Instant clarity** | Every screen communicates its purpose in under 3 seconds | First-click accuracy in usability tests ≥ 85% |
| **Touch-first trust** | Workers trust the app handles their livelihood data safely | Post-onboarding trust survey score ≥ 4.2/5 |
| **Zero training required** | Core worker flows (check-in, job apply) need no manual | Task completion without help ≥ 90% |
| **Speed on low-end hardware** | Usable on ₹6,000 Android devices, 2G connectivity | Lighthouse mobile score ≥ 70; TTI ≤ 4s on 3G |
| **Language inclusivity** | Platform feels native in Hindi, not just translated | Hindi NPS ≥ English NPS |

### UX Philosophy

```
Principle 1: Dignity First
  Blue-collar workers are not a "low-tech" audience — they are mobile-native.
  Design for sophistication, not simplicity. Treat every screen as if a
  first-generation smartphone user will use it to manage their livelihood.

Principle 2: Progressive Disclosure
  Show only what is needed for the current task.
  Contractors see attendance summary → drill to individual worker → drill to day.
  Never overwhelm with data that requires a management degree to interpret.

Principle 3: Error Prevention over Error Recovery
  Confirm destructive actions. Disable submit before validation.
  Show inline validation before form submission.
  Never lose user data silently.

Principle 4: Offline Resilience
  The app works without internet. Offline state is communicated clearly.
  Syncing is background, silent, and conflict-resolved without user burden.

Principle 5: Localisation as a Feature, not an Afterthought
  Date formats, currency, number systems (Hindi numerals optional),
  right-to-left readiness, and culturally appropriate iconography.
```

### Accessibility Goals

- **WCAG 2.1 Level AA** compliance on all web surfaces
- **Minimum 4.5:1** contrast ratio for normal text; **3:1** for large text and UI components
- **Full keyboard navigation** on contractor dashboard and admin panel
- **Screen reader tested** (NVDA + Chrome on Windows; VoiceOver on iOS)
- **Touch targets** minimum **44×44px** on all interactive elements (mobile)
- **Focus visible** at all times — custom focus ring in brand colour
- **Reduced motion** media query respected — no mandatory animations

### Mobile-First Approach

```
Design order:  Mobile (320px) → Tablet (768px) → Desktop (1280px+)
Build order:   Mobile breakpoint → progressive enhancement upward
Test order:    Real device (Moto G4 equivalent) → then desktop

Mobile constraints that drive design decisions:
  - Thumb reach zone: primary actions in bottom 40% of screen
  - One-handed use: critical CTAs reachable with right thumb
  - No hover states: all interactions are tap/press, not hover
  - Reduced cognitive load: max 1 primary action per screen
  - Network: design for 2G (< 50 KB first load, progressive image loading)
  - Battery: minimize background GPS drain (geo-fence trigger over polling)
```

---

## 2. Design System

### 2.1 Colour Palette

```
Brand Philosophy:
  Primary — Saffron-adjacent orange: energy, work, aspiration (Indian cultural resonance)
  Secondary — Deep teal: trust, stability, professionalism
  Neutral — Warm grey: not cold/corporate, approachable
  Semantic — Standard red/green/yellow, high contrast variants for accessibility
```

#### Colour Tokens

```css
/* ── Brand Colours ────────────────────────────────────────────────── */
--color-brand-50:   #FFF7ED;   /* lightest tint */
--color-brand-100:  #FFEDD5;
--color-brand-200:  #FED7AA;
--color-brand-300:  #FDBA74;
--color-brand-400:  #FB923C;
--color-brand-500:  #F97316;   /* Primary brand — main CTAs */
--color-brand-600:  #EA580C;   /* Hover state */
--color-brand-700:  #C2410C;   /* Active / pressed state */
--color-brand-800:  #9A3412;
--color-brand-900:  #7C2D12;   /* darkest shade */
--color-brand-950:  #431407;

/* ── Teal / Trust Colours ─────────────────────────────────────────── */
--color-teal-50:    #F0FDFA;
--color-teal-100:   #CCFBF1;
--color-teal-200:   #99F6E4;
--color-teal-300:   #5EEAD4;
--color-teal-400:   #2DD4BF;
--color-teal-500:   #14B8A6;   /* Secondary brand */
--color-teal-600:   #0D9488;   /* Hover */
--color-teal-700:   #0F766E;   /* Active */
--color-teal-800:   #115E59;
--color-teal-900:   #134E4A;

/* ── Neutral / Warm Grey ──────────────────────────────────────────── */
--color-neutral-0:   #FFFFFF;
--color-neutral-50:  #FAFAF9;  /* Page background */
--color-neutral-100: #F5F5F4;  /* Card background */
--color-neutral-200: #E7E5E4;  /* Borders, dividers */
--color-neutral-300: #D6D3D1;  /* Disabled borders */
--color-neutral-400: #A8A29E;  /* Placeholder text */
--color-neutral-500: #78716C;  /* Secondary text */
--color-neutral-600: #57534E;  /* Body text (secondary) */
--color-neutral-700: #44403C;  /* Body text (primary) */
--color-neutral-800: #292524;  /* Headings */
--color-neutral-900: #1C1917;  /* High-emphasis text */
--color-neutral-950: #0C0A09;  /* Near-black */

/* ── Semantic Colours ─────────────────────────────────────────────── */
/* Success */
--color-success-50:  #F0FDF4;
--color-success-100: #DCFCE7;
--color-success-500: #22C55E;
--color-success-600: #16A34A;   /* Text on light bg */
--color-success-700: #15803D;   /* Dark variant */

/* Warning */
--color-warning-50:  #FFFBEB;
--color-warning-100: #FEF3C7;
--color-warning-500: #F59E0B;
--color-warning-600: #D97706;
--color-warning-700: #B45309;

/* Error */
--color-error-50:   #FFF1F2;
--color-error-100:  #FFE4E6;
--color-error-500:  #EF4444;
--color-error-600:  #DC2626;
--color-error-700:  #B91C1C;

/* Info */
--color-info-50:    #EFF6FF;
--color-info-100:   #DBEAFE;
--color-info-500:   #3B82F6;
--color-info-600:   #2563EB;
--color-info-700:   #1D4ED8;

/* ── Surface Colours (Dark Mode Ready) ───────────────────────────── */
--color-surface-primary:    var(--color-neutral-0);
--color-surface-secondary:  var(--color-neutral-50);
--color-surface-tertiary:   var(--color-neutral-100);
--color-surface-elevated:   var(--color-neutral-0);   /* Cards, modals */
--color-surface-overlay:    rgba(0, 0, 0, 0.40);      /* Modal backdrop */
```

#### Colour Usage Rules

```
✅ Use brand-500 for:   Primary CTAs, active nav items, progress bars, links
✅ Use teal-500 for:    Secondary CTAs, badges, highlights
✅ Use neutral-700 for: Body text (primary)
✅ Use neutral-500 for: Secondary text, labels, captions
✅ Use neutral-200 for: Borders, dividers, input borders (default state)
✅ Use neutral-100 for: Card backgrounds, table row alternates
✅ Use neutral-50 for:  Page backgrounds

❌ Never use brand-500 text on white background (fails 4.5:1 ratio)
✅ Use brand-700 for text when brand colour is needed on white
❌ Never use more than 2 brand colours in one component
❌ Never use colour alone to convey meaning (always pair with icon or text)
```

### 2.2 Typography

```css
/* ── Type Scale ──────────────────────────────────────────────────── */
/* Primary: Inter — clean, highly legible, strong Devanagari support */
/* Secondary / Display: Satoshi — modern, personality for headings   */
/* Mono: JetBrains Mono — code, IDs, numbers in tables              */

--font-sans:    'Inter', 'Noto Sans', system-ui, sans-serif;
--font-display: 'Satoshi', 'Inter', sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;
--font-devanagari: 'Noto Sans Devanagari', 'Mangal', sans-serif;

/* ── Font Sizes (rem based, 16px root) ───────────────────────────── */
--text-xs:   0.75rem;    /*  12px — captions, labels, badges */
--text-sm:   0.875rem;   /*  14px — secondary text, form helpers */
--text-base: 1rem;       /*  16px — body text, form inputs */
--text-lg:   1.125rem;   /*  18px — lead text, card titles */
--text-xl:   1.25rem;    /*  20px — section headings */
--text-2xl:  1.5rem;     /*  24px — page headings */
--text-3xl:  1.875rem;   /*  30px — dashboard stat numbers */
--text-4xl:  2.25rem;    /*  36px — hero headings */
--text-5xl:  3rem;       /*  48px — landing page hero */
--text-6xl:  3.75rem;    /*  60px — marketing splash */

/* ── Font Weights ────────────────────────────────────────────────── */
--font-normal:   400;   /* body text */
--font-medium:   500;   /* labels, nav items */
--font-semibold: 600;   /* card titles, table headers */
--font-bold:     700;   /* page titles, CTAs */
--font-extrabold:800;   /* stat numbers, hero */

/* ── Line Heights ────────────────────────────────────────────────── */
--leading-none:    1;
--leading-tight:   1.25;  /* headings */
--leading-snug:    1.375; /* subheadings */
--leading-normal:  1.5;   /* body text */
--leading-relaxed: 1.625; /* long-form content */
--leading-loose:   2;     /* spaced lists */

/* ── Letter Spacing ──────────────────────────────────────────────── */
--tracking-tight:  -0.025em;  /* large display headings */
--tracking-normal:  0em;
--tracking-wide:    0.025em;  /* all-caps labels */
--tracking-wider:   0.05em;   /* badges, chips */
--tracking-widest:  0.1em;    /* category labels */
```

#### Typography Hierarchy

```
Display / Hero      : Satoshi, 48–60px, Bold/ExtraBold, tracking-tight
Page Title (H1)     : Satoshi, 30–36px, Bold, tracking-tight, neutral-900
Section Title (H2)  : Inter, 24px, Semibold, neutral-800
Card Title (H3)     : Inter, 20px, Semibold, neutral-800
Subsection (H4)     : Inter, 18px, Semibold, neutral-700
Label / Caption     : Inter, 12–14px, Medium, neutral-500, tracking-wide
Body Text           : Inter, 16px, Normal, neutral-700, leading-normal
Small / Helper      : Inter, 14px, Normal, neutral-500
Monospace (IDs)     : JetBrains Mono, 14px, Normal, neutral-600
Stat Number         : Inter, 30–36px, Bold/ExtraBold, neutral-900
Hindi Body          : Noto Sans Devanagari, 16px, Normal, neutral-700
```

### 2.3 Spacing System

```css
/* 4px base unit — all spacing is multiples of 4px */
--space-0:   0px;
--space-px:  1px;
--space-0.5: 2px;
--space-1:   4px;
--space-1.5: 6px;
--space-2:   8px;
--space-2.5: 10px;
--space-3:   12px;
--space-3.5: 14px;
--space-4:   16px;   /* ← base unit */
--space-5:   20px;
--space-6:   24px;
--space-7:   28px;
--space-8:   32px;
--space-9:   36px;
--space-10:  40px;
--space-11:  44px;   /* minimum touch target */
--space-12:  48px;
--space-14:  56px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
--space-32:  128px;
--space-40:  160px;
--space-48:  192px;
--space-64:  256px;

/* Semantic spacing aliases */
--space-xs:   var(--space-1);    /*  4px — icon gaps */
--space-sm:   var(--space-2);    /*  8px — tight spacing */
--space-md:   var(--space-4);    /* 16px — standard spacing */
--space-lg:   var(--space-6);    /* 24px — section gaps */
--space-xl:   var(--space-8);    /* 32px — large sections */
--space-2xl:  var(--space-12);   /* 48px — page sections */
--space-3xl:  var(--space-16);   /* 64px — hero sections */
```

### 2.4 Shadows

```css
--shadow-xs:   0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm:   0 1px 3px 0 rgba(0, 0, 0, 0.10),
               0 1px 2px -1px rgba(0, 0, 0, 0.10);
--shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.10),
               0 2px 4px -2px rgba(0, 0, 0, 0.10);
--shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.10),
               0 4px 6px -4px rgba(0, 0, 0, 0.10);
--shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.10),
               0 8px 10px -6px rgba(0, 0, 0, 0.10);
--shadow-2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);

/* Branded shadows for elevated CTAs */
--shadow-brand: 0 4px 14px 0 rgba(249, 115, 22, 0.30);
--shadow-brand-lg: 0 8px 25px 0 rgba(249, 115, 22, 0.35);

/* Coloured shadows for semantic elements */
--shadow-success: 0 4px 14px 0 rgba(34, 197, 94, 0.25);
--shadow-error:   0 4px 14px 0 rgba(239, 68, 68, 0.25);
```

### 2.5 Border Radius

```css
--radius-none:  0px;
--radius-sm:    4px;    /* inputs, small chips */
--radius-md:    8px;    /* buttons, cards (small) */
--radius-lg:    12px;   /* cards (standard) */
--radius-xl:    16px;   /* cards (large), modals */
--radius-2xl:   20px;   /* feature cards */
--radius-3xl:   24px;   /* drawers, bottom sheets */
--radius-full:  9999px; /* pills, badges, avatars */

/* Component-specific */
--radius-button:  var(--radius-md);    /* 8px */
--radius-input:   var(--radius-md);    /* 8px */
--radius-card:    var(--radius-lg);    /* 12px */
--radius-modal:   var(--radius-xl);    /* 16px */
--radius-badge:   var(--radius-full);  /* pill */
--radius-avatar:  var(--radius-full);  /* circle */
--radius-tooltip: var(--radius-sm);    /* 4px */
```

### 2.6 Grid System

```
Web Grids:

  Desktop (≥ 1280px):  12-column grid, 32px gutter, 80px side margins
  Laptop (1024–1279px): 12-column grid, 24px gutter, 48px side margins
  Tablet (768–1023px):   8-column grid, 20px gutter, 32px side margins
  Mobile (< 768px):      4-column grid, 16px gutter, 16px side margins

Dashboard Layouts:

  ┌─────────────────────────────────────────────────────────────┐
  │  Sidebar (240px fixed)  │  Main Content Area               │
  │                          │  max-width: 1200px               │
  │  ─────────────────────  │  ──────────────────────────────  │
  │  Logo (64px height)      │  Page Header (breadcrumb + CTA) │
  │  ─────────────────────  │  ──────────────────────────────  │
  │  Nav items               │  Stat Cards Row (4-col)         │
  │  (48px height each)      │  ──────────────────────────────  │
  │                          │  Main Table / Chart Area         │
  │  ─────────────────────  │                                  │
  │  User profile (bottom)   │                                  │
  └─────────────────────────────────────────────────────────────┘

Mobile App Grid:
  Single column, 16px horizontal padding
  Cards: full width with 16px horizontal margin
  Bottom navigation: fixed, 64px height
```

### 2.7 Iconography

```
Icon Library:  Heroicons v2 (MIT license, consistent stroke weight)
Icon Sizes:
  --icon-xs:  12px   (badges, table row indicators)
  --icon-sm:  16px   (inline text icons, breadcrumbs)
  --icon-md:  20px   (button icons, form field icons — DEFAULT)
  --icon-lg:  24px   (nav items, card actions)
  --icon-xl:  32px   (empty states, feature headers)
  --icon-2xl: 48px   (illustration-style icons, onboarding)

Style rule: Always use outline variant for 16–24px; solid for 12px or status indicators.
Accessibility: All icons that convey meaning must have aria-label or aria-hidden + adjacent text.
```

---

## 3. UI Component Standards

### 3.1 Buttons

```
Button Variants:

  Primary     — brand-500 fill, white text, shadow-brand on hover
  Secondary   — white fill, neutral-200 border, neutral-700 text
  Destructive — error-600 fill, white text (only for delete/suspend actions)
  Ghost       — transparent fill, brand-500 text, brand-50 hover bg
  Link        — no background, brand-600 text, underline on hover
  Icon        — square/circle, icon only (always has aria-label)

Button Sizes:

  xs   : h-7  (28px), px-2.5, text-xs,   radius-md  — table row actions
  sm   : h-8  (32px), px-3,   text-sm,   radius-md  — compact UIs
  md   : h-10 (40px), px-4,   text-sm,   radius-md  — DEFAULT
  lg   : h-11 (44px), px-5,   text-base, radius-md  — primary page CTAs
  xl   : h-12 (48px), px-6,   text-base, radius-md  — hero CTAs, mobile

Button States:

  Default  → normal render
  Hover    → bg darkens one step, cursor: pointer
  Focus    → 2px offset outline in brand-500 (ring-2 ring-offset-2 ring-brand-500)
  Active   → bg darkens two steps, scale-[0.98] transform
  Loading  → disabled + spinner left of label text
  Disabled → opacity-50, cursor-not-allowed, no shadow

Loading Button Pattern:
  <button disabled>
    <Spinner size="sm" className="mr-2" />
    Processing...
  </button>

Full-width rule:
  Mobile: Primary CTA buttons are always full-width on < 640px breakpoint
  Desktop: Buttons are intrinsically sized to content
```

### 3.2 Forms

```
Form Layout Rules:
  Single-column on mobile (< 640px) — ALWAYS
  Two-column on desktop for non-sequential fields (name | phone, city | state)
  Three-column maximum — never exceed for form layouts
  Form section groups: 24px gap between groups, 16px between fields in group
  Section headers: text-sm font-semibold text-neutral-500 uppercase tracking-wider

Form Validation Rules:
  Validate on blur (not on keystroke) to avoid premature errors
  Show success state (green border + checkmark) after valid input
  Show error state inline below field — never as alert banners for field errors
  Required fields: asterisk (*) after label, red colour, aria-required="true"
  Character counters: show when field has maxLength > 0

Form Spacing:
  Label → Input gap:    4px (space-1)
  Input → Helper gap:   4px (space-1)
  Field → Field gap:    16px (space-4)
  Group → Group gap:    24px (space-6)
  Form → Submit gap:    32px (space-8)
```

### 3.3 Input Fields

```css
/* Base Input — all variants extend this */
.input-base {
  height: 40px;                        /* --space-10 */
  padding: 0 12px;                     /* px-3 */
  font-size: var(--text-sm);           /* 14px */
  border: 1.5px solid var(--color-neutral-200);
  border-radius: var(--radius-input);  /* 8px */
  background: var(--color-neutral-0);
  color: var(--color-neutral-800);
  transition: border-color 150ms ease, box-shadow 150ms ease;
  outline: none;
}

/* States */
.input-base:focus {
  border-color: var(--color-brand-500);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
}

.input-base::placeholder { color: var(--color-neutral-400); }

.input-base[data-state="error"] {
  border-color: var(--color-error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.input-base[data-state="success"] {
  border-color: var(--color-success-500);
}

.input-base:disabled {
  background: var(--color-neutral-100);
  cursor: not-allowed;
  opacity: 0.7;
}
```

#### Input Variants

```
Text input         → standard text, phone, email
Number input       → with increment/decrement controls on right
Textarea           → min-h-24, resize-y only (never resize-x)
Select             → native + custom styled overlay, chevron icon right
Combobox           → searchable select (Radix Combobox or shadcn)
Date picker        → Popover with calendar, supports keyboard navigation
File upload        → drag-and-drop zone (desktop) + tap-to-upload (mobile)
OTP input          → 6 isolated single-digit inputs, auto-advance on fill
Phone input        → flag + country code prefix, number-only keyboard on mobile
Search input       → magnifier icon left, clear (×) icon right when filled
Currency input     → ₹ prefix, number formatting (1,00,000 Indian format)
Pincode input      → 6-digit, auto-submit on fill for address lookup
```

### 3.4 Tables

```
Table Anatomy:
  Header row:   bg-neutral-50, text-xs font-semibold text-neutral-500 uppercase tracking-wider
  Body rows:    bg-white, hover:bg-neutral-50, border-b border-neutral-100
  Footer row:   bg-neutral-50 (totals, pagination)
  Cell padding: py-3 px-4 (12px vertical, 16px horizontal)

Column Types and Alignment:
  Text        → left-align
  Number/Amount → right-align (decimal points must vertically align)
  Status badge → center-align
  Actions     → right-align, reveal on row hover (opacity-0 group-hover:opacity-100)
  Checkbox    → center-align, 44px minimum column width

Table Features:
  Row selection:    Checkbox in first column, select-all in header
  Sorting:          Clickable column headers, caret up/down indicator
  Pagination:       Bottom of table, "Showing X–Y of Z results" + page controls
  Empty state:      Illustrated empty state component (never blank table)
  Loading state:    Skeleton rows (5 rows, pulsing) — not spinner overlay
  Row actions:      ... kebab menu or action buttons (max 3 visible, rest in menu)
  Sticky header:    Scroll-independent header for tables > viewport height
  Responsive:       On mobile — horizontal scroll with frozen first column

Pagination Component:
  ← Previous  [1] [2] [3] ... [8] [9]  Next →
  "Showing 21–40 of 342 workers"
  Items per page: [20 ▼] (options: 10, 20, 50, 100)
```

### 3.5 Cards

```
Card Variants:

  Stat Card      — compact metric display for dashboard KPIs
  Content Card   — standard card for lists, forms, table containers
  Worker Card    — avatar + name + skills + status + action (hiring context)
  Job Card       — title + location + wage + deadline + apply button
  Feature Card   — icon + title + description (landing page, onboarding)
  Action Card    — full-clickable card (entire surface is a link target)

Standard Card:
  Background:  white
  Border:      1px solid neutral-200
  Radius:      12px (radius-lg)
  Shadow:      shadow-sm (default), shadow-md (hover on clickable cards)
  Padding:     24px (p-6)
  Transition:  shadow 200ms ease (clickable cards only)

Stat Card Design:
  ┌─────────────────────────────────────────┐
  │ 🏷️  Total Workers         [▲ +12% ↑]   │
  │                                          │
  │  2,847                                   │
  │  ────────────────────────────────────── │
  │  ████████████░░░░ 71% of target          │
  └─────────────────────────────────────────┘
  Structure: icon + label (top row) | trend badge (top right) | big number | progress bar

Worker Card (Hiring View):
  ┌─────────────────────────────────────────┐
  │ [Avatar]  Rajesh Kumar          ✅ KYC  │
  │           Mason · 8 yrs exp             │
  │           📍 Andheri, Mumbai            │
  │           ⭐ 4.7  (23 jobs)             │
  │           ₹650/day                      │
  │                        [View] [Hire]    │
  └─────────────────────────────────────────┘
```

### 3.6 Modals & Dialogs

```
Modal Sizes:
  sm   : max-w-sm  (384px)  — confirmations, simple actions
  md   : max-w-md  (448px)  — forms (1-2 fields), alerts
  lg   : max-w-lg  (512px)  — forms (3-5 fields) — DEFAULT
  xl   : max-w-xl  (576px)  — complex forms
  2xl  : max-w-2xl (672px)  — data-heavy modals
  full : max-w-4xl          — document preview, map views

Modal Anatomy:
  ┌────────────────────────────────────────┐
  │  Title                          [✕]   │  ← Header: p-6, border-b
  ├────────────────────────────────────────┤
  │                                        │  ← Content: p-6
  │  Body content                          │    overflow-y-auto, max-h-[70vh]
  │                                        │
  ├────────────────────────────────────────┤
  │              [Cancel]  [Primary CTA]   │  ← Footer: p-4 or p-6, border-t
  └────────────────────────────────────────┘

Behaviour Rules:
  - Backdrop: bg-black/40, click to close (unless destructive confirmation)
  - Close button: top-right, accessible label "Close dialog"
  - Scroll: body locks when modal open (overflow-hidden on body)
  - Animation: scale-in from 95% opacity 0 → 100% opacity 1, 200ms ease-out
  - Focus trap: Tab cycles only within modal (Radix UI handles this)
  - Escape key: always closes modal
  - Mobile: full-screen bottom sheet (slides up from bottom, 92vh)

Confirmation Modal Pattern (Destructive):
  ⚠️ "Suspend Worker Account?"
  "This will prevent Rajesh Kumar from accessing the platform.
   You can restore access at any time."
  [Cancel]  [Suspend Account]  ← Destructive button (error-600)
```

### 3.7 Alerts & Notifications

```
Alert Component (inline page alerts):

  Variants:   info | success | warning | error
  Anatomy:    [Icon] [Title] [Description]  [Close×] (optional)
  Placement:  Below page header OR below form submit button
  No stack:   Never show more than 2 alerts simultaneously

  ┌──────────────────────────────────────────────────────────────┐
  │ ℹ️  Verification in progress                                   │
  │    Your Aadhaar is being verified. This usually takes 2 min. │
  └──────────────────────────────────────────────────────────────┘

Toast Notifications (Sonner):
  Position:  bottom-right (desktop), bottom-center (mobile)
  Duration:  success: 4s, info: 4s, warning: 6s, error: 8s (or manual close)
  Stack max: 3 toasts visible at once, older ones compress
  Actions:   Optional "Undo" or "View" link inside toast

  Types:
  ✅ Success: "Worker Rajesh Kumar hired successfully"
  ℹ️ Info:    "Report generation started. You'll be notified when ready."
  ⚠️ Warning: "Payroll batch has 3 workers with missing bank details"
  ❌ Error:   "Check-in failed. You are outside the site geo-fence boundary."

Badge / Status Chips:
  ACTIVE      → bg-success-100  text-success-700  dot: success-500
  PENDING     → bg-warning-100  text-warning-700  dot: warning-500
  INACTIVE    → bg-neutral-100  text-neutral-600  dot: neutral-400
  SUSPENDED   → bg-error-100    text-error-700    dot: error-500
  VERIFIED    → bg-teal-100     text-teal-700     icon: check-circle
  NEW         → bg-brand-100    text-brand-700    (no dot)
```

### 3.8 Navigation

#### Sidebar (Contractor / Admin Dashboard)

```
Width:         240px (expanded), 64px (collapsed/icon-only)
Background:    neutral-900 (dark sidebar, high contrast)
Text:          neutral-300 (default), neutral-0 (active/hover)
Accent:        brand-500 (left border on active item, width: 3px)

Anatomy:
  ┌────────────────────────────┐
  │  [Logo]  Digital Labour    │  ← 64px height, px-4
  ├────────────────────────────┤
  │  [Icon] Dashboard          │  ← 48px height, px-3, radius-md active bg
  │  [Icon] Workers        (3) │  ← Badge count in right corner
  │  [Icon] Jobs               │
  │  [Icon] Attendance         │
  │  [Icon] Payroll            │
  │  [Icon] Sites              │
  │  [Icon] Reports            │
  ├────────────────────────────┤
  │  SETTINGS                  │  ← Section divider label
  │  [Icon] Settings           │
  │  [Icon] Help               │
  ├────────────────────────────┤
  │  [Avatar] Ravi Constructions│ ← Bottom: user + org, hover shows menu
  └────────────────────────────┘

Active State:
  bg: rgba(249, 115, 22, 0.15)   (brand-500 at 15% opacity)
  text: neutral-0
  left border: 3px solid brand-500
  icon: filled variant (vs outline for inactive)

Mobile Sidebar:
  Off-canvas drawer (translateX(-100%) → translateX(0))
  Overlay backdrop on open
  Swipe-left gesture to close
```

#### Top Navigation (Landing / Marketing)

```
Height:        64px
Background:    white / blur-backdrop (scrolled)
Border:        border-b border-neutral-100 (on scroll)
Contents:      Logo | Nav links | CTA buttons | Language switcher

Sticky:        position: sticky; top: 0; z-index: 50;
Scroll effect: shadow-md appears after 20px scroll
Mobile:        Hamburger → full-screen overlay menu
```

#### Bottom Navigation (Mobile App / Worker)

```
Height:      64px + safe-area-inset-bottom
Background:  white
Border:      border-t border-neutral-100
Shadow:      shadow-[0_-4px_12px_rgba(0,0,0,0.08)]
Items:       5 maximum (Home, Jobs, Attendance, Wallet, Profile)
Active:      brand-500 icon (filled) + label, no indicator dot
Inactive:    neutral-400 icon (outline) + label
Label:       text-xs (10px) below icon
Safe area:   padding-bottom: env(safe-area-inset-bottom, 8px)
```

---

## 4. Dashboard Design

### 4.1 Worker Dashboard

```
Screen: Home (after login)

Layout:
  ┌─────────────────────────────────────────────────────────┐
  │ ☰  Good morning, Rajesh!             🔔 (2)  [Avatar]  │ ← AppBar
  ├─────────────────────────────────────────────────────────┤
  │  ┌─────────────────────────────────────────────────┐   │
  │  │  Active Job Banner (if on job)                   │   │
  │  │  🏗️ Site: Bandra Kurla Project                  │   │
  │  │  Day 12 of 30  •  ₹7,800 earned so far          │   │
  │  │  [Check In Now]  or  [Already Checked In ✓]      │   │
  │  └─────────────────────────────────────────────────┘   │
  │                                                          │
  │  Quick Stats (horizontal scroll)                        │
  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │
  │  │ Days   │  │ Amount │  │Rating  │  │ Jobs   │        │
  │  │  12    │  │ ₹7,800 │  │  4.8   │  │   3    │        │
  │  │ Worked │  │ Earned │  │ Score  │  │ Done   │        │
  │  └────────┘  └────────┘  └────────┘  └────────┘        │
  │                                                          │
  │  Recommended Jobs (AI-matched)                          │
  │  [Job Card 1]  [Job Card 2]  → (see all)               │
  │                                                          │
  │  Recent Notifications                                    │
  │  • Payment of ₹3,200 received  (2h ago)                │
  │  • New job match: Welder in Powai  (yesterday)          │
  └─────────────────────────────────────────────────────────┘

Design Rules:
  - Check-in CTA is always above the fold, full-width, brand-500
  - Earnings shown in green when positive, red when deductions pending
  - Job recommendations use AI match score (shown as %, not raw score)
  - Offline banner displayed at very top of screen when no connectivity
```

### 4.2 Contractor Dashboard

```
Screen: Overview

Layout: Sidebar (240px) + Main content area

┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar Nav]  │  Ravi Constructions  /  Dashboard              │
│                │  ─────────────────────────────────────────── │
│                │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│                │  │Active│ │Today │ │Pend. │ │Montly│        │
│                │  │ Work.│ │Attend│ │Appli.│ │Spend │        │
│                │  │  47  │ │ 41   │ │  12  │ │₹2.4L │        │
│                │  └──────┘ └──────┘ └──────┘ └──────┘        │
│                │                                                │
│                │  ┌─────────────────────┐ ┌──────────────────┐│
│                │  │  Live Site Map       │ │ Attendance Today ││
│                │  │  [Mapbox map]        │ │ 41/47 ▓▓▓▓▓░░   ││
│                │  │  • 41 workers visible│ │ On site: 41      ││
│                │  │  • 3 outside fence ⚠│ │ Off site: 3 ⚠   ││
│                │  └─────────────────────┘ │ Absent: 3        ││
│                │                          └──────────────────┘│
│                │  Recent Applications (last 24h)               │
│                │  [Worker Card] [Worker Card] [Worker Card]    │
│                │  ─────────────────────────────────────────── │
│                │  Jobs at a Glance                             │
│                │  [Job table: Title | Workers | Days | Status] │
└─────────────────────────────────────────────────────────────────┘

Design Rules:
  - Live site map is the hero element — contractors primary need is oversight
  - Orange dot markers for on-site workers, grey for checked-out, red for absent
  - Attendance ratio bar: green fill up to %, amber at < 80%, red at < 60%
  - Pending applications have notification dot on nav item + card urgency flag
  - Payroll alerts (pending approval, disbursement failures) in a dismissible banner
```

### 4.3 Enterprise Dashboard

```
Screen: Workforce Overview (multi-vendor)

Layout: Wider than contractor (max-w-screen-2xl), data-dense

Top section:
  ┌────────────────────────────────────────────────────────────────┐
  │ Vendor Health:  12 Active  |  3 Underperforming  |  1 At Risk │
  └────────────────────────────────────────────────────────────────┘

Stat row: Total Headcount | On-site Today | Payroll MTD | Compliance Score

Tab navigation: Overview | Vendors | Workforce | Payroll | Compliance | Reports

Design Rules:
  - Enterprise users are power users — dense data tables are acceptable
  - Compliance score (%) is prominent — often tied to audit requirements
  - Vendor performance table with sortable columns + colour-coded health scores
  - Export buttons on every data table (CSV, Excel, PDF)
  - Date range picker at top-right of every data view
```

### 4.4 Admin Dashboard

```
Screen: Platform Operations

Design Rules:
  - Monochrome palette with minimal brand colour (this is a tool, not a product)
  - Data tables dominate — sortable, filterable, bulk-actionable
  - Key stats: Total users, DAU, Platform GMV today, Open disputes, KYC queue
  - KYC Review Queue: priority-sorted, shows oldest-first with SLA countdown timer
  - Fraud alerts: dedicated section with ML confidence score + action buttons
  - Audit log viewer: infinite scroll table with timestamp, actor, action, resource
  - System health panel: API latency graph, queue depths, error rate last 1h

Colour flag system for admin tables:
  Green row tint  → healthy / verified / paid
  Yellow row tint → pending action required
  Red row tint    → blocked / failed / urgent
  Blue row tint   → informational / in-progress
```

---

## 5. Mobile App Design

### Flutter UI Guidelines

```dart
// Design token constants — single source of truth for Flutter
// lib/core/theme/app_theme.dart

class DlcColors {
  // Brand
  static const brand500  = Color(0xFFF97316);
  static const brand600  = Color(0xFFEA580C);
  static const brand50   = Color(0xFFFFF7ED);

  // Teal
  static const teal500   = Color(0xFF14B8A6);

  // Neutral
  static const neutral50  = Color(0xFFFAFAF9);
  static const neutral100 = Color(0xFFF5F5F4);
  static const neutral200 = Color(0xFFE7E5E4);
  static const neutral400 = Color(0xFFA8A29E);
  static const neutral500 = Color(0xFF78716C);
  static const neutral700 = Color(0xFF44403C);
  static const neutral800 = Color(0xFF292524);
  static const neutral900 = Color(0xFF1C1917);

  // Semantic
  static const success500 = Color(0xFF22C55E);
  static const warning500 = Color(0xFFF59E0B);
  static const error500   = Color(0xFFEF4444);
}

class DlcTextStyles {
  static const displayLarge  = TextStyle(fontSize: 36, fontWeight: FontWeight.w800, height: 1.2);
  static const headlineLarge = TextStyle(fontSize: 24, fontWeight: FontWeight.w700, height: 1.3);
  static const headlineMedium= TextStyle(fontSize: 20, fontWeight: FontWeight.w600, height: 1.3);
  static const titleLarge    = TextStyle(fontSize: 18, fontWeight: FontWeight.w600, height: 1.4);
  static const titleMedium   = TextStyle(fontSize: 16, fontWeight: FontWeight.w500, height: 1.4);
  static const bodyLarge     = TextStyle(fontSize: 16, fontWeight: FontWeight.w400, height: 1.5);
  static const bodyMedium    = TextStyle(fontSize: 14, fontWeight: FontWeight.w400, height: 1.5);
  static const labelLarge    = TextStyle(fontSize: 14, fontWeight: FontWeight.w500, height: 1.4, letterSpacing: 0.1);
  static const labelSmall    = TextStyle(fontSize: 12, fontWeight: FontWeight.w500, height: 1.3, letterSpacing: 0.4);
}

class DlcSpacing {
  static const xs  = 4.0;
  static const sm  = 8.0;
  static const md  = 16.0;
  static const lg  = 24.0;
  static const xl  = 32.0;
  static const xxl = 48.0;
}
```

### Responsive Layouts (Flutter)

```dart
// Responsive layout builder — single breakpoint for mobile app
class ResponsiveLayout extends StatelessWidget {
  const ResponsiveLayout({
    required this.mobile,
    this.tablet,
    super.key,
  });

  final Widget mobile;
  final Widget? tablet;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= 768 && tablet != null) return tablet!;
    return mobile;
  }
}

// Scaffold pattern with consistent padding
class DlcScaffold extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: DlcColors.neutral50,
      appBar: DlcAppBar(title: title),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: DlcSpacing.md,   // 16px
            vertical: DlcSpacing.md,
          ),
          child: child,
        ),
      ),
    );
  }
}
```

### Bottom Navigation Design

```
Items: Home | Jobs | Check In | Wallet | Profile
                      ↑
              Prominent centre tab
              brand-500 circle background
              +2px larger icon (32px vs 24px)
              Elevated appearance (shadow-lg)

Tab bar specification:
  Height:           64px + safe area bottom
  Background:       white
  Top border:       1px solid neutral-100
  Active icon:      filled, brand-500, label: brand-500 font-medium
  Inactive icon:    outline, neutral-400, label: neutral-400 font-normal
  Badge:            round red dot (top-right of icon), max "99+"
  Ripple:           brand-50 splash on Android, default on iOS
  Centre action:    CircleAvatar(radius: 28, bg: brand-500) with check-icon
```

### Offline Indicator

```
Offline Banner (shown at very top, below status bar):
  ┌─────────────────────────────────────────────────────┐
  │ ⚡ No internet  •  Working offline  •  Data will sync│
  └─────────────────────────────────────────────────────┘
  Background: neutral-800 (dark, obvious contrast)
  Text:       white, text-xs, center aligned
  Animation:  slides down 32px from top when offline, slides back up on reconnect
  Duration:   animates out after 3s if user doesn't interact, stays if critical action pending

Sync Progress Indicator (data uploading after reconnect):
  Linear progress bar, brand-500, at very top below offline banner
  "Syncing 3 attendance records..." — tiny caption below bar
  Disappears on sync complete + brief success toast
```

### GPS Tracking UI (Worker View — Active Job)

```
Screen: Attendance / Active Check-in

  ┌───────────────────────────────────────────────────────┐
  │  ← Back       Site Check-In                  ⋮       │
  ├───────────────────────────────────────────────────────┤
  │  ┌─────────────────────────────────────────────────┐  │
  │  │                                                  │  │
  │  │           [Google Map]                           │  │
  │  │    • Worker dot (blue, pulsing)                  │  │
  │  │    ○ Site boundary circle (brand-500, dashed)    │  │
  │  │                                                  │  │
  │  │    ┌──────────────────────────────────────────┐  │  │
  │  │    │ 📍 Bandra Kurla Complex Site             │  │  │
  │  │    │ You are 42m from check-in zone           │  │  │
  │  │    └──────────────────────────────────────────┘  │  │
  │  └─────────────────────────────────────────────────┘  │
  │                                                        │
  │  ┌─────────────────────────────────────────────────┐  │
  │  │  ✅ Within geo-fence                             │  │
  │  │  GPS Accuracy: ±8m  •  Updated 5s ago           │  │
  │  └─────────────────────────────────────────────────┘  │
  │                                                        │
  │  ┌─────────────────────────────────────────────────┐  │
  │  │         CHECK IN NOW                             │  │
  │  │    Large, full-width, brand-500 button           │  │
  │  └─────────────────────────────────────────────────┘  │
  └───────────────────────────────────────────────────────┘

States:
  Finding GPS:     Pulsing location icon, "Getting your location..."
  Outside fence:   Orange warning, distance shown, button disabled
  Inside fence:    Green indicator, button enabled
  Already in:      Shows check-in time, "Check Out" button instead
  GPS unavailable: Manual check-in fallback (requires supervisor approval)
```

---

## 6. UX Workflows

### 6.1 Worker Onboarding Flow

```
Step 1: Phone Number Entry
  Screen: Minimal, single field, large CTA
  Copy: "Enter your mobile number to get started"
  Subtext: "We'll send you a verification code"
  ← Important: Hindi option toggle at top

Step 2: OTP Verification
  Screen: 6 isolated digit inputs (auto-advance on fill)
  Auto-read OTP from SMS (Android SMS permission)
  Countdown timer: "Resend in 45s"
  Copy: "Enter the OTP sent to +91 98765 XXXXX"

Step 3: Basic Profile (3 fields only — progressive)
  Full Name | Primary Skill (dropdown) | City
  "Just 3 steps to start finding work"
  Progress indicator: Step 1 of 3

Step 4: Skill & Experience
  Primary skill (pre-filled from step 3)
  Experience years (stepper: + / -)
  Daily wage expectation (slider with ₹ labels)
  Additional skills (multi-select chips)

Step 5: KYC Prompt (not blocking)
  "Verify your identity to unlock more jobs"
  [Verify Now] [Skip for now]
  If skip → banner on home screen until verified

Step 6: Home Screen with Contextual Tooltips
  First-time coachmarks (Spotlight overlay):
  1. "Tap here to check in when you're on site"
  2. "See jobs matched to your skills here"
  3. "Your earnings and payment history"
  Dismiss on tap, remember in local storage

UX Principles:
  - Maximum 5 steps to completion
  - No step requires more than 3 inputs
  - KYC is optional until contractor requires it
  - Progress indicator always visible
  - Back button saves progress (never loses data)
  - Keyboard auto-advances to next field
```

### 6.2 Job Application Flow

```
Discovery:  Home screen → Recommended Jobs OR Search
            Filter chips: [Skill] [City] [Wage ₹] [Duration]
            Sort: Best match | Newest | Wage (high–low)

Job Detail Screen:
  Job title + contractor name + verification badge
  Key info row: 📍 Location · ₹ Wage/day · 📅 Start date · 👷 Workers needed
  Description (expandable)
  Required skills (chips)
  Site map thumbnail (tap to expand)
  Contractor profile card
  [Apply Now] full-width sticky bottom button

Application: (one-tap if profile is complete)
  If profile complete → confirm modal → done
  If missing info → inline prompt to complete specific fields
  After apply → immediate confirmation screen with animation (✅ + confetti micro-animation)

Application Tracking:
  Status timeline on "My Applications" tab:
    Applied → Shortlisted → Hired / Not Selected
  Push notification on each status change
  Each application shows: job title + contractor + status + date
```

### 6.3 Attendance Marking Flow

```
Trigger:     Worker arrives on site → notification if near site boundary
Entry:       Home screen → "Check In" centre nav button

Flow:
  1. App checks GPS (2–3s with loading indicator)
  2. If inside geo-fence (100m radius):
     → Green confirmation card slides up
     → "You are at Bandra Kurla Project (42m)"
     → [Confirm Check In] button
  3. Tap confirm:
     → Biometric / PIN confirmation (if enabled by contractor)
     → Animated success: large green checkmark + time
     → "Checked in at 8:47 AM" confirmation screen
     → Immediate push to contractor dashboard

Check-out flow (mirrors check-in):
  1. Tap "Check Out" from home screen (shown if checked in)
  2. GPS validation
  3. Confirm → shows daily summary: "9.5 hours · ₹650 earned today"

Edge cases:
  Outside fence:  "You're 350m away. Move closer to check in."
                  [Manual Check In] → requires contractor OTP code
  No GPS:         Manual check in with site code (5-digit code on site notice)
  Offline:        Store locally, sync when connected (sync badge shown)

Biometric check-in (contractor-enabled):
  Face photo captured → matched against profile photo (on-device or server)
  If match: proceed to confirm
  If mismatch: "Face not recognised" → manual supervisor approval flow
```

### 6.4 Payroll Viewing Flow

```
Entry: Home screen → Wallet tab

Wallet Screen:
  ┌────────────────────────────────────────────────┐
  │  Available Balance                              │
  │  ₹ 12,450                                      │
  │  [Withdraw to Bank]  [View History]             │
  │                                                 │
  │  This Month                                     │
  │  Earned: ₹8,200  |  Deductions: ₹656           │
  │  Net: ₹7,544                                    │
  │                                                 │
  │  Payroll History (by month)                     │
  │  ▼ May 2026   ₹7,544 Paid  [View Payslip PDF] │
  │  ▼ Apr 2026   ₹6,200 Paid  [View Payslip PDF] │
  │  ▼ Mar 2026   ₹8,100 Paid  [View Payslip PDF] │
  └────────────────────────────────────────────────┘

Payslip Detail Screen (on tap):
  Full breakdown: days worked, wage, overtime, PF, ESI, net
  Share button (WhatsApp share for bank/visa proof)
  Download PDF button

Design Rules:
  - Amounts always in green when positive
  - Deductions shown in red with explanation tooltip
  - "Pending" payroll shown with yellow badge, expected date shown
  - PF/ESI deduction has a (?) info icon that explains what it is in simple Hindi
```

### 6.5 Contractor Hiring Flow

```
Entry: Dashboard → Workers tab OR Job → Applications

Worker Discovery:
  Search bar (prominent, top of screen)
  AI-suggested workers (for current open jobs)
  Filter panel (collapsible, right side):
    Skill (multi-select) | City | Rating ≥ | Experience ≥ | Available from

Worker Profile (detail view):
  Hero: Large photo + name + verification badges
  Key metrics row: ⭐ Rating | 🏗️ Jobs | 📅 Experience | ₹ Expected wage
  Skills section: primary + secondary skill chips
  Work history: past jobs (contractor name hidden, role + duration shown)
  Documents: Aadhaar ✅ | PAN ✅ | Skill cert ✅ (viewable with permission)
  [Message] [Hire for Job] — sticky bottom bar

Hire Flow:
  1. [Hire for Job] → Select job dropdown (contractor's open jobs)
  2. Confirm wage (pre-filled from job, editable)
  3. Confirm start date
  4. Review summary: Worker name | Job | Wage | Start date
  5. [Confirm Hire] → success animation
  6. Worker receives SMS + push notification
  7. Auto-added to job's worker roster + attendance system

Bulk Hire (for contractors needing many workers):
  Search → multi-select workers (checkboxes appear) → [Hire Selected (12)]
  Bulk hire modal: apply same job + wage to all, with exceptions
```

---

## 7. Accessibility Standards

### WCAG 2.1 Level AA Compliance

```
Perceivable:
  1.1.1 Non-text content     → All images have alt text; icons have aria-label
  1.3.1 Info & relationships → Semantic HTML (nav, main, aside, header, footer)
  1.3.2 Meaningful sequence  → DOM order matches visual order
  1.4.1 Use of colour        → Never colour alone to convey meaning
  1.4.3 Contrast (min)       → 4.5:1 for normal text; 3:1 for large text
  1.4.4 Resize text          → Text scalable to 200% without content loss
  1.4.10 Reflow              → No horizontal scroll at 320px width
  1.4.11 Non-text contrast   → UI components 3:1 against adjacent colours

Operable:
  2.1.1 Keyboard             → All functionality accessible via keyboard
  2.1.2 No keyboard trap     → Focus never gets stuck (modals use focus trap correctly)
  2.4.3 Focus order          → Logical, top-to-bottom, left-to-right
  2.4.7 Focus visible        → Custom focus ring (2px brand-500 ring, 2px offset)
  2.4.4 Link purpose         → All links have descriptive text or aria-label

Understandable:
  3.1.1 Language             → lang="en" | lang="hi" on <html>
  3.2.2 On input             → No unexpected context changes on input
  3.3.1 Error identification → Errors identified in text, not just colour
  3.3.2 Labels or instructions → All form fields have visible labels

Robust:
  4.1.1 Parsing              → Valid HTML, no duplicate IDs
  4.1.2 Name, role, value    → All components have ARIA roles/labels
  4.1.3 Status messages      → Dynamic content announced via aria-live
```

### Keyboard Navigation

```
Tab order:     Matches visual reading order (LTR, top-to-bottom)
Skip links:    "Skip to main content" as first focusable element (visible on focus)
Modals:        Tab cycles within modal only (Radix UI FocusTrap component)
Tables:        Arrow keys to navigate cells; Enter to activate row action
Dropdowns:     Arrow keys to navigate options; Enter to select; Escape to close
Date picker:   Arrow keys for date navigation; Page Up/Down for month; Home/End for week
Search:        Escape clears search and returns focus to search input

Custom keyboard shortcuts (Contractor Dashboard):
  Ctrl + / : Open search
  N        : New job (when not in input field)
  Escape   : Close modal / drawer
```

### Colour Contrast Reference

```
Text combinations (WCAG AA):
  neutral-900 on white:      21:1  ✅ (AAA)
  neutral-700 on white:      9.4:1 ✅ (AAA)
  neutral-500 on white:      4.7:1 ✅ (AA)
  neutral-400 on white:      2.7:1 ❌ — only for decorative/placeholder
  brand-700 on white:        7.2:1 ✅ (AAA) — use for brand text
  brand-500 on white:        3.1:1 ❌ — do NOT use brand-500 text on white
  white on brand-500:        3.1:1 ❌ — use brand-600 or brand-700 as bg for text
  white on brand-700:        7.2:1 ✅ — use brand-700 bg for text needs

UI Component contrast (WCAG AA — 3:1):
  brand-500 border on white bg:  4.5:1 ✅
  neutral-200 border on white:   1.5:1 ❌ — only for decorative borders
  neutral-300 border on white:   2.0:1 ❌ — pair with 3px width for visibility
```

### Screen Reader Support

```html
<!-- All decorative icons hidden from screen readers -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- Icons conveying meaning have labels -->
<button aria-label="Remove Rajesh Kumar from shortlist">
  <TrashIcon aria-hidden="true" />
</button>

<!-- Live regions for dynamic updates -->
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {/* Toast messages announced here */}
  {latestToast?.message}
</div>

<!-- Loading states announced -->
<div role="status" aria-label="Loading workers list">
  <SkeletonTable />
</div>

<!-- Form error announcements -->
<input
  aria-invalid={!!error}
  aria-describedby="phone-error"
/>
{error && (
  <p id="phone-error" role="alert" className="text-error-600 text-sm">
    {error.message}
  </p>
)}
```

---

## 8. Responsive Design Rules

### Desktop Layout (≥ 1280px)

```
Contractor / Admin Dashboard:
  Sidebar:       240px fixed left
  Content area:  calc(100vw - 240px), max-width 1200px, centered
  Card grid:     4 stat cards in a row (grid-cols-4)
  Table:         Full width within content area
  Modals:        Centred, max-w-lg (default)

Landing Page:
  Max content width: 1280px, auto margins
  Hero section:      2-column (text left, illustration right), 50/50
  Features section:  3-column grid
  CTA section:       Full-width, centred text

Typography on desktop:
  Body:            16px
  Page titles:     36px
  Stat numbers:    48px
```

### Tablet Layout (768px – 1279px)

```
Dashboard:
  Sidebar:    64px collapsed (icon-only), expand on hover
  Card grid:  2×2 grid (grid-cols-2)
  Tables:     Horizontal scroll for wide tables
  Modals:     max-w-md, slight bottom offset

Landing Page:
  Hero:       Single column, illustration above text
  Features:   2-column grid (wraps to 1-column at 860px)
  Navigation: Hamburger menu at < 1024px

Typography:
  Body:       16px (unchanged)
  Page title: 28px
  Hero:       40px
```

### Mobile Layout (< 768px)

```
Navigation:
  Sidebar:        Off-canvas drawer (hamburger trigger)
  Dashboard nav:  Bottom tab bar (5 items max)

Card grid:    Single column, full-width cards
Tables:       Card-based layout (each row = a card) OR horizontal scroll
              Key columns only shown, "View details" for rest
Modals:       Bottom sheet (slides up from bottom, 90% screen height)
Forms:        Single column, full-width inputs
Buttons:      Full-width primary CTAs, auto on < 640px

Typography:
  Body:       16px (do not reduce below 16px on mobile)
  Page title: 22–24px
  Stat num:   28–30px

Mobile-specific patterns:
  Floating Action Button (FAB): 56×56px, brand-500, fixed bottom-right
    (Contractor: "Post Job" | Worker: "Check In")
  Pull-to-refresh: supported on all scrollable lists
  Swipe actions: swipe-right to approve, swipe-left to reject (application management)
  Bottom sheets for: filters, quick actions, confirmations
```

---

## 9. Page Design Specifications

### 9.1 Landing Page

```
Sections (in order):

1. HERO
   Headline:    "India's Labour Marketplace"
   Sub:         "Find verified workers. Manage attendance. Pay digitally."
   CTA:         [Post a Job] (brand-500) + [Find Work] (outline)
   Visual:      Photo collage of construction sites / workers on right
   Trust bar:   "2.8M Workers  •  45,000 Contractors  •  ₹420Cr Paid"

2. HOW IT WORKS (3 steps)
   Workers:     Create profile → Get matched → Get paid
   Contractors: Post job → Hire verified → Track attendance
   Toggle:      "I'm a Worker" / "I'm a Contractor"

3. FEATURES GRID (3×2)
   ✅ AI Matching    •  📍 Geo Attendance   •  💰 Digital Payroll
   🔒 KYC Verified  •  📊 Analytics        •  🌐 Hindi Support

4. SOCIAL PROOF
   Testimonial cards (worker + contractor voices)
   Logo strip: companies using platform

5. STATISTICS SECTION
   Full-width, brand-50 background, 4 large stat numbers

6. APP DOWNLOAD
   Worker: Google Play + App Store badges
   QR code for direct download

7. FOOTER
   Navigation links, language switcher, social media, legal
```

### 9.2 Login / Register

```
Layout:     Split screen (desktop) — left: brand illustration, right: form
            Full-screen form on mobile

Login Form:
  Step 1:   Phone number input (large, autofocus)
            [Continue with OTP] button (full-width)
  Step 2:   OTP entry (6 digits, auto-advance)
            Countdown timer + resend link
            [Verify] button
  Footer:   "Don't have an account? Register" link
            Language toggle: हिंदी | English

Design details:
  Phone input: flag selector + +91 prefix, number keyboard on mobile
  OTP inputs: 48×56px each, generous touch targets, prominent border
  Auto-read: Android SMS auto-fill with success animation
  Error: inline below affected field, never replaces the field
```

### 9.3 Dashboard (Contractor — Detailed)

```
Page structure:
  <PageHeader>
    Breadcrumb:  Dashboard
    Title:       "Good morning, Rahul 👋"
    Subtext:     "Wednesday, 27 May 2026  •  3 sites active"
    CTA:         [Post New Job]
  </PageHeader>

  <StatCardRow>  {/* grid grid-cols-4 gap-4 */}
    Active Workers | Today's Attendance | Pending Applications | Monthly Payroll
  </StatCardRow>

  <TwoColumnGrid>  {/* grid grid-cols-5 gap-6 */}
    <SiteMapCard colSpan={3}>  {/* Interactive Mapbox */}
    <AttendanceSummaryCard colSpan={2}>
  </TwoColumnGrid>

  <TwoColumnGrid>
    <RecentApplicationsCard colSpan={3}>
    <QuickActionsCard colSpan={2}>  {/* Upcoming payroll, expiring jobs */}
  </TwoColumnGrid>
```

### 9.4 Job Listing Page

```
Layout:
  ┌─────────────────────────────────────────────────────────────────┐
  │  Filter bar (sticky):                                            │
  │  [Search jobs...]  [Skill ▼] [City ▼] [Wage ▼] [Date ▼] [More]│
  │  Active filters: Mason × | Mumbai × | > ₹500/day ×  [Clear all]│
  ├──────────────────┬──────────────────────────────────────────────┤
  │  Filter Panel    │  Results: 47 jobs found                      │
  │  (desktop only)  │  Sort: Best match ▼  [Grid / List toggle]   │
  │                  │                                              │
  │  Skill           │  [Job Card]  [Job Card]  [Job Card]         │
  │  ☑ Mason         │  [Job Card]  [Job Card]  [Job Card]         │
  │  ☑ Carpenter     │  ...                                        │
  │  □ Electrician   │                                              │
  │                  │  [Load more] (infinite scroll on mobile)    │
  │  Location        │                                              │
  │  City input      │                                              │
  │                  │                                              │
  │  Daily Wage      │                                              │
  │  [────●──]       │                                              │
  │  ₹400 – ₹1200   │                                              │
  └──────────────────┴──────────────────────────────────────────────┘
```

### 9.5 Worker Profile Page

```
Profile sections:
  Hero:       Cover area (gradient), avatar (96px), name, badges
  Quick stats: Rating | Jobs completed | Experience | Expected wage
  Tabs:       Overview | Work History | Skills | Documents | Reviews

Overview tab:
  About section (bio, languages spoken, availability)
  Skills grid (primary skill large, secondary skills as chips)
  Preferred locations (city chips)
  Availability calendar (current month, green = available)

Work History tab:
  Timeline of past jobs (anonymous contractor names)
  Each entry: Role | Duration | Rating received | Skill used

Documents tab (contractor-restricted view):
  Aadhaar: [Last 4 digits visible] ✅ Verified
  PAN: [Last 4 digits] ✅ Verified
  Skill certificate: [View PDF button]

Contractor action bar (sticky bottom, only in hiring context):
  [📞 Call] [💬 Message] [Shortlist ♡] [Hire for Job →]
```

### 9.6 Attendance Screen

```
Tabs: Today | Weekly | Monthly

Today View:
  Active jobs list with check-in status for each
  Timeline view: check-in time → current time (duration bar) → check-out

Weekly View:
  7-day strip at top (Mon–Sun), tap to select day
  List of workers: avatar, name, check-in/out times, hours
  Export button (CSV)

Monthly View:
  Calendar heatmap (day tiles coloured by attendance density)
  Tap day → list of worker check-ins for that day
  Summary stats: Total worker-days | Average hours | Absent days

Table columns: Worker | Check In | Check Out | Hours | Status | [Actions]
Status values: Present | Absent | Late | Half-day | Leave
```

### 9.7 Payroll Screen

```
Tabs: Current Period | History | Settings

Current Period:
  Period dates header + [Process Payroll] CTA
  Status banner: "14 workers pending • Estimated total: ₹2,84,500"
  Worker table:
    Col: Worker | Days | Hours | Gross | Deductions | Net | Status
    Row actions: Edit deductions | View breakdown
  Footer: Total row (sum all columns) + [Approve & Process] button

Processing modal:
  Animated progress: generating payslips → sending to bank → disbursed
  Success screen: confetti + total amount disbursed

History tab:
  Accordion by month: expand to see batch details + download CSV
```

### 9.8 Reports Screen

```
Report types:
  Attendance Summary | Payroll Register | Worker Performance
  Site Productivity | Skill Demand | Platform Usage (admin)

Layout:
  Left panel (240px): Report type list + saved reports
  Right panel: Configuration + Preview + Download

Report configuration:
  Date range (calendar picker, presets: This month / Last month / Custom)
  Scope (all sites / specific site)
  Format (PDF / Excel / CSV)
  Schedule (one-time / weekly / monthly auto-send)

Preview:
  Table preview (first 10 rows) before final generation
  [Generate Full Report] → queued → progress notification → download link
```

---

## 10. Animation Guidelines

### Motion Design Principles

```
Principle 1: Purposeful
  Every animation communicates something (state change, loading, completion).
  No animation purely for decoration.

Principle 2: Swift
  UI micro-animations: 100–200ms
  Page transitions: 200–350ms
  Never exceed 500ms for any interactive animation
  (Beyond 500ms feels slow, not smooth)

Principle 3: Natural
  Ease-out for things entering the screen (fast start, slow end)
  Ease-in for things leaving the screen (slow start, fast end)
  Ease-in-out for things moving within the screen

Principle 4: Respectful
  Always honour prefers-reduced-motion media query
  Critical: geo-tracking and attendance UIs used by people in physical environments
  Reduce/disable all non-essential motion when prefers-reduced-motion: reduce
```

### Timing Functions

```css
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);    /* Bouncy — success states */
--ease-smooth:     cubic-bezier(0.4, 0, 0.2, 1);          /* Material standard */
--ease-enter:      cubic-bezier(0, 0, 0.2, 1);             /* Ease-out — elements entering */
--ease-exit:       cubic-bezier(0.4, 0, 1, 1);             /* Ease-in — elements leaving */
--ease-sharp:      cubic-bezier(0.4, 0, 0.6, 1);           /* Mid animation cuts */

/* Duration scale */
--duration-instant: 75ms;
--duration-fast:    100ms;
--duration-normal:  200ms;
--duration-slow:    300ms;
--duration-slower:  500ms;
```

### Micro-Interactions

```
Button press:
  transform: scale(0.97)
  duration: 75ms ease-out
  returns: scale(1) on mouseup, 150ms ease-spring

Card hover (desktop):
  box-shadow: shadow-sm → shadow-md
  translateY: 0 → -2px
  duration: 200ms ease-out

Success check-in:
  Large ✅ icon scales in: scale(0) → scale(1.2) → scale(1)
  Duration: 400ms ease-spring
  Green circle ripple expanding behind icon
  Screen bg: brief flash of success-50

Form field focus:
  Border: neutral-200 → brand-500
  Shadow ring fades in: 0 → 3px brand-500/15%
  Duration: 150ms ease-out

Tab switch:
  Underline indicator slides to new tab
  Duration: 200ms ease-smooth (not fade — slide)

Modal open:
  Backdrop: opacity 0 → 0.4, 200ms
  Modal: scale(0.95) opacity(0) → scale(1) opacity(1), 250ms ease-enter

Modal close:
  Backdrop: opacity 0.4 → 0, 150ms
  Modal: scale(1) → scale(0.95) opacity(0), 150ms ease-exit
```

### Loading States

```
Page/section loading:
  Skeleton loaders — ALWAYS over spinner overlays
  Skeleton: neutral-200 base, neutral-300 shimmer animation
  Shimmer: linear-gradient moving left-to-right, 1.5s loop

  /* Skeleton shimmer */
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg,
      var(--color-neutral-200) 25%,
      var(--color-neutral-100) 50%,
      var(--color-neutral-200) 75%
    );
    background-size: 800px 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

Button loading:
  Spinner (16px) left of label text
  Label changes: "Hire" → "Hiring..."
  Button disabled, opacity unchanged (avoid jarring opacity-50 flash)

Full-page loading (initial app load):
  Branded splash: logo centre, subtle pulse, brand-50 background
  Maximum duration: 2s (then show content even if partially loaded)

Progress bars:
  Determinate: use when progress % is known (payroll processing, file upload)
  Indeterminate: use when duration unknown (API calls, report generation)
  Style: 4px height, brand-500 fill, neutral-100 track, rounded ends
```

### Skeleton Loader Patterns

```tsx
// Worker list skeleton
function WorkerListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-neutral-100 rounded-xl">
          <div className="skeleton h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-48 rounded-md" />
            <div className="skeleton h-3 w-32 rounded-md" />
          </div>
          <div className="skeleton h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

// Stat card skeleton
function StatCardSkeleton() {
  return (
    <div className="p-6 border border-neutral-100 rounded-xl space-y-4">
      <div className="skeleton h-4 w-32 rounded-md" />
      <div className="skeleton h-8 w-24 rounded-md" />
      <div className="skeleton h-2 w-full rounded-full" />
    </div>
  );
}
```

### Page Transitions (Next.js)

```tsx
// Framer Motion page wrapper
const pageVariants = {
  initial:  { opacity: 0, y: 8 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.2,
  ease: [0, 0, 0.2, 1],
};

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
```

---

## 11. Design Tokens

### CSS Custom Properties (Full Reference)

```css
/* ═══════════════════════════════════════════════════════════════════
   DIGITAL LABOUR CHOWK — DESIGN TOKENS
   Auto-generated from design system. Do not edit manually.
   Edit source: design-tokens.json → run `npm run tokens:build`
   ═══════════════════════════════════════════════════════════════════ */

:root {
  /* Colours — Brand */
  --dlc-color-brand-50:  #FFF7ED;
  --dlc-color-brand-100: #FFEDD5;
  --dlc-color-brand-200: #FED7AA;
  --dlc-color-brand-300: #FDBA74;
  --dlc-color-brand-400: #FB923C;
  --dlc-color-brand-500: #F97316;
  --dlc-color-brand-600: #EA580C;
  --dlc-color-brand-700: #C2410C;
  --dlc-color-brand-800: #9A3412;
  --dlc-color-brand-900: #7C2D12;

  /* Colours — Teal */
  --dlc-color-teal-500: #14B8A6;
  --dlc-color-teal-600: #0D9488;

  /* Colours — Neutral */
  --dlc-color-neutral-0:   #FFFFFF;
  --dlc-color-neutral-50:  #FAFAF9;
  --dlc-color-neutral-100: #F5F5F4;
  --dlc-color-neutral-200: #E7E5E4;
  --dlc-color-neutral-300: #D6D3D1;
  --dlc-color-neutral-400: #A8A29E;
  --dlc-color-neutral-500: #78716C;
  --dlc-color-neutral-600: #57534E;
  --dlc-color-neutral-700: #44403C;
  --dlc-color-neutral-800: #292524;
  --dlc-color-neutral-900: #1C1917;

  /* Colours — Semantic */
  --dlc-color-success-500: #22C55E;
  --dlc-color-success-600: #16A34A;
  --dlc-color-warning-500: #F59E0B;
  --dlc-color-warning-600: #D97706;
  --dlc-color-error-500:   #EF4444;
  --dlc-color-error-600:   #DC2626;
  --dlc-color-info-500:    #3B82F6;
  --dlc-color-info-600:    #2563EB;

  /* Semantic Aliases */
  --dlc-color-bg-primary:    var(--dlc-color-neutral-50);
  --dlc-color-bg-secondary:  var(--dlc-color-neutral-100);
  --dlc-color-bg-elevated:   var(--dlc-color-neutral-0);
  --dlc-color-text-primary:  var(--dlc-color-neutral-900);
  --dlc-color-text-secondary:var(--dlc-color-neutral-500);
  --dlc-color-text-tertiary: var(--dlc-color-neutral-400);
  --dlc-color-border:        var(--dlc-color-neutral-200);
  --dlc-color-border-focus:  var(--dlc-color-brand-500);

  /* Typography */
  --dlc-font-sans:       'Inter', 'Noto Sans', system-ui, sans-serif;
  --dlc-font-display:    'Satoshi', 'Inter', sans-serif;
  --dlc-font-mono:       'JetBrains Mono', monospace;

  --dlc-text-xs:   0.75rem;
  --dlc-text-sm:   0.875rem;
  --dlc-text-base: 1rem;
  --dlc-text-lg:   1.125rem;
  --dlc-text-xl:   1.25rem;
  --dlc-text-2xl:  1.5rem;
  --dlc-text-3xl:  1.875rem;
  --dlc-text-4xl:  2.25rem;

  --dlc-font-normal:   400;
  --dlc-font-medium:   500;
  --dlc-font-semibold: 600;
  --dlc-font-bold:     700;

  /* Spacing */
  --dlc-space-1:  4px;
  --dlc-space-2:  8px;
  --dlc-space-3:  12px;
  --dlc-space-4:  16px;
  --dlc-space-5:  20px;
  --dlc-space-6:  24px;
  --dlc-space-8:  32px;
  --dlc-space-10: 40px;
  --dlc-space-12: 48px;
  --dlc-space-16: 64px;

  /* Border Radius */
  --dlc-radius-sm:   4px;
  --dlc-radius-md:   8px;
  --dlc-radius-lg:   12px;
  --dlc-radius-xl:   16px;
  --dlc-radius-2xl:  20px;
  --dlc-radius-full: 9999px;

  /* Shadows */
  --dlc-shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --dlc-shadow-sm: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
  --dlc-shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --dlc-shadow-lg: 0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05);
  --dlc-shadow-xl: 0 20px 25px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.04);

  /* Z-index scale */
  --dlc-z-base:    0;
  --dlc-z-raised:  10;
  --dlc-z-sticky:  20;
  --dlc-z-overlay: 30;
  --dlc-z-drawer:  40;
  --dlc-z-modal:   50;
  --dlc-z-toast:   60;
  --dlc-z-tooltip: 70;

  /* Animation */
  --dlc-duration-fast:   100ms;
  --dlc-duration-normal: 200ms;
  --dlc-duration-slow:   300ms;
  --dlc-ease-enter:      cubic-bezier(0, 0, 0.2, 1);
  --dlc-ease-exit:       cubic-bezier(0.4, 0, 1, 1);
  --dlc-ease-smooth:     cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',  // Primary
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        teal: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        neutral: {
          0:   '#FFFFFF',
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem',  { lineHeight: '0.875rem' }],   // 10px
        'xs':  ['0.75rem',   { lineHeight: '1rem'     }],   // 12px
        'sm':  ['0.875rem',  { lineHeight: '1.25rem'  }],   // 14px
        'base':['1rem',      { lineHeight: '1.5rem'   }],   // 16px
        'lg':  ['1.125rem',  { lineHeight: '1.75rem'  }],   // 18px
        'xl':  ['1.25rem',   { lineHeight: '1.75rem'  }],   // 20px
        '2xl': ['1.5rem',    { lineHeight: '2rem'     }],   // 24px
        '3xl': ['1.875rem',  { lineHeight: '2.25rem'  }],   // 30px
        '4xl': ['2.25rem',   { lineHeight: '2.5rem'   }],   // 36px
        '5xl': ['3rem',      { lineHeight: '1.2'      }],   // 48px
        '6xl': ['3.75rem',   { lineHeight: '1.1'      }],   // 60px
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
      },
      borderRadius: {
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '20px',
        '3xl':  '24px',
      },
      boxShadow: {
        'xs':      '0 1px 2px 0 rgba(0,0,0,0.05)',
        'brand':   '0 4px 14px 0 rgba(249,115,22,0.30)',
        'brand-lg':'0 8px 25px 0 rgba(249,115,22,0.35)',
        'success': '0 4px 14px 0 rgba(34,197,94,0.25)',
        'error':   '0 4px 14px 0 rgba(239,68,68,0.25)',
      },
      transitionTimingFunction: {
        'enter':  'cubic-bezier(0, 0, 0.2, 1)',
        'exit':   'cubic-bezier(0.4, 0, 1, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'shimmer':     'shimmer 1.5s ease-in-out infinite',
        'fade-in':     'fadeIn 200ms ease-enter',
        'slide-up':    'slideUp 300ms ease-enter',
        'slide-down':  'slideDown 300ms ease-exit',
        'scale-in':    'scaleIn 200ms ease-spring',
        'pulse-ring':  'pulseRing 2s ease-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(0)',    opacity: '1' },
          to:   { transform: 'translateY(16px)', opacity: '0' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to:   { transform: 'scale(1)',    opacity: '1' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(1)',   opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0'   },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};

export default config;
```

---

## 12. Design-to-Code Standards

### Atomic Design Implementation

```
Level 1: Atoms (lib/components/ui/)
  Pure, stateless UI primitives — shadcn/ui base components
  Button, Input, Badge, Avatar, Spinner, Skeleton, Separator
  Rule: No business logic. No API calls. No Zustand.

Level 2: Molecules (lib/components/shared/)
  Composed of atoms. Single responsibility.
  SearchInput (Input + Icon + ClearButton)
  StatCard (Icon + Label + Number + Trend)
  FilterChip (Badge + RemoveButton)
  WorkerAvatar (Avatar + StatusDot + Tooltip)
  Rule: May accept data props. No direct API calls.

Level 3: Organisms (lib/components/{domain}/)
  Complex UI assembled from molecules.
  WorkerCard, JobCard, AttendanceTable, PayrollRow, SiteMapCard
  May contain local state (expanded/collapsed, hover)
  Rule: No API calls directly — receive data as props or via hook prop.

Level 4: Templates (lib/components/layouts/)
  Page shells — sidebar + content, auth layout, dashboard layout
  DashboardLayout, AuthLayout, MarketingLayout

Level 5: Pages (app/**/page.tsx)
  Data fetching via TanStack Query (useWorkers, useJobs, etc.)
  Compose templates + organisms
  Handle page-level error/loading states
```

### Component Naming Convention

```typescript
// File naming: PascalCase for components
WorkerCard.tsx
JobApplicationModal.tsx
AttendanceSummaryTable.tsx
PayrollStatusBadge.tsx

// Named exports always (no default exports for components)
export function WorkerCard({ ... }: WorkerCardProps) { }

// Props interface: ComponentName + Props suffix
interface WorkerCardProps {
  worker: WorkerSummary;
  mode: 'hiring' | 'tracking' | 'view';
  onHire?: (workerId: string) => void;
  onShortlist?: (workerId: string) => void;
  className?: string;   // ALWAYS accept className for composition
}

// Compound components for complex UI (avoid prop drilling)
<DataTable>
  <DataTable.Header>
    <DataTable.Column key="name">Worker Name</DataTable.Column>
  </DataTable.Header>
  <DataTable.Body>
    {workers.map(w => <DataTable.Row key={w.id} data={w} />)}
  </DataTable.Body>
  <DataTable.Pagination total={342} />
</DataTable>
```

### Component Reuse Rules

```typescript
// Rule 1: Extract any JSX repeated 2+ times into a component
// Before (repeated in 4 places):
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-green-500" />
  <span className="text-sm text-neutral-600">Active</span>
</div>

// After (reusable atom):
<StatusDot status="ACTIVE" />

// Rule 2: Use cva() for variant-driven components (class-variance-authority)
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all',
  {
    variants: {
      variant: {
        primary:     'bg-brand-500 text-white hover:bg-brand-600 shadow-brand',
        secondary:   'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50',
        destructive: 'bg-error-600 text-white hover:bg-error-700',
        ghost:       'text-brand-600 hover:bg-brand-50',
      },
      size: {
        xs:  'h-7 px-2.5 text-xs',
        sm:  'h-8 px-3 text-sm',
        md:  'h-10 px-4 text-sm',
        lg:  'h-11 px-5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

// Rule 3: Separate display from data — never fetch in UI atoms or molecules
// Rule 4: Use Suspense boundaries at organism level, not page level
// Rule 5: Forward refs on all form elements (required for RHF + shadcn integration)
```

### Accessibility Implementation in Code

```tsx
// Required patterns for every interactive component:

// 1. Semantic HTML first
<nav aria-label="Main navigation">
<main id="main-content">
<button type="button"> // not <div onClick>

// 2. Focus management
<Dialog>
  {/* Radix auto-traps focus */}
  <DialogContent>
    <DialogTitle>Hire Worker</DialogTitle>  {/* Required — screen reader heading */}
    <DialogDescription>                    {/* Optional but recommended */}
      This will send a hire request to the worker.
    </DialogDescription>
  </DialogContent>
</Dialog>

// 3. Loading state announcements
<div role="status" aria-live="polite">
  {isLoading
    ? <span className="sr-only">Loading workers, please wait</span>
    : <span className="sr-only">Workers loaded, {total} results found</span>
  }
</div>

// 4. Icon-only buttons ALWAYS have aria-label
<Button size="icon" aria-label="Filter workers">
  <FunnelIcon aria-hidden />
</Button>

// 5. Error messages linked to their input
<FormItem>
  <FormLabel htmlFor="phone">Phone Number *</FormLabel>
  <FormControl>
    <Input
      id="phone"
      aria-invalid={!!errors.phone}
      aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
    />
  </FormControl>
  <p id="phone-hint" className="text-xs text-neutral-500">
    Enter 10-digit Indian mobile number
  </p>
  {errors.phone && (
    <p id="phone-error" role="alert" className="text-xs text-error-600">
      {errors.phone.message}
    </p>
  )}
</FormItem>
```

---

## 13. Recommended UI Libraries

### shadcn/ui — Primary Component System

```
Why:  Components are copy-owned (not npm-installed). Full control.
      Built on Radix UI primitives — accessibility-first.
      Tailwind-based — matches our token system.
      TypeScript-first, well-typed.

Install:  npx shadcn@latest init
          npx shadcn@latest add button input dialog table card badge

Components used from shadcn:
  Layout:    Card, Separator, ScrollArea, AspectRatio
  Forms:     Form, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider
  Overlay:   Dialog, AlertDialog, Sheet, Popover, Tooltip, HoverCard
  Navigation:DropdownMenu, NavigationMenu, Tabs, Breadcrumb
  Display:   Table, Badge, Avatar, Progress, Skeleton
  Feedback:  Alert, Toast (replaced by Sonner)

Customisation:
  All shadcn components reference CSS variables — override in globals.css
  Never modify lib/components/ui/ directly — extend via composition
```

### TailwindCSS — Styling Foundation

```
Version:  3.x (Tailwind 4.x migration guide in CLAUDE.md when ready)
Why:      Utility-first matches token-driven design.
          Tree-shaking eliminates unused CSS.
          co-located styles — no CSS file context-switching.
          JIT mode enables arbitrary values when tokens are insufficient.

Plugins:
  @tailwindcss/forms       — normalize form element base styles
  @tailwindcss/typography  — prose styles for rich text content
  tailwindcss-animate      — animation utilities (used with shadcn)
  @tailwindcss/aspect-ratio — aspect ratio utilities

Usage rules:
  ✅ Use design token classes: text-brand-500, bg-neutral-50, rounded-lg
  ❌ Don't use arbitrary values for things in our token system: text-[#F97316]
  ✅ Arbitrary values OK for one-off layout: w-[240px] for sidebar
  ✅ Use @apply in globals.css for repeated utility combinations
  ❌ Don't @apply in component files — keep utilities in JSX for visibility
```

### Framer Motion — Animation Layer

```
Version:  11.x
Why:      Declarative animation API, gesture support, layout animations,
          AnimatePresence for exit animations (modal close, list remove).

Used for:
  Page transitions        — <AnimatePresence> wrapping route changes
  Modal animations        — scale + opacity on Dialog open/close
  List item animations    — stagger children when list loads
  Drag-and-drop           — contractor job order (future feature)
  Success animations      — check-in confirmation, payroll processed

Performance:
  Use will-change: transform for GPU-accelerated animations
  Prefer transform/opacity (GPU) over layout-affecting properties
  Use layoutId for shared element transitions (worker card → detail view)
  Disable on prefers-reduced-motion:

  const shouldReduceMotion = useReducedMotion();
  <motion.div animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}>

Example — staggered list:
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  <motion.ul variants={container} initial="hidden" animate="show">
    {workers.map(w => (
      <motion.li key={w.id} variants={item}>
        <WorkerCard worker={w} />
      </motion.li>
    ))}
  </motion.ul>
```

### Heroicons — Icon Library

```
Version:  2.x
Package:  @heroicons/react
Why:      MIT license, consistent 24px grid, outline + solid variants,
          maintained by Tailwind team (token-aligned visual language).

Usage:
  import { UserCircleIcon } from '@heroicons/react/24/outline';     // 24px outline
  import { CheckCircleIcon } from '@heroicons/react/24/solid';      // 24px solid
  import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';  // 20px (inline)
  import { XMarkIcon } from '@heroicons/react/16/solid';            // 16px (dense UI)

  <UserCircleIcon className="h-6 w-6 text-neutral-500" aria-hidden />

Rules:
  Always outline for 24px navigation, content, card icons
  Always solid for 16–20px inline, status indicator, filled button icons
  Always aria-hidden="true" when adjacent text describes the icon's meaning
  Always aria-label on icon-only interactive elements

Supplemental: Lucide React
  For icons not in Heroicons (rare). Same style conventions apply.
```

### Supporting Libraries

```
Sonner (toasts)
  Why:    Prettier than react-hot-toast, stacking, promise-based API
  Import: import { toast } from 'sonner';
  Use:    toast.success("Worker hired"), toast.error("Failed"), toast.promise(apiCall, {...})

TanStack Table v8
  Why:    Headless, fully typed, virtual scrolling for large datasets
  Use:    Contractor worker tables (500+ rows), payroll tables

Mapbox GL JS
  Why:    Superior performance vs Google Maps for custom GeoJSON rendering
  Use:    Site map, worker location pins, geo-fence polygon rendering
  Mobile: Google Maps Flutter Plugin (Flutter ecosystem standard)

React Hook Form + Zod
  Why:    Minimal re-renders, native validation, Zod gives runtime + compile type safety
  Use:    Every form in the application

date-fns
  Why:    Immutable, tree-shakable, locale support (hi-IN for Hindi dates)
  Use:    All date formatting, payroll period calculations, attendance aggregations

Recharts
  Why:    React-native, composable, responsive out of the box
  Use:    Dashboard charts (area, bar, donut), analytics pages
  Alt:    Tremor chart components (built on Recharts + Tailwind) for faster dev
```

---

## Appendix A: Design Checklist

### Pre-handoff Design Review

```
Visual Design:
  [ ] All text passes 4.5:1 contrast ratio check (Chrome Accessibility panel)
  [ ] No text uses brand-500 on white background
  [ ] All interactive elements minimum 44×44px on mobile
  [ ] Touch targets have adequate spacing (8px minimum between targets)
  [ ] Loading, empty, and error states designed for every data screen
  [ ] Dark mode considerations noted (even if not implemented yet)

Typography:
  [ ] No body text below 14px
  [ ] No placeholder text used as labels (labels always visible)
  [ ] Number-heavy screens use tabular figures (font-variant-numeric: tabular-nums)
  [ ] Hindi content uses Noto Sans Devanagari, not machine-translated Inter

Responsiveness:
  [ ] Tested at 320px, 375px, 768px, 1280px, 1440px
  [ ] No horizontal scroll at any breakpoint (exception: data tables with explicit overflow-x-auto)
  [ ] Modals become bottom sheets on < 640px
  [ ] Sidebars collapse on < 768px

Accessibility:
  [ ] All images have alt text
  [ ] All icon-only buttons have aria-label
  [ ] Form errors linked to inputs via aria-describedby
  [ ] Focus order follows visual reading order
  [ ] Animation can be disabled (prefers-reduced-motion)
```

### Developer Handoff Notes

```
Figma export rules:
  Components: export as React component names (match codebase)
  Colours: export as CSS variable names (match design-tokens.css)
  Spacing: export as Tailwind class names where possible
  Fonts: include fallback stack, not just primary font
  Assets: SVGs exported as JSX-friendly (no class= attributes, use className=)
  Icons: reference Heroicons name, don't export as custom SVGs

Spec documentation per component:
  States: default, hover, focus, active, disabled, loading, error
  Sizes: all variants if component has size variants
  Dark mode: if applicable
  Responsive: how component changes across breakpoints
  Motion: duration, easing, what triggers animation
```

---

*Design.md — Digital Labour Chowk*
*Version 1.0 | May 2026 | Owned by: Product Design Team*
*Review cycle: Per product release or major design system update*
*Figma source: Design → Digital Labour Chowk → v1 Design System (ask #design for access)*

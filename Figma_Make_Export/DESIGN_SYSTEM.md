# AFGT Website - Design System Documentation

## Overview
This website follows a strict institutional design system based on corporate website standards. The design emphasizes calm, restrained, and editorial aesthetics with minimal motion and decorative elements.

## Company Name Governance

### Primary Identity
- **Full Name**: AL Farhan General Trading
- **Abbreviation**: AFGT

### Usage Rules
- **Logo/Header**: AFGT only
- **First mention in content**: "AL Farhan General Trading (AFGT)"
- **Subsequent mentions**: AFGT
- **Footer & Legal**: AL Farhan General Trading (full name)

---

## Typography System

### Fonts
- **Serif**: Cormorant Garamond (Headlines, Major Statements)
- **Sans-serif**: Inter (Body text, Utility text, Navigation)

### Hierarchy
- **H1**: Serif, Very Large (text-6xl/7xl), Regular weight, Used once per page
- **H2**: Serif, Large (text-4xl/5xl), Regular weight, Section headlines
- **H3**: Serif, Medium (text-xl/2xl), Regular weight, Subsections
- **Body**: Sans-serif, Base size (text-base), Short paragraphs (1-3 lines)
- **Metrics**: Sans-serif, Large numerals (text-6xl), Medium/Bold weight
- **Utility**: Sans-serif, Small (text-sm), Navigation and metadata

---

## Color System

### Background Colors
- **Primary**: White (#ffffff)
- **Secondary**: Very light gray (#f9f9f9)
- **Dark**: Dark gray (#2c2c2c) - Used only for hero/media sections

### Text Colors
- **Primary**: Near-black (#2c2c2c)
- **Secondary**: Medium gray (#5c5c5c)
- **On Dark**: White (#ffffff)

### Accent
- **Brand**: Gradient (blue to teal) - Used only in logo
- **Usage**: Minimal - Logo and icons only

### CTAs
- **Background**: White
- **Text**: Dark gray (#2c2c2c)
- **Border**: Thin (#2c2c2c)
- **Hover**: Inverted colors

---

## Spacing System

### Section Spacing (Vertical)
- **Between Sections**: 96px (marginTop)
- **Hero to First Section**: 96px
- **Section Internal Padding**: 72px (top/bottom)
- **Text-only Sections**: 64px (lighter sections)

### Internal Spacing
- **Headline → Description**: 16px
- **Description → CTA**: 24px
- **Image → Text (columns)**: 48px gap (grid gap-12)
- **Product Image → Label**: 12px (mb-3)
- **List Items**: 12-16px spacing

### Typography Spacing
- **H1**: 32px margin-bottom
- **H2**: 24px margin-bottom
- **H3**: 16px margin-bottom
- **Paragraph**: 16-20px margin-bottom
- **Section Headline → Content**: 40px

---

## Grid System

### Container
- **Max Width**: 1140px
- **Padding**: 32px (px-8)

### Grid Structure
- **Columns**: 12-column grid
- **Gap**: 48px (gap-12)

### Column Usage
- **Two-column Media+Text**: 6 cols image, 5 cols text
- **Metrics**: 3 cols each (4 items)
- **Product Groups**: 5 cols desktop, 2 cols mobile

---

## Layout Rules

### Page Structure
1. Hero Section (70-80vh)
2. Statement Section (text-only, centered)
3. Media + Text Section (alternating left/right)
4. Metrics Section (horizontal layout)
5. Media + Text Section (inverted)
6. Closing Statement
7. Footer

### Section Alternation
- **Pattern**: Heavy (media/metrics) → Light (text-only)
- **Background**: White → Light gray → White
- **Purpose**: Visual breathing pauses

---

## Component Rules

### Hero
- **Height**: 70-80vh
- **Background**: Video or dark gradient
- **Content**: Centered (vertical + horizontal)
- **Elements**: H1 + optional single CTA
- **CTA Style**: White background, dark text, pill-shaped

### Product Groups
- **Layout**: Horizontal grid (5 items desktop)
- **Image Ratio**: 16:9 (aspect-[16/9])
- **Spacing**: 32px gap between items
- **Interaction**: Hover opacity change only
- **CTA**: Single "View all products" below grid

### Metrics
- **Layout**: Horizontal equal-width columns
- **Number Size**: Very large (text-6xl)
- **Label**: Small, secondary (text-sm)
- **Priority**: Numbers dominate labels

### Media + Text Sections
- **Pattern**: Alternates left/right every section
- **Ratio**: 6 cols media, 5 cols text
- **Gap**: 48px between columns
- **Images**: 16:9 aspect ratio

---

## Motion & Interaction

### Allowed Motion
- Background video playback (hero only)
- Instant hover state changes (opacity, underline, color)

### Disallowed Motion
- ❌ Scroll-triggered animations
- ❌ Section entrance animations
- ❌ Parallax effects
- ❌ Decorative or expressive motion

### Hover Effects
- **Navigation**: Slight color darkening
- **Buttons**: Background/text color inversion
- **Images**: Opacity 90%
- **Links**: Underline on hover

---

## Mobile Behavior

### Breakpoints
- **Desktop**: Default (1140px container)
- **Tablet/Mobile**: Responsive grid (grid-cols-2 for products)

### Spacing Adjustments
- **Section Spacing**: 64px (reduced from 96px)
- **Image → Text**: 24px (reduced from 48px)
- **Product Groups**: 2 items per row (no slider)

---

## Design Principles

1. **Institutional** - Corporate, formal, authoritative
2. **Calm** - Restrained motion, generous spacing
3. **Editorial** - Typography-led, clear hierarchy
4. **Content-first** - No visual noise, no decorative elements
5. **Minimal interaction** - Hover effects only
6. **High readability** - Comfortable line lengths, clear contrast
7. **Visual breathing** - Alternating section weights

---

## Restrictions

### Never Use
- ❌ Cards
- ❌ Shadows
- ❌ Gradients (except logo)
- ❌ Sliders/Carousels
- ❌ Modals/Popups
- ❌ Heavy animations
- ❌ Multiple CTAs per page
- ❌ Promotional language
- ❌ Marketing slogans

### Always Use
- ✅ White/light gray backgrounds
- ✅ Serif headlines
- ✅ Sans-serif body
- ✅ Short paragraphs (1-3 lines)
- ✅ Generous spacing
- ✅ Factual, institutional tone
- ✅ Single primary CTA
- ✅ 16:9 image ratios

---

## Page Templates

### Homepage
- Hero → Statement → Media+Text → Product Groups → Metrics → Media+Text (inverted) → Closing Statement

### Inner Pages (About, Sustainability, Careers)
- Reduced hero (40-50vh) → Statement → Multiple content sections → Footer

### Product Pages
- Page intro → Product overview (media+text) → Specifications → Origins & Certifications → Inquiry CTA

### Contact Page
- Page intro → Contact info → Form → Global presence → Footer

---

## Development Notes

- Use inline `style` for font-family to ensure proper font application
- All spacing uses inline styles for precise control (96px, 72px, 64px)
- Tailwind classes used for layout and utilities
- React Router (not react-router-dom) for navigation
- No state management beyond basic form state
- Images from Unsplash with proper aspect ratios

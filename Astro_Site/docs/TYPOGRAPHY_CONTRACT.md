# TYPOGRAPHY_CONTRACT.md
# Source: Figma_Make_Export (React) + DESIGN_SYSTEM.md

## Fonts

- **Serif**: Cormorant Garamond (headlines)
- **Sans-serif**: Inter (body, utility, nav)

## Sizes (Tailwind)

| Element | Class | Usage |
|---------|-------|-------|
| H1 (Hero) | `text-7xl` | Home hero |
| H1 (Page) | `text-6xl` | Page titles |
| H2 (Statement) | `text-5xl` | Centered statements |
| H2 (Section) | `text-4xl` | Section headlines |
| H3 | `text-3xl` | Subsections (Overview, Origins, etc.) |
| H3 (smaller) | `text-xl`, `text-2xl` | List headers |
| Body | `text-base` | Paragraphs |
| Lead | `text-lg` | Intro paragraphs |
| Utility / Nav | `text-sm` | Links, metadata, labels |
| Metrics | `text-6xl` | Big numbers |

## Colors

- **Primary text**: `#2c2c2c` (text-[#2c2c2c])
- **Secondary text**: `#5c5c5c` (text-[#5c5c5c])
- **On dark**: white

## Spacing (Typography)

- **H1**: mb-6 (24px)
- **H2**: mb-6, mb-8, mb-10 (section-dependent)
- **H3**: mb-4, mb-6
- **Section headline → content**: 40px (marginBottom)

## Container Padding

- **All pages**: `px-8` (32px) — no breakpoint variants in React
- **max-w**: 1140px content, 1400px Header/Footer, 900px Contact

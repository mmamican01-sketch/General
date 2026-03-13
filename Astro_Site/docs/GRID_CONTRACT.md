# GRID_CONTRACT.md
# Source: Figma_Make_Export (React)

## Breakpoints

React uses Tailwind defaults. No explicit sm/md/lg in most grids — layout is 12-col at all widths with col-span collapsing via responsive classes where needed.

| Page | Grid | Gap | Breakpoint behavior |
|------|------|-----|---------------------|
| Home — Media+Text | `grid-cols-12` | `gap-12` | col-span-6, col-span-5 |
| Home — Product Groups | `grid-cols-2 md:grid-cols-5` | `gap-8` | 2 cols mobile, 5 cols desktop |
| Home — Metrics | `grid-cols-12` | `gap-8` | col-span-3 each |
| Products | `grid-cols-12` | `gap-12` | col-span-6, col-span-5 |
| ProductDetail | `grid-cols-12` | `gap-12` (overview), `gap-8` (specs) | col-span-6, col-span-5, col-span-4/8 |
| WhoWeAre | `grid-cols-12` | `gap-12`, `gap-8` | col-span-* |
| Sustainability | `grid-cols-12` | `gap-12`, `gap-8` | col-span-* |
| Careers | `grid-cols-12` | `gap-12`, `gap-8` | col-span-* |
| Contact | `grid-cols-12` | `gap-12`, `gap-8` | col-span-* |
| Footer | `grid-cols-12` | `gap-8` | col-span-3, col-span-2 |

## Container

- **Max width**: 1140px (content), 1400px (Header/Footer)
- **Padding**: `px-8` (32px) at all breakpoints

## Key Rules

- **Media+Text**: `grid-cols-12 gap-12`, image col-span-6, text col-span-5
- **Product Groups**: `grid-cols-2 md:grid-cols-5 gap-8`
- **Footer**: `grid-cols-12 gap-8`
- **Specs table**: `grid-cols-12 gap-8` with col-span-4 / col-span-8

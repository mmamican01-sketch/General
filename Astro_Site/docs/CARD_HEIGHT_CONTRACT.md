# CARD_HEIGHT_CONTRACT.md
# Source: Figma_Make_Export (React)

## Card / Banner Wrappers

React does **NOT** use fixed heights on any media cards or banners.

| Component | React Pattern | Fixed Height? |
|-----------|---------------|---------------|
| Product Groups (Home) | `aspect-[16/9]` + mb-3 | No |
| Products page rows | `aspect-[16/9]` + mb-4 | No |
| ProductDetail overview | `aspect-[16/9]` | No |
| Media+Text sections | `aspect-[16/9]` | No |

## Rules

1. **Never use** `h-[320px]`, `h-[420px]`, or similar fixed heights on media wrappers unless React explicitly uses them (it does not).
2. **Always use** `aspect-[16/9]` for all product/media images.
3. **Product image → label**: `mb-3` (12px) on Home; `mb-4` (16px) on Products page.
4. **Hero**: `h-[75vh]` is the only viewport-based height — matches React.

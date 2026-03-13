# MEDIA_RATIO_CONTRACT.md
# Source: Figma_Make_Export (React) — exact responsive rules

## Media Ratios Used Across App

| Location | Ratio | Wrapper | img classes |
|----------|-------|---------|-------------|
| Home — Institutional image | 16/9 | `w-full aspect-[16/9] bg-gray-300 overflow-hidden` | `w-full h-full object-cover` |
| Home — Product Groups cards | 16/9 | `w-full aspect-[16/9] bg-gray-200 overflow-hidden mb-3` | `w-full h-full object-cover group-hover:opacity-90 transition-opacity` |
| Home — Sustainable practices image | 16/9 | `w-full aspect-[16/9] bg-gray-300 overflow-hidden` | `w-full h-full object-cover` |
| Products — Product rows | 16/9 | `w-full aspect-[16/9] bg-gray-300 overflow-hidden mb-4` | `w-full h-full object-cover group-hover:opacity-90 transition-opacity` |
| ProductDetail — Overview image | 16/9 | `w-full aspect-[16/9] bg-gray-300 overflow-hidden` | `w-full h-full object-cover` |

## Hero Section (Special Case)

| Location | Height | Notes |
|----------|--------|-------|
| Home.tsx:35 | `h-[75vh]` | Hero section — viewport-based, not aspect ratio |

## Summary

- **All media blocks**: `aspect-[16/9]` — no 4/3, no 1/1, no fixed heights (h-[320px], h-[420px])
- **Wrapper**: `w-full aspect-[16/9] overflow-hidden` + bg (gray-200 or gray-300)
- **img**: `w-full h-full object-cover`
- **Product cards**: optional `group-hover:opacity-90 transition-opacity` on img

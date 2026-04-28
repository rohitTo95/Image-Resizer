# Image Resizer — Claude Project Guide

## Project Overview

Client-side image processing SPA built with React Router v7 (no Vite). Fully browser-based — no server, no upload to any backend. Privacy-first image optimization tool.

## Design System

- **Font:** Poppins (Google Fonts)
- **Color palette:** Classic black and white only — `#000000`, `#FFFFFF`, and neutral grays (`#111`, `#222`, `#555`, `#888`, `#ccc`, `#eee`, `#f5f5f5`)
- **Style:** Minimalistic, modern, classic. No gradients, no color accents, no decorative elements.
- **Layout:** Clean grid, generous whitespace, sharp edges or very subtle radius (≤4px)
- **Icons:** Minimal SVG or lucide-react — outline style only

## Plugin Rules

> **IMPORTANT:** For any significant UI work — new pages, new components, layout changes, visual redesigns — you MUST invoke the `ui-ux-pro-max` skill BEFORE writing UI code.

Examples of when to invoke `ui-ux-pro-max`:
- Building a new page or route
- Designing a new component (cards, panels, modals)
- Changing layout structure
- Updating the design system or typography
- Any drag-and-drop or interactive UI element

Use `superpowers:brainstorming` before any new feature or significant logic change.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Router v7 (framework mode, no Vite) |
| Bundler | TBD (webpack or parcel — user to confirm) |
| Image Processing | Canvas API, `createImageBitmap` |
| Compression | `browser-image-compression` (optional) |
| ZIP Export | JSZip |
| Workers | Web Workers (offload batch processing) |
| Font | Poppins via Google Fonts |
| State | React context + useReducer (no external lib unless needed) |

## Core Features

1. **Bulk upload** — JPG, JPEG, PNG; thumbnail + metadata on upload
2. **Auto-grouping** — by identical pixel dimensions
3. **Strict resize mode (default)** — proportional scaling only, no crop, no padding
4. **Smart resize suggestions** — percentage + common web sizes per aspect ratio
5. **Custom resize** — user inputs one dimension, other auto-calculated
6. **Crop mode (opt-in)** — explicit toggle with warning banner
7. **WebP conversion (opt-in)** — Lossless / High Quality (92) / Custom slider (80–100)
8. **Preview panel** — before/after, resolution diff, file size diff, % reduction
9. **Export** — per-group download, global ZIP, individual download
10. **Web Workers** — heavy batch work off main thread, progress indicator

## Routes (React Router v7)

```
/                  → Main app (upload + groups overview)
/group/:id         → Expanded group gallery + controls
/preview           → Preview panel (comparison view)
```

## Processing Rules (Non-Negotiable)

- Default mode: **NEVER crop**. Proportional scaling only.
- Crop only when user explicitly enables the crop toggle.
- No padding option exists anywhere.
- All processing happens in the browser — no network requests for image data.

## Conventions

- No comments unless the WHY is non-obvious
- No `console.log` left in production code
- TypeScript preferred (or PropTypes at minimum)
- Web Workers in `src/workers/` directory
- Processing utilities in `src/utils/image/`
- Routes in `src/routes/`
- Components in `src/components/`

## Memory System

See `MEMORY.md` for the project memory index.

## Updates Log

| Date | Change |
|---|---|
| 2026-04-28 | Project initialized, CLAUDE.md created |

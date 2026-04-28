# Image Resizer

A privacy-first, client-side image processing tool. Upload, group, resize, convert, and export images — entirely in the browser. No server. No uploads. No data leaves your device.

## Features

- **Bulk upload** — drag & drop or file picker, JPG/JPEG/PNG supported
- **Auto-grouping** — images automatically grouped by identical pixel dimensions
- **Strict resize mode** (default) — proportional scaling only, never crops
- **Smart suggestions** — percentage presets (100%, 75%, 50%, 25%) and common web sizes per aspect ratio (16:9, 4:3, 1:1, etc.)
- **Custom resize** — enter width or height, the other dimension auto-calculates
- **Crop mode** (opt-in) — explicit toggle with warning, exact dimension resizing
- **WebP conversion** (opt-in) — three quality modes:
  - Lossless — best for PNG/graphic sources
  - High Quality — quality 0.92, recommended for photos
  - Custom — slider from 80–100
- **Before/after preview** — resolution diff, file size diff, % reduction
- **Export** — per-image download, group ZIP, all-images ZIP
- **Web Workers** — heavy batch processing runs off the main thread with a live progress bar
- **Fully offline** — no CDN dependencies at runtime after build

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + React Router DOM v7 |
| Bundler | Webpack 5 + Babel |
| Styling | CSS Modules + CSS custom properties |
| Image processing | Canvas API, `createImageBitmap`, `OffscreenCanvas` |
| Background processing | Web Workers (Webpack 5 native worker bundling) |
| ZIP export | JSZip |
| Font | Poppins (Google Fonts) |
| State | React Context + `useReducer` |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Install

```bash
npm install
```

### Run dev server

```bash
npm start
```

Opens at `http://localhost:3000`. Hot reload is enabled.

### Production build

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server — no server-side rendering required.

```bash
# Quick local preview of the production build
npx serve dist
```

## Project Structure

```
src/
├── index.jsx                        # Entry point
├── App.jsx                          # Router setup (createBrowserRouter)
├── styles/
│   └── global.css                   # CSS variables, reset, Poppins
├── context/
│   └── ImageContext.jsx             # Global state (useReducer)
├── hooks/
│   └── useImageWorker.js            # Web Worker interface
├── workers/
│   └── imageProcessor.worker.js    # OffscreenCanvas batch processor
├── utils/image/
│   ├── metadata.js                  # Extract dimensions, aspect ratio, file size
│   ├── grouping.js                  # Group by dimensions, smart size suggestions
│   ├── resize.js                    # Proportional/crop scaling, canvas helpers
│   ├── convert.js                   # Full processing pipeline, preview generation
│   └── export.js                    # JSZip bundling, individual downloads
├── components/
│   ├── UploadZone/                  # Drag & drop upload area
│   ├── GroupCard/                   # Single dimension group card
│   ├── GroupGrid/                   # Grid of all group cards
│   ├── GalleryView/                 # Expanded image gallery with detail panel
│   ├── ControlsPanel/               # Resize suggestions, custom input, WebP toggle
│   ├── PreviewPanel/                # Before/after comparison + stats
│   ├── ExportSection/               # Download individual, group ZIP, all ZIP
│   └── ProgressBar/                 # Processing progress indicator
└── routes/
    ├── Home.jsx                     # / — upload + group overview
    ├── Group.jsx                    # /group/:id — gallery + controls
    └── Preview.jsx                  # /preview — comparison + export
```

## Routes

| Path | Description |
|---|---|
| `/` | Upload zone and group card grid |
| `/group/:id` | Expanded gallery for a dimension group with resize controls |
| `/preview` | Before/after comparison, stats, and export |

## Processing Rules

- **Default mode is strict** — proportional scaling only. The output dimensions will fit within the target, maintaining the original aspect ratio. Nothing is ever cropped or padded.
- **Crop mode** is opt-in. It must be explicitly enabled via the "Allow crop (advanced)" toggle. A warning is shown when active.
- **No padding** option exists anywhere in the app.
- All processing runs in a Web Worker via `OffscreenCanvas` to avoid blocking the main thread.

## WebP Lossless Note

Selecting **Lossless** on JPEG source images will likely produce a *larger* output file. JPEGs are already lossy-compressed — converting them to lossless WebP forces the encoder to preserve every decoded pixel faithfully, which costs more space than the original lossy representation.

Use **High Quality** (default) for photos and JPEGs. Use **Lossless** for PNGs, screenshots, and graphic assets where pixel-perfect accuracy matters.

## Design

- Font: Poppins
- Color palette: black (`#000`) / white (`#fff`) and neutral grays only — no color accents
- Style: minimalistic, modern, classic
- Layout: CSS Grid, 4pt spacing scale, sharp edges, generous whitespace
- Responsive: 1440 / 1024 / 768 / 480px breakpoints
- Accessibility: visible focus rings, ARIA labels, keyboard navigation, `prefers-reduced-motion` support

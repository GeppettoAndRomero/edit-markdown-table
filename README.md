# edit-markdown-table

Edit a GitHub-Flavored Markdown (GFM) table in a grid, entirely in your browser. Paste
an existing table to import it, or start from a blank grid. The Markdown output is
always regenerated as a clean, pipe-aligned table. Files never leave your device — there
is no server component. Open source, works offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

The GFM table parser and serializer are hand-written (`src/utils/markdownTable.ts`) —
there is no third-party Markdown-table dependency. Parsing splits a pasted header row,
separator row (`---`/`:---`/`:---:`/`---:`) and data rows on unescaped `|` characters,
un-escaping `\|` back to a literal `|`; ragged data rows are padded or truncated to the
header's column width, matching the GFM specification. The grid itself is a Preact
component with real `role="grid"`/`row`/`gridcell` ARIA semantics and keyboard
navigation (Tab, arrow keys, Enter). On every edit, the Markdown is re-derived from the
grid state and column-width aligned so every `|` lines up. This all runs synchronously on
the main thread — there is no Web Worker, since string parsing this size needs one.

## Features

- Edit a table in a grid: click a cell, type, Tab/Enter/arrow keys to move
- Paste a GFM Markdown table to import it, or start from a blank grid
- Add/remove rows and columns; set each column to left/center/right alignment
- Always outputs a clean, pipe-aligned GFM table — copy to clipboard or download as `.md`
- Handles a literal `|` inside a cell (escaped as `\|`) and ragged rows (padded/truncated)
- Works offline (PWA), installable

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
npm run test:unit
npm run test:e2e
```

Stack: Astro + Preact + TypeScript. No runtime dependency beyond Astro/Preact.

## Browser support

Works in any current browser (Chrome, Edge, Firefox, Safari) — there is no WASM or
Worker requirement, just standard DOM APIs (`Clipboard`, `Blob`, `File`).

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.

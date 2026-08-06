import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Edit Markdown Table — GFM Table Editor, No Upload | runlocally',
    description:
      'Edit a Markdown table in a grid, or paste in an existing GFM table to import it. Add and remove rows/columns, set column alignment, and get back a clean, pipe-aligned table every time. Runs in your browser, nothing is uploaded.',
    ogTitle: 'Edit Markdown Table — GFM Table Editor, No Upload',
    ogDescription:
      'Edit a GFM Markdown table in a grid and get back correctly pipe-aligned Markdown. Paste an existing table to import it. Nothing is uploaded.',
  },

  hero: {
    h1: 'Edit Markdown Table',
    tagline:
      'Edit a table in a grid and keep the Markdown pipe-aligned automatically — in your browser. Paste an existing table to start from it.',
  },

  intro: {
    h2: 'Edit GFM Markdown tables without hand-aligning pipes',
    paras: [
      'GitHub-Flavored Markdown tables are plain text, and keeping every `|` lined up by hand gets tedious the moment a cell gets longer or a row is added. This tool gives you a grid instead: click a cell and type, add or remove rows and columns with a button, and set each column to left, center or right alignment.',
      'The Markdown underneath is always regenerated from the grid, so it comes out as a clean, column-width-aligned table on every edit — you never edit the pipes by hand. Start from a blank grid, or paste an existing Markdown table into the import box to load it in and keep editing.',
    ],
  },

  privacy: {
    h2: 'Why your table stays on your device',
    lead: 'Privacy here is structural, not a promise. There is no upload step because there is no server to upload to:',
    points: [
      'Parsing, editing and re-serializing the table all happen entirely in your browser.',
      'The page is served as static files and makes no request with your table data.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: "If you want to check for yourself, open your browser's Network panel while editing — no request carries your table's contents.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Start from a blank grid or import one',
        p: 'A blank 3-column grid is ready to type into. To start from an existing table instead, paste GFM Markdown into the import box and click Import — it replaces the grid with the parsed table.',
      },
      {
        h3: 'Edit cells',
        p: 'Click a cell and type. Tab, Enter and the arrow keys move between cells, like a spreadsheet.',
      },
      {
        h3: 'Add, remove and align columns',
        p: 'Use the row and column buttons to add or remove them, and each column header has a left/center/right alignment control that maps to the Markdown separator row.',
      },
      {
        h3: 'Copy or download the Markdown',
        p: 'The Markdown preview below the grid is always a clean, pipe-aligned table. Copy it to the clipboard or download it as a .md file.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my table uploaded anywhere?',
      a: "No. Parsing, editing and re-serializing all happen entirely in your browser. There is no server component, so your table has no path off your device. The source is open and you can confirm this in your browser's Network panel.",
    },
    {
      q: 'How does it handle a `|` character inside a cell?',
      a: 'A literal `|` you type into a cell is automatically escaped as `\\|` when the Markdown is generated, and unescaped back to `|` when a table is imported, so it displays correctly in the grid either way.',
    },
    {
      q: 'What happens if I paste a table with a ragged row (wrong number of cells)?',
      a: "It's handled the way GitHub itself handles it: a row with fewer cells than the header is padded with empty cells, and a row with more cells has the extra ones dropped. Nothing crashes or gets silently corrupted.",
    },
    {
      q: 'Can a cell contain a line break?',
      a: "No — GFM table cells are single-line by design. If you paste text with a line break into a cell, it's replaced with a space rather than silently breaking the table structure.",
    },
    {
      q: 'Does this tool render or preview other Markdown, like headings or links?',
      a: "No, it's scoped to table editing only. If you need to preview a full Markdown document, that's a separate, dedicated viewer tool.",
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so editing works without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer's.",
    securityText: 'Security',
  },

  related: {
    h2: 'Related tools',
    blogLinkText: 'Read the technical notes',
  },
};

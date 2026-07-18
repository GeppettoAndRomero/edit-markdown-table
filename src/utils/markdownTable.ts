/**
 * GFM (GitHub-Flavored Markdown) table engine: parse, serialize, and small pure
 * edit operations on the in-memory grid. No external dependency — GFM table
 * syntax is simple enough to hand-roll (a header row, a `|`/`-`/`:` separator
 * row, then zero or more data rows).
 *
 * Escaping contract: a cell's stored/display text is always the *unescaped*
 * form (a literal `|` reads as `|`). `\|` only ever appears in the serialized
 * Markdown string, never in TableData. This is the single invariant that
 * keeps parse -> edit -> serialize -> parse round trips lossless: the
 * serializer blindly escapes every `|` it emits, and the parser un-escapes
 * exactly (and only) the two-character sequence `\|`, so a pre-existing
 * backslash in user text that isn't followed by `|` is never touched by
 * either side.
 */

export type Alignment = 'left' | 'center' | 'right';

export interface TableData {
  header: string[];
  alignments: Alignment[];
  rows: string[][];
}

export const DEFAULT_COLUMNS = 3;
export const DEFAULT_DATA_ROWS = 2;

/** A fresh table to start building from scratch (default: 3 columns x 2 blank data rows). */
export function createBlankTable(columns: number = DEFAULT_COLUMNS, dataRows: number = DEFAULT_DATA_ROWS): TableData {
  const cols = Math.max(1, columns);
  return {
    header: Array.from({ length: cols }, () => ''),
    alignments: Array.from({ length: cols }, () => 'left' as Alignment),
    rows: Array.from({ length: Math.max(0, dataRows) }, () => Array.from({ length: cols }, () => '')),
  };
}

/** GFM cells cannot contain a literal newline; collapse any into a single space. */
export function sanitizeCellInput(value: string): string {
  return value.replace(/\r\n|\r|\n/g, ' ');
}

/**
 * Split one `|`-delimited table row into unescaped cell strings.
 * Handles an optional leading/trailing pipe and un-escapes `\|` -> `|` as it
 * scans (this is the one and only place that happens on the parse side).
 */
export function splitTableRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (endsWithUnescapedPipe(s)) s = s.slice(0, -1);

  const cells: string[] = [];
  let current = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '\\' && s[i + 1] === '|') {
      current += '|';
      i++; // consume the escaped pipe too
      continue;
    }
    if (ch === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

/** True if `s` ends with a `|` that is a real delimiter (not escaped as `\|`). */
function endsWithUnescapedPipe(s: string): boolean {
  if (!s.endsWith('|')) return false;
  let backslashes = 0;
  for (let i = s.length - 2; i >= 0 && s[i] === '\\'; i--) backslashes++;
  return backslashes % 2 === 0;
}

/** True if a (trimmed) separator cell matches GFM's `:?-+:?` pattern. */
export function isSeparatorCell(cell: string): boolean {
  return /^:?-+:?$/.test(cell.trim());
}

/** The column alignment a separator cell encodes. */
export function alignmentFromSeparatorCell(cell: string): Alignment {
  const t = cell.trim();
  const left = t.startsWith(':');
  const right = t.endsWith(':');
  if (left && right) return 'center';
  if (right) return 'right';
  return 'left';
}

/**
 * Parse a pasted GFM table. Returns `null` if the input doesn't look like a
 * table at all (no header + valid separator row found) rather than throwing —
 * callers show that as an import error.
 *
 * Ragged data rows are handled per the GFM spec: short rows are padded with
 * empty cells, long rows are truncated to the header's column count.
 */
export function parseMarkdownTable(input: string): TableData | null {
  const lines = input.split(/\r\n|\r|\n/).filter((l) => l.trim() !== '');
  if (lines.length < 2) return null;

  const header = splitTableRow(lines[0]);
  if (header.length === 0) return null;

  const sepCells = splitTableRow(lines[1]);
  if (sepCells.length === 0 || !sepCells.every(isSeparatorCell)) return null;

  const alignments: Alignment[] = header.map((_, i) =>
    alignmentFromSeparatorCell(sepCells[i] ?? '-')
  );

  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = splitTableRow(lines[i]);
    rows.push(Array.from({ length: header.length }, (_, c) => cells[c] ?? ''));
  }

  return { header, alignments, rows };
}

/** Escape a cell for output: literal `|` -> `\|`. Defensive newline strip too. */
export function escapeCell(text: string): string {
  return sanitizeCellInput(text).replace(/\|/g, '\\|');
}

function padCell(text: string, width: number, align: Alignment): string {
  const gap = width - text.length;
  if (gap <= 0) return text;
  if (align === 'right') return ' '.repeat(gap) + text;
  if (align === 'center') {
    const left = Math.floor(gap / 2);
    const right = gap - left;
    return ' '.repeat(left) + text + ' '.repeat(right);
  }
  return text + ' '.repeat(gap);
}

function separatorCell(width: number, align: Alignment): string {
  if (align === 'center') return ':' + '-'.repeat(Math.max(1, width - 2)) + ':';
  if (align === 'right') return '-'.repeat(Math.max(1, width - 1)) + ':';
  return '-'.repeat(width);
}

/**
 * Serialize a table to canonical, pipe-aligned GFM Markdown: every column is
 * padded (per its alignment) to the widest cell in that column, so every `|`
 * lines up vertically. This re-alignment on every call is the tool's whole
 * point, not an optional nicety.
 */
export function serializeTable(data: TableData): string {
  const cols = data.header.length;
  if (cols === 0) return '';

  const escHeader = data.header.map(escapeCell);
  const escRows = data.rows.map((row) => Array.from({ length: cols }, (_, c) => escapeCell(row[c] ?? '')));

  const widths = Array.from({ length: cols }, (_, c) => {
    let w = Math.max(3, escHeader[c].length);
    for (const row of escRows) w = Math.max(w, row[c].length);
    return w;
  });

  const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
  const alignAt = (c: number): Alignment => data.alignments[c] ?? 'left';

  const headerLine = line(escHeader.map((h, c) => padCell(h, widths[c], alignAt(c))));
  const sepLine = line(widths.map((w, c) => separatorCell(w, alignAt(c))));
  const dataLines = escRows.map((row) => line(row.map((cell, c) => padCell(cell, widths[c], alignAt(c)))));

  return [headerLine, sepLine, ...dataLines].join('\n');
}

// ---- Pure edit operations (widget calls setState(op(prev, ...))) ----------

export function setHeaderCell(data: TableData, index: number, value: string): TableData {
  if (index < 0 || index >= data.header.length) return data;
  const header = [...data.header];
  header[index] = sanitizeCellInput(value);
  return { ...data, header };
}

export function setCell(data: TableData, rowIndex: number, colIndex: number, value: string): TableData {
  if (rowIndex < 0 || rowIndex >= data.rows.length) return data;
  if (colIndex < 0 || colIndex >= data.header.length) return data;
  const rows = data.rows.map((row, r) => {
    if (r !== rowIndex) return row;
    const next = [...row];
    next[colIndex] = sanitizeCellInput(value);
    return next;
  });
  return { ...data, rows };
}

export function setAlignment(data: TableData, index: number, alignment: Alignment): TableData {
  if (index < 0 || index >= data.alignments.length) return data;
  const alignments = [...data.alignments];
  alignments[index] = alignment;
  return { ...data, alignments };
}

export function addRow(data: TableData): TableData {
  const blank = Array.from({ length: data.header.length }, () => '');
  return { ...data, rows: [...data.rows, blank] };
}

export function removeRow(data: TableData, index: number): TableData {
  if (index < 0 || index >= data.rows.length) return data;
  return { ...data, rows: data.rows.filter((_, r) => r !== index) };
}

export function addColumn(data: TableData): TableData {
  return {
    header: [...data.header, ''],
    alignments: [...data.alignments, 'left'],
    rows: data.rows.map((row) => [...row, '']),
  };
}

/** No-op if this would remove the table's only remaining column. */
export function removeColumn(data: TableData, index: number): TableData {
  if (data.header.length <= 1) return data;
  if (index < 0 || index >= data.header.length) return data;
  return {
    header: data.header.filter((_, c) => c !== index),
    alignments: data.alignments.filter((_, c) => c !== index),
    rows: data.rows.map((row) => row.filter((_, c) => c !== index)),
  };
}

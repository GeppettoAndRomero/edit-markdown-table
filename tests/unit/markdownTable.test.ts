import { describe, it, expect } from 'vitest';
import {
  createBlankTable,
  parseMarkdownTable,
  serializeTable,
  splitTableRow,
  isSeparatorCell,
  alignmentFromSeparatorCell,
  escapeCell,
  sanitizeCellInput,
  addRow,
  removeRow,
  addColumn,
  removeColumn,
  setAlignment,
  setHeaderCell,
  setCell,
  type TableData,
} from '@/utils/markdownTable';

describe('createBlankTable', () => {
  it('defaults to 3 columns and 2 blank data rows', () => {
    const t = createBlankTable();
    expect(t.header).toEqual(['', '', '']);
    expect(t.alignments).toEqual(['left', 'left', 'left']);
    expect(t.rows).toEqual([
      ['', '', ''],
      ['', '', ''],
    ]);
  });

  it('clamps to at least 1 column and 0 rows', () => {
    const t = createBlankTable(0, -3);
    expect(t.header.length).toBe(1);
    expect(t.rows).toEqual([]);
  });
});

describe('splitTableRow', () => {
  it('splits a row with leading and trailing pipes', () => {
    expect(splitTableRow('| a | b | c |')).toEqual(['a', 'b', 'c']);
  });

  it('splits a row with no leading/trailing pipes', () => {
    expect(splitTableRow('a | b | c')).toEqual(['a', 'b', 'c']);
  });

  it('un-escapes \\| to a literal | inside a cell', () => {
    expect(splitTableRow('| a\\|b | c |')).toEqual(['a|b', 'c']);
  });

  it('keeps an escaped trailing pipe as cell content, not a delimiter', () => {
    expect(splitTableRow('| a | ends\\|')).toEqual(['a', 'ends|']);
  });

  it('trims whitespace around cells', () => {
    expect(splitTableRow('|  a  |  b  |')).toEqual(['a', 'b']);
  });

  it('treats a line with no pipes as a single cell', () => {
    expect(splitTableRow('just text')).toEqual(['just text']);
  });
});

describe('isSeparatorCell / alignmentFromSeparatorCell', () => {
  it('accepts plain dashes, and colon variants', () => {
    expect(isSeparatorCell('---')).toBe(true);
    expect(isSeparatorCell(':---')).toBe(true);
    expect(isSeparatorCell(':---:')).toBe(true);
    expect(isSeparatorCell('---:')).toBe(true);
    expect(isSeparatorCell('-')).toBe(true);
  });

  it('rejects non-separator content', () => {
    expect(isSeparatorCell('abc')).toBe(false);
    expect(isSeparatorCell('')).toBe(false);
    expect(isSeparatorCell('--x--')).toBe(false);
  });

  it('maps colon placement to alignment', () => {
    expect(alignmentFromSeparatorCell('---')).toBe('left');
    expect(alignmentFromSeparatorCell(':---')).toBe('left');
    expect(alignmentFromSeparatorCell(':---:')).toBe('center');
    expect(alignmentFromSeparatorCell('---:')).toBe('right');
  });
});

describe('parseMarkdownTable', () => {
  it('parses a well-formed table with a header, separator and data rows', () => {
    const md = ['| Name | Age |', '| --- | ---: |', '| Ada | 30 |', '| Grace | 40 |'].join('\n');
    const t = parseMarkdownTable(md);
    expect(t).toEqual({
      header: ['Name', 'Age'],
      alignments: ['left', 'right'],
      rows: [
        ['Ada', '30'],
        ['Grace', '40'],
      ],
    });
  });

  it('reads alignment markers for left/center/right', () => {
    const md = ['| A | B | C |', '| :-- | :-: | --: |', '| 1 | 2 | 3 |'].join('\n');
    const t = parseMarkdownTable(md);
    expect(t?.alignments).toEqual(['left', 'center', 'right']);
  });

  it('un-escapes a literal | inside a data cell', () => {
    const md = ['| A | B |', '| --- | --- |', '| a\\|b | c |'].join('\n');
    const t = parseMarkdownTable(md);
    expect(t?.rows[0]).toEqual(['a|b', 'c']);
  });

  it('pads a short (ragged) data row with empty cells', () => {
    const md = ['| A | B | C |', '| --- | --- | --- |', '| only-one |'].join('\n');
    const t = parseMarkdownTable(md);
    expect(t?.rows[0]).toEqual(['only-one', '', '']);
  });

  it('truncates a long (ragged) data row to the header width', () => {
    const md = ['| A | B |', '| --- | --- |', '| 1 | 2 | 3 | 4 |'].join('\n');
    const t = parseMarkdownTable(md);
    expect(t?.rows[0]).toEqual(['1', '2']);
  });

  it('ignores blank lines around and within the pasted text', () => {
    const md = ['', '| A | B |', '| --- | --- |', '', '| 1 | 2 |', ''].join('\n');
    const t = parseMarkdownTable(md);
    expect(t?.rows).toEqual([['1', '2']]);
  });

  it('imports a table with no data rows (header + separator only)', () => {
    const md = ['| A | B |', '| --- | --- |'].join('\n');
    const t = parseMarkdownTable(md);
    expect(t?.rows).toEqual([]);
  });

  it('returns null for input with fewer than 2 lines', () => {
    expect(parseMarkdownTable('just one line')).toBeNull();
    expect(parseMarkdownTable('')).toBeNull();
  });

  it('returns null when the second line is not a valid separator row', () => {
    const md = ['| A | B |', '| not a separator |', '| 1 | 2 |'].join('\n');
    expect(parseMarkdownTable(md)).toBeNull();
  });

  it('returns null for arbitrary prose with no table syntax', () => {
    const md = ['This is a paragraph.', 'It has two lines but no pipes at all.'].join('\n');
    expect(parseMarkdownTable(md)).toBeNull();
  });
});

describe('escapeCell / sanitizeCellInput', () => {
  it('escapes a literal pipe', () => {
    expect(escapeCell('a|b')).toBe('a\\|b');
  });

  it('replaces embedded newlines with a space', () => {
    expect(sanitizeCellInput('a\nb\r\nc')).toBe('a b c');
    expect(escapeCell('a\nb')).toBe('a b');
  });

  it('leaves plain text and stray backslashes untouched', () => {
    expect(escapeCell('plain text')).toBe('plain text');
    expect(escapeCell('C:\\Users')).toBe('C:\\Users');
  });
});

describe('serializeTable', () => {
  it('produces a clean, pipe-aligned table with padded columns', () => {
    const data: TableData = {
      header: ['Name', 'Age'],
      alignments: ['left', 'left'],
      rows: [
        ['Ada', '30'],
        ['Grace Hopper', '40'],
      ],
    };
    const out = serializeTable(data);
    expect(out).toBe(
      [
        '| Name         | Age |',
        '| ------------ | --- |',
        '| Ada          | 30  |',
        '| Grace Hopper | 40  |',
      ].join('\n')
    );
  });

  it('right-pads left, left-pads right, and centers center-aligned columns', () => {
    const data: TableData = {
      header: ['L', 'C', 'R'],
      alignments: ['left', 'center', 'right'],
      rows: [['x', 'x', 'x']],
    };
    const out = serializeTable(data);
    const lines = out.split('\n');
    expect(lines[1]).toBe('| --- | :-: | --: |');
    // data row: left cell padded on the right, right cell padded on the left,
    // center cell padded on both sides (or as close to even as an odd gap allows).
    expect(lines[2]).toBe('| x   |  x  |   x |');
  });

  it('escapes a literal | in output and keeps column widths in sync', () => {
    const data: TableData = {
      header: ['A'],
      alignments: ['left'],
      rows: [['a|b']],
    };
    const out = serializeTable(data);
    expect(out).toContain('a\\|b');
    // The escaped form (4 chars) sets the column width, so pipes still line up.
    const lines = out.split('\n');
    expect(lines.every((l) => l.length === lines[0].length)).toBe(true);
  });

  it('every separator dash-run is at least 3 wide even for short content', () => {
    const data: TableData = { header: ['x'], alignments: ['left'], rows: [] };
    expect(serializeTable(data).split('\n')[1]).toBe('| --- |');
  });

  it('returns an empty string for a table with zero columns', () => {
    expect(serializeTable({ header: [], alignments: [], rows: [] })).toBe('');
  });

  it('round-trips: parse -> serialize -> parse yields the same data (escaped pipe + ragged row)', () => {
    const md = ['| Name | Note |', '| --- | ---: |', '| a\\|b | short |', '| only one cell |'].join('\n');
    const first = parseMarkdownTable(md);
    expect(first).not.toBeNull();
    const reserialized = serializeTable(first as TableData);
    // Re-serialized output is clean GFM: every line the same length (aligned pipes).
    const lines = reserialized.split('\n');
    expect(lines.every((l) => l.length === lines[0].length)).toBe(true);
    const second = parseMarkdownTable(reserialized);
    expect(second).toEqual(first);
    // And the literal pipe survived the whole round trip, unescaped for display.
    expect(second?.rows[0][0]).toBe('a|b');
  });
});

describe('edit operations', () => {
  const base = (): TableData => createBlankTable(2, 1);

  it('setHeaderCell / setCell update the right slot only', () => {
    let t = base();
    t = setHeaderCell(t, 0, 'Name');
    t = setCell(t, 0, 1, 'x');
    expect(t.header).toEqual(['Name', '']);
    expect(t.rows[0]).toEqual(['', 'x']);
  });

  it('setHeaderCell/setCell strip newlines via sanitizeCellInput', () => {
    let t = base();
    t = setHeaderCell(t, 0, 'a\nb');
    expect(t.header[0]).toBe('a b');
  });

  it('setHeaderCell/setCell are no-ops on an out-of-range index', () => {
    const t = base();
    expect(setHeaderCell(t, 5, 'x')).toBe(t);
    expect(setCell(t, 5, 0, 'x')).toBe(t);
    expect(setCell(t, 0, 5, 'x')).toBe(t);
  });

  it('setAlignment updates one column', () => {
    let t = base();
    t = setAlignment(t, 1, 'right');
    expect(t.alignments).toEqual(['left', 'right']);
  });

  it('addRow appends a blank row matching the column count', () => {
    let t = base();
    t = addRow(t);
    expect(t.rows.length).toBe(2);
    expect(t.rows[1]).toEqual(['', '']);
  });

  it('removeRow removes the given row and is a no-op out of range', () => {
    let t = addRow(base());
    t = removeRow(t, 0);
    expect(t.rows.length).toBe(1);
    expect(removeRow(t, 99)).toBe(t);
  });

  it('addColumn appends a column to header, alignments, and every row', () => {
    let t = base();
    t = addColumn(t);
    expect(t.header.length).toBe(3);
    expect(t.alignments).toEqual(['left', 'left', 'left']);
    expect(t.rows[0]).toEqual(['', '', '']);
  });

  it('removeColumn removes a column everywhere', () => {
    let t = base();
    t = removeColumn(t, 0);
    expect(t.header.length).toBe(1);
    expect(t.alignments.length).toBe(1);
    expect(t.rows[0].length).toBe(1);
  });

  it('removeColumn refuses to remove the last remaining column', () => {
    const t = createBlankTable(1, 1);
    expect(removeColumn(t, 0)).toBe(t);
  });
});

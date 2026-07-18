/**
 * MarkdownTableEditor — the tool's only non-frozen widget.
 *
 * A spreadsheet-like grid (native <table> with explicit ARIA grid/row/cell
 * roles) backed by `TableData` (src/utils/markdownTable.ts). Every edit —
 * typing a cell, adding/removing a row or column, changing a column's
 * alignment — updates that state, and the canonical GFM Markdown shown below
 * the grid is re-derived from it on every render via `serializeTable`. That
 * re-alignment is the whole point of the tool: the output is always cleanly
 * pipe-aligned, never hand-maintained.
 *
 * Two ways to start: paste GFM Markdown into the import textarea (or drop a
 * .md/.txt file anywhere on the page, via the frozen GlobalDropZone), or just
 * start typing into the blank default grid.
 *
 * Keyboard: Tab moves through cells in natural DOM order (each cell is a real
 * <input>, so this is native browser behaviour). Arrow Up/Down always move
 * focus a row; Arrow Left/Right move a column only when the caret is already
 * at that edge of the cell's text (so editing within a cell isn't hijacked).
 * Enter moves down, like a spreadsheet.
 */
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import type { JSX } from 'preact';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { ErrorToast } from './ErrorToast';
import { isAcceptedTableFile } from '@/utils/fileValidation';
import {
  createBlankTable,
  parseMarkdownTable,
  serializeTable,
  addRow,
  removeRow,
  addColumn,
  removeColumn,
  setAlignment,
  setHeaderCell,
  setCell,
  type TableData,
  type Alignment,
} from '@/utils/markdownTable';
import { ui } from '@/i18n/ui';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface MarkdownTableEditorProps {
  locale?: string;
}

/** row === -1 addresses the header row; row >= 0 addresses a data row. */
function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

export function MarkdownTableEditor({ locale = 'en' }: MarkdownTableEditorProps) {
  const t = (ui as any)[locale] ?? ui.en;

  const [data, setData] = useState<TableData>(() => createBlankTable());
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  const cellRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setErrorToasts((prev) => [...prev, { id, message }]);
  }, []);
  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const markdown = serializeTable(data);

  // ---- import (paste text, or a dropped/picked .md/.txt file) -----------

  const importMarkdown = useCallback(
    (text: string): boolean => {
      const parsed = parseMarkdownTable(text);
      if (!parsed) {
        setImportError(t.errImportInvalid);
        return false;
      }
      setData(parsed);
      setImportError(null);
      return true;
    },
    [t]
  );

  const handleImportClick = () => {
    if (importMarkdown(importText)) setImportText('');
  };

  const handleFilesDropped = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      if (!isAcceptedTableFile(file)) {
        showErrorToast(t.errUnsupportedImportFile.replace('{name}', file.name));
        return;
      }
      const text = await file.text();
      if (!importMarkdown(text)) {
        showErrorToast(t.errImportInvalid);
      }
      window.dispatchEvent(new CustomEvent('filesProcessed'));
    },
    [importMarkdown, showErrorToast, t]
  );

  useEffect(() => {
    const handler = (e: Event) => void handleFilesDropped((e as CustomEvent<File[]>).detail ?? []);
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFilesDropped]);

  // ---- grid edits ----------------------------------------------------

  const cols = data.header.length;

  const focusCell = (row: number, col: number) => {
    const el = cellRefs.current.get(cellKey(row, col));
    el?.focus();
  };

  const handleHeaderInput = (col: number, value: string) => setData((d) => setHeaderCell(d, col, value));
  const handleCellInput = (row: number, col: number, value: string) => setData((d) => setCell(d, row, col, value));
  const handleAlignChange = (col: number, alignment: Alignment) => setData((d) => setAlignment(d, col, alignment));
  const handleAddRow = () => setData((d) => addRow(d));
  const handleRemoveRow = (row: number) => setData((d) => removeRow(d, row));
  const handleAddColumn = () => setData((d) => addColumn(d));
  const handleRemoveColumn = (col: number) => setData((d) => removeColumn(d, col));
  const handleStartOver = () => {
    setData(createBlankTable());
    setImportError(null);
  };

  const lastRow = data.rows.length - 1;

  const handleCellKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    const input = e.currentTarget;
    const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
    const atEnd = input.selectionStart === input.value.length && input.selectionEnd === input.value.length;

    switch (e.key) {
      case 'ArrowUp':
        if (row > -1) {
          e.preventDefault();
          focusCell(row - 1, col);
        }
        break;
      case 'ArrowDown':
        if (row < lastRow) {
          e.preventDefault();
          focusCell(row + 1, col);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (row < lastRow) focusCell(row + 1, col);
        break;
      case 'ArrowLeft':
        if (atStart && col > 0) {
          e.preventDefault();
          focusCell(row, col - 1);
        }
        break;
      case 'ArrowRight':
        if (atEnd && col < cols - 1) {
          e.preventDefault();
          focusCell(row, col + 1);
        }
        break;
    }
  };

  // ---- copy / download -------------------------------------------------

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const registerRef = (row: number, col: number) => (el: HTMLInputElement | null) => {
    const key = cellKey(row, col);
    if (el) cellRefs.current.set(key, el);
    else cellRefs.current.delete(key);
  };

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.importHeading}
          </h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">{t.importSubtitle}</p>
        </div>
        <textarea
          id="import-textarea"
          class="app-field__textarea"
          style="width: 100%; min-height: 100px; font-family: ui-monospace, monospace; font-size: var(--fs-2);"
          placeholder={t.importPlaceholder}
          value={importText}
          onInput={(e) => setImportText((e.target as HTMLTextAreaElement).value)}
        />
        {importError && (
          <p role="alert" style="color: var(--color-danger); font-size: var(--fs-2); margin: var(--space-2) 0 0 0;">
            {importError}
          </p>
        )}
        <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3);">
          <button
            id="import-action"
            type="button"
            class="app-button app-button--primary"
            disabled={!importText.trim()}
            onClick={handleImportClick}
          >
            {t.importButton}
          </button>
          {importText && (
            <AppButton variant="secondary" onClick={() => { setImportText(''); setImportError(null); }}>
              {t.clearImport}
            </AppButton>
          )}
        </div>
      </AppCard>

      <AppCard className="mt-6">
        <div style="display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-4);">
          <div>
            <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.gridHeading}</h2>
            <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">{t.gridSubtitle}</p>
          </div>
          <button type="button" class="app-button app-button--secondary" onClick={handleStartOver}>
            {t.startOver}
          </button>
        </div>

        <div class="mt-grid-scroll">
          <table role="grid" aria-label={t.gridAria} class="mt-grid" data-testid="table-grid">
            <thead>
              <tr role="row">
                <th role="columnheader" scope="col" class="mt-gutter">
                  <span class="visually-hidden">{t.rowControlsHeader}</span>
                </th>
                {data.header.map((h, c) => (
                  <th role="columnheader" scope="col" key={c}>
                    <div class="mt-headcell">
                      <input
                        ref={registerRef(-1, c)}
                        class="mt-cell-input"
                        aria-label={t.headerCellAria.replace('{n}', String(c + 1))}
                        value={h}
                        data-testid={`header-input-${c}`}
                        onInput={(e) => handleHeaderInput(c, (e.target as HTMLInputElement).value)}
                        onKeyDown={(e) => handleCellKeyDown(e, -1, c)}
                      />
                      <div class="mt-colctrls">
                        <select
                          class="mt-align-select"
                          aria-label={t.alignLabel.replace('{n}', String(c + 1))}
                          value={data.alignments[c]}
                          data-testid={`align-select-${c}`}
                          onChange={(e) => handleAlignChange(c, (e.target as HTMLSelectElement).value as Alignment)}
                        >
                          <option value="left">{t.alignLeft}</option>
                          <option value="center">{t.alignCenter}</option>
                          <option value="right">{t.alignRight}</option>
                        </select>
                        <button
                          type="button"
                          class="mt-icon-btn"
                          aria-label={t.removeColumnAria.replace('{n}', String(c + 1))}
                          disabled={cols <= 1}
                          onClick={() => handleRemoveColumn(c)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, r) => (
                <tr role="row" key={r}>
                  <th role="rowheader" scope="row" class="mt-gutter">
                    <button
                      type="button"
                      class="mt-icon-btn"
                      aria-label={t.removeRowAria.replace('{n}', String(r + 1))}
                      onClick={() => handleRemoveRow(r)}
                    >
                      ×
                    </button>
                  </th>
                  {row.map((cell, c) => (
                    <td role="gridcell" key={c}>
                      <input
                        ref={registerRef(r, c)}
                        class="mt-cell-input"
                        aria-label={t.cellAria.replace('{row}', String(r + 1)).replace('{col}', String(c + 1))}
                        value={cell}
                        data-testid={`cell-input-${r}-${c}`}
                        onInput={(e) => handleCellInput(r, c, (e.target as HTMLInputElement).value)}
                        onKeyDown={(e) => handleCellKeyDown(e, r, c)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
          <button id="add-row-action" type="button" class="app-button app-button--secondary" onClick={handleAddRow}>
            {t.addRow}
          </button>
          <button id="add-column-action" type="button" class="app-button app-button--secondary" onClick={handleAddColumn}>
            {t.addColumn}
          </button>
        </div>
      </AppCard>

      <AppCard className="mt-6">
        <div style="margin-bottom: var(--space-3);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.outputHeading}</h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">{t.outputHint}</p>
        </div>
        <pre class="mt-output" data-testid="markdown-output">{markdown}</pre>
        <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;">
          <button id="copy-action" type="button" class="app-button app-button--primary" onClick={handleCopy}>
            {copyStatus === 'copied' ? t.copied : t.copyMarkdown}
          </button>
          <button id="download-action" type="button" class="app-button app-button--secondary" onClick={handleDownload}>
            {t.downloadMd}
          </button>
        </div>
        {copyStatus === 'error' && (
          <p role="alert" style="color: var(--color-danger); font-size: var(--fs-2); margin: var(--space-2) 0 0 0;">
            {t.copyFailed}
          </p>
        )}
      </AppCard>

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast key={toast.id} id={toast.id} message={toast.message} onClose={removeErrorToast} locale={locale} />
          ))}
        </div>
      )}

      <style>{`
        .mt-grid-scroll {
          overflow-x: auto;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .mt-grid {
          border-collapse: collapse;
          width: 100%;
        }
        .mt-grid th,
        .mt-grid td {
          border: 1px solid var(--color-border);
          padding: var(--space-2);
          vertical-align: top;
        }
        .mt-grid thead th {
          background: var(--color-surface);
        }
        .mt-gutter {
          width: 36px;
          text-align: center;
          background: var(--color-surface);
        }
        .mt-headcell {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          min-width: 140px;
        }
        .mt-colctrls {
          display: flex;
          gap: var(--space-1);
          align-items: center;
        }
        .mt-cell-input {
          width: 100%;
          min-width: 100px;
          box-sizing: border-box;
          padding: var(--space-1) var(--space-2);
          font-size: var(--fs-2);
          font-family: inherit;
          color: var(--color-text);
          background: var(--color-bg);
          border: 1px solid transparent;
          border-radius: var(--radius-xs);
        }
        .mt-cell-input:focus {
          outline: none;
          border-color: var(--color-focus);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-focus) 20%, transparent);
        }
        .mt-align-select {
          flex: 1;
          font-size: var(--fs-1);
          padding: 2px 4px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xs);
          background: var(--color-bg);
          color: var(--color-text);
        }
        .mt-icon-btn {
          width: 24px;
          height: 24px;
          line-height: 1;
          font-size: var(--fs-2);
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xs);
          color: var(--color-danger);
          cursor: pointer;
          flex-shrink: 0;
        }
        .mt-icon-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .mt-output {
          white-space: pre;
          overflow-x: auto;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          font-family: ui-monospace, monospace;
          font-size: var(--fs-2);
          margin: 0;
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}

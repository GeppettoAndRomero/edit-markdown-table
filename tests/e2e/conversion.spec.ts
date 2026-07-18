import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { waitReady } from './_helpers';

test.describe('grid editing, import, and export', () => {
  test('builds a table from the blank grid and downloads a clean, pipe-aligned .md, with no upload', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (!url.startsWith('http://localhost:4321') && !url.startsWith('data:') && !url.startsWith('blob:')) {
        external.push(url);
      }
    });

    await page.goto('/edit-markdown-table/');
    await waitReady(page);

    // Default blank grid is 3 columns x 2 data rows.
    await expect(page.locator('[data-testid^="header-input-"]')).toHaveCount(3);
    await expect(page.locator('[data-testid^="cell-input-0-"]')).toHaveCount(3);
    await expect(page.locator('[data-testid^="cell-input-1-"]')).toHaveCount(3);

    await page.fill('[data-testid="header-input-0"]', 'Name');
    await page.fill('[data-testid="header-input-1"]', 'Age');
    await page.fill('[data-testid="cell-input-0-0"]', 'Ada');
    await page.fill('[data-testid="cell-input-0-1"]', '30');
    await page.fill('[data-testid="cell-input-1-0"]', 'Grace Hopper');
    await page.fill('[data-testid="cell-input-1-1"]', '40');

    const output = page.locator('[data-testid="markdown-output"]');
    await expect(output).toContainText('Grace Hopper');

    const text = (await output.textContent()) ?? '';
    const lines = text.split('\n').filter((l) => l.length > 0);
    expect(lines.length).toBeGreaterThanOrEqual(4); // header + separator + 2 data rows
    // Every line is the same length: pipes are vertically aligned.
    expect(lines.every((l) => l.length === lines[0].length)).toBe(true);
    expect(lines[1]).toMatch(/^\|( -+ \|)+$/);

    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await page.click('#download-action');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('table.md');
    const buf = readFileSync((await download.path()) as string);
    const downloaded = buf.toString('utf-8');
    expect(downloaded.trim()).toBe(text.trim());
    expect(downloaded).toContain('Grace Hopper');

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('adds/removes rows and columns, and changes column alignment', async ({ page }) => {
    await page.goto('/edit-markdown-table/');
    await waitReady(page);

    await page.click('#add-row-action');
    await expect(page.locator('[data-testid^="cell-input-2-"]')).toHaveCount(3);

    await page.click('#add-column-action');
    await expect(page.locator('[data-testid^="header-input-"]')).toHaveCount(4);
    await expect(page.locator('[data-testid^="cell-input-0-"]')).toHaveCount(4);

    await page.getByRole('button', { name: /remove row 3/i }).click();
    await expect(page.locator('[data-testid^="cell-input-2-"]')).toHaveCount(0);

    await page.getByRole('button', { name: /remove column 4/i }).click();
    await expect(page.locator('[data-testid^="header-input-"]')).toHaveCount(3);

    // Set the first column to right alignment and confirm the separator row reflects it.
    await page.locator('[data-testid="align-select-0"]').selectOption('right');
    const output = page.locator('[data-testid="markdown-output"]');
    const text = (await output.textContent()) ?? '';
    const sepLine = text.split('\n')[1];
    expect(sepLine.split('|')[1].trim()).toMatch(/^-+:$/);
  });

  test('a single remaining column cannot be removed', async ({ page }) => {
    await page.goto('/edit-markdown-table/');
    await waitReady(page);
    await page.getByRole('button', { name: /remove column 3/i }).click();
    await page.getByRole('button', { name: /remove column 2/i }).click();
    await expect(page.locator('[data-testid^="header-input-"]')).toHaveCount(1);
    await expect(page.getByRole('button', { name: /remove column 1/i })).toBeDisabled();
  });

  test('imports a pasted table with an escaped pipe and a ragged row, then re-serializes cleanly', async ({ page }) => {
    await page.goto('/edit-markdown-table/');
    await waitReady(page);

    const pasted = [
      '| Name | Note | Extra |',
      '| --- | ---: | :-: |',
      '| a\\|b | short | x |',
      '| only one cell |',
    ].join('\n');

    await page.fill('#import-textarea', pasted);
    await page.click('#import-action');

    // The escaped pipe is unescaped for display in the grid.
    await expect(page.locator('[data-testid="cell-input-0-0"]')).toHaveValue('a|b');
    // The ragged second row is padded with empty cells, not dropped or crashed.
    await expect(page.locator('[data-testid^="cell-input-1-"]')).toHaveCount(3);
    await expect(page.locator('[data-testid="cell-input-1-0"]')).toHaveValue('only one cell');
    await expect(page.locator('[data-testid="cell-input-1-1"]')).toHaveValue('');

    // Alignment from the separator row carried over: center-select on column 3.
    await expect(page.locator('[data-testid="align-select-2"]')).toHaveValue('center');

    const output = page.locator('[data-testid="markdown-output"]');
    const text = (await output.textContent()) ?? '';
    const lines = text.split('\n').filter((l) => l.length > 0);
    expect(lines.every((l) => l.length === lines[0].length)).toBe(true);
    // The literal pipe is escaped again on the way back out.
    expect(text).toContain('a\\|b');
  });

  test('shows an error and does not touch the grid when the pasted text is not a valid table', async ({ page }) => {
    await page.goto('/edit-markdown-table/');
    await waitReady(page);

    await page.fill('#import-textarea', 'This is just a sentence, not a table.');
    await page.click('#import-action');

    await expect(page.getByRole('alert')).toBeVisible();
    // The default blank grid (3 columns) is untouched.
    await expect(page.locator('[data-testid^="header-input-"]')).toHaveCount(3);
  });

  test('keyboard: Enter moves focus down a column, Tab moves to the next cell', async ({ page }) => {
    await page.goto('/edit-markdown-table/');
    await waitReady(page);

    const firstHeader = page.locator('[data-testid="header-input-0"]');
    await firstHeader.click();
    await firstHeader.press('Enter');
    await expect(page.locator('[data-testid="cell-input-0-0"]')).toBeFocused();

    await page.locator('[data-testid="cell-input-0-0"]').press('Tab');
    await expect(page.locator('[data-testid="cell-input-0-1"]')).toBeFocused();
  });
});

import { test, expect } from '@playwright/test';
import { waitReady } from './_helpers';

/**
 * The fullscreen-takeover overlay (frozen FullscreenShell primitive, #116).
 *
 * Unlike a viewer/paste-based editor, the grid has no natural "nothing
 * loaded yet" state — a blank table is live from first render — so
 * fullscreen here is an explicit opt-in ("Expand") rather than automatic on
 * import. Closing discards the table back to blank (mirroring
 * edit-ascii-diagram's start-over-on-close contract, D4), routing through a
 * confirm dialog whenever the table has diverged from its baseline
 * (mount/last import/last close) and closing silently otherwise.
 */
test.describe('fullscreen editor overlay', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium' && testInfo.project.name !== 'mobile-chromium',
      'viewport geometry: one desktop + one mobile engine'
    );
  });

  for (const vp of [
    { width: 1920, height: 1080 },
    { width: 375, height: 667 },
  ]) {
    test(`overlay fills the ${vp.width}x${vp.height} viewport and receives focus`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/edit-markdown-table/');
      await waitReady(page);
      await page.locator('#expand-editor-action').click();
      await page.locator('[data-testid="editor"]').waitFor({ state: 'visible' });

      const box = await page.locator('[data-testid="editor"]').boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(box!.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(box!.width - vp.width)).toBeLessThanOrEqual(2);
      expect(Math.abs(box!.height - vp.height)).toBeLessThanOrEqual(2);

      const focusedIsOverlay = await page.evaluate(
        () => document.activeElement?.getAttribute('data-testid') === 'editor'
      );
      expect(focusedIsOverlay).toBe(true);
    });
  }

  test('Escape without edits closes the editor directly, no prompt', async ({ page }) => {
    await page.goto('/edit-markdown-table/');
    await waitReady(page);
    await page.locator('#expand-editor-action').click();
    await expect(page.locator('[data-testid="editor"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="editor"]')).toHaveCount(0);
    await expect(page.locator('#confirm-close-editor-action')).toHaveCount(0); // no dialog appeared
    await expect(page.locator('#expand-editor-action')).toBeVisible(); // back to the inline grid
  });

  test('Escape with unsaved edits shows the confirm dialog; cancel keeps the editor, confirm discards and closes', async ({
    page,
  }) => {
    await page.goto('/edit-markdown-table/');
    await waitReady(page);
    await page.locator('#expand-editor-action').click();
    await page.fill('[data-testid="header-input-0"]', 'Name'); // a real edit

    await page.keyboard.press('Escape');
    await expect(page.locator('#confirm-close-editor-action')).toBeVisible(); // dialog, not a silent close
    await expect(page.locator('[data-testid="editor"]')).toBeVisible(); // edits not destroyed

    // While the dialog is open, Escape belongs to the dialog: it closes the
    // dialog only, and must NOT bounce straight back into a new close prompt.
    await page.keyboard.press('Escape');
    await expect(page.locator('#confirm-close-editor-action')).toHaveCount(0);
    await expect(page.locator('[data-testid="editor"]')).toBeVisible();
    await expect(page.locator('[data-testid="header-input-0"]')).toHaveValue('Name'); // still there

    // Now go through with it.
    await page.keyboard.press('Escape');
    await page.locator('#confirm-close-editor-action').click();
    await expect(page.locator('[data-testid="editor"]')).toHaveCount(0);
    // The discarded table is back to blank.
    await expect(page.locator('[data-testid="header-input-0"]')).toHaveValue('');
  });

  test('the visible close button routes exactly like Escape (prompt with edits, direct without)', async ({ page }) => {
    await page.goto('/edit-markdown-table/');
    await waitReady(page);

    // No edits: direct close.
    await page.locator('#expand-editor-action').click();
    await page.click('[data-testid="close-editor"]');
    await expect(page.locator('[data-testid="editor"]')).toHaveCount(0);

    // With edits: confirm dialog.
    await page.locator('#expand-editor-action').click();
    await page.fill('[data-testid="header-input-0"]', 'Name');
    await page.click('[data-testid="close-editor"]');
    await expect(page.locator('#confirm-close-editor-action')).toBeVisible();
    await page.locator('#confirm-close-editor-action').click();
    await expect(page.locator('[data-testid="editor"]')).toHaveCount(0);
  });
});

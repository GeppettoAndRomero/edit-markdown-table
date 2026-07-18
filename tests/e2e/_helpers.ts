import { type Page, type Download } from '@playwright/test';

/** Wait until the island has hydrated and the grid is ready for interaction. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/**
 * Type into the first header cell, then download the resulting Markdown.
 * Used by generic (engine-independent) covenant/i18n/a11y checks;
 * conversion.spec.ts drives the parser/serializer/grid in more detail.
 */
export async function convert(page: Page): Promise<Download> {
  await page.locator('[data-testid="header-input-0"]').waitFor({ state: 'visible' });
  await page.fill('[data-testid="header-input-0"]', 'Name');
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await page.locator('#download-action').click();
  return downloadPromise;
}

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// axe inspects the rendered DOM; one engine is representative.
test.describe('accessibility', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe runs on one engine');
  });

  for (const path of ['/edit-markdown-table/', '/edit-markdown-table/ja/']) {
    test(`has no serious or critical axe violations on ${path} (#6)`, async ({ page }) => {
      // Disable the decorative fade-in so axe samples the settled (fully-opaque)
      // state, not a mid-animation frame.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const blocking = violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      );
      expect(blocking.map((v) => `${v.id} (${v.impact})`)).toEqual([]);
    });
  }

  test('has no serious or critical axe violations with the fullscreen editor expanded (#116)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/edit-markdown-table/');
    await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
    await page.locator('#expand-editor-action').click();
    await page.locator('[data-testid="editor"]').waitFor({ state: 'visible' });

    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(blocking.map((v) => `${v.id} (${v.impact})`)).toEqual([]);
  });
});

import { expect, test } from '@playwright/test';

/**
 * Smoke test: walk every story in the built Storybook static site and assert
 * that it renders without throwing. Exposes runtime errors that would otherwise
 * surface only when a viewer opens that specific story.
 */

interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type?: string;
}

interface StoriesIndex {
  v: number;
  entries: Record<string, StoryEntry>;
}

test('storybook root loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Storybook|Welcome|zod2gql/i);
});

test('every story renders without runtime errors', async ({ page, request }) => {
  const response = await request.get('/index.json');
  test.skip(!response.ok(), 'Storybook index.json not present');
  const index = (await response.json()) as StoriesIndex;
  const ids = Object.values(index.entries)
    .filter((e) => e.type !== 'docs')
    .map((e) => e.id);

  test.skip(ids.length === 0, 'No story entries found');

  const failures: Array<{ id: string; error: string }> = [];

  for (const id of ids) {
    const errors: string[] = [];
    const onPageError = (err: Error): void => {
      errors.push(err.message);
    };
    const onConsoleError = (msg: import('@playwright/test').ConsoleMessage): void => {
      if (msg.type() === 'error') errors.push(msg.text());
    };
    page.on('pageerror', onPageError);
    page.on('console', onConsoleError);

    await page.goto(`/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`, {
      waitUntil: 'networkidle',
    });

    page.off('pageerror', onPageError);
    page.off('console', onConsoleError);

    if (errors.length) {
      failures.push({ id, error: errors.join('\n') });
    }
  }

  if (failures.length) {
    const message = failures.map((f) => `  ${f.id}: ${f.error}`).join('\n');
    throw new Error(`Stories with runtime errors:\n${message}`);
  }
});

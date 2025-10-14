import { test, expect } from '@playwright/test';

const API = process.env.E2E_API || 'http://localhost:4000';
const WEB = process.env.E2E_WEB || 'http://localhost:3000';

test('search → hold → force confirm → confirmation', async ({ page, request }) => {
  await page.goto(WEB);
  await page.getByPlaceholder('City').fill('New York');
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 2);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  await page.locator('input[type=date]').first().fill(fmt(start));
  await page.locator('input[type=date]').nth(1).fill(fmt(end));
  await page.getByRole('link', { name: 'Search' }).click();

  await page.waitForURL('**/search**');
  await page.locator('a[href^=/hotels/]').first().click();

  await page.waitForURL('**/hotels/**');
  await page.locator('select').selectOption({ index: 1 });
  const [nav] = await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: 'Hold & Checkout' }).click(),
  ]);
  await page.waitForURL('**/checkout**');

  const url = new URL(page.url());
  const holdId = url.searchParams.get('holdId');
  expect(holdId).toBeTruthy();
  await request.post();

  await page.goto();
  await expect(page.getByText('Payment received')).toBeVisible();
});

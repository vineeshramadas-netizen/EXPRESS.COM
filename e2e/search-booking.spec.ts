import { test, expect } from '@playwright/test';

const API = process.env.E2E_API || 'http://localhost:4000';
const WEB = process.env.E2E_WEB || 'http://localhost:3000';

async function login(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto(`${WEB}/login`);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/profile');
}

test('search → select → login → hold → force-confirm → profile shows booking', async ({ page, request }) => {
  await page.goto(WEB);
  await page.getByPlaceholder('City').fill('New York');
  const start = new Date(); const end = new Date(); end.setDate(start.getDate() + 2);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  await page.locator('input[type="date"]').first().fill(fmt(start));
  await page.locator('input[type="date"]').nth(1).fill(fmt(end));
  await page.getByRole('link', { name: 'Search' }).click();
  await page.waitForURL('**/search**');

  // pick first hotel
  await page.locator('a[href^="/hotels/"]').first().click();
  await page.waitForURL('**/hotels/**');

  // select first room and hold
  await page.locator('select').selectOption({ index: 1 });
  const [nav] = await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: 'Hold & Checkout' }).click(),
  ]);
  await page.waitForURL('**/checkout**');

  // login (uses seeded user)
  await login(page, 'user@example.com', 'UserPass123!');

  // get hold id from URL and force confirm
  const url = new URL(page.url());
  const holdId = url.searchParams.get('holdId');
  expect(holdId).toBeTruthy();
  await request.post(`${API}/api/test/force-confirm`, { data: { holdId } });

  // verify booking appears in profile
  await page.goto(`${WEB}/profile`);
  await expect(page.getByText('Status')).toBeVisible();
});

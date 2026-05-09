import { test, expect } from '@playwright/test';

test('shows invalid secret link page for wrong token', async ({ page }) => {
  await page.goto('/s/wrong-token');
  await expect(page.getByText('Ссылка недействительна')).toBeVisible();
});

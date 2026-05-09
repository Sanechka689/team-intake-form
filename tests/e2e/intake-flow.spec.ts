import { test, expect } from '@playwright/test';

test('shows landing page and start button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Собираем сильное маркетинговое агентство вместе')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Начни отсюда' })).toBeVisible();
});

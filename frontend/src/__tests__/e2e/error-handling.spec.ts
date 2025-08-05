import { test, expect } from '@playwright/test';

test.describe('VIA Pædagoger Forum - Error Handling', () => {
  test('should handle API failures gracefully', async ({ page }) => {
    // Intercept API calls and make them fail
    await page.route('**/api/posts*', async route => {
      await route.abort('failed');
    });
    
    await page.goto('/');
    
    // Should show error message instead of breaking
    await expect(page.locator('text=/fejl|error|problem/i')).toBeVisible({ timeout: 10000 });
    
    // Page should still be functional (not completely broken)
    await expect(page.locator('header')).toBeVisible();
  });

  test('should handle slow API responses', async ({ page }) => {
    // Intercept API calls and delay them
    await page.route('**/api/posts*', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });
    
    await page.goto('/');
    
    // Should show loading state
    await expect(page.locator('text=Indlæser')).toBeVisible();
    
    // Eventually content should load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle missing images gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Check if any images fail to load and have proper fallbacks
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first image
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      // Image should have alt text for accessibility
      const altText = await firstImage.getAttribute('alt');
      expect(altText).toBeTruthy();
    }
  });

  test('should handle invalid URLs gracefully', async ({ page }) => {
    // Try to visit a non-existent page
    await page.goto('/this-page-does-not-exist');
    
    // Should show a 404 page or redirect to homepage
    // Since this is a SPA, it might show the homepage with routing error
    await expect(page.locator('body')).toBeVisible();
    
    // Should not show a browser error page
    const title = await page.title();
    expect(title).toContain('VIA Pædagoger Forum');
  });

  test('should handle network disconnection', async ({ page, context }) => {
    await page.goto('/');
    
    // Wait for initial load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Simulate network disconnection
    await context.setOffline(true);
    
    // Try to navigate or interact
    await page.click('text=Log ind');
    
    // Should handle offline state gracefully (not crash)
    await expect(page.locator('body')).toBeVisible();
    
    // Restore connection
    await context.setOffline(false);
  });

  test('should validate form inputs properly', async ({ page }) => {
    await page.goto('/register');
    
    // Test various invalid inputs
    await page.fill('input[placeholder*="3 tegn"]', ''); // Empty username
    await page.fill('input[placeholder*="email"]', 'not-an-email'); // Invalid email
    await page.fill('input[placeholder*="6 tegn"]', '12345'); // Too short password
    
    await page.click('button[type="submit"]');
    
    // Should show validation errors for all fields
    await expect(page.locator('.text-red-600, .error')).toHaveCount(3, { timeout: 5000 });
  });

  test('should handle malformed data gracefully', async ({ page }) => {
    // Intercept API and return malformed data
    await page.route('**/api/posts*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: null, // Malformed - missing ID
            title: '', // Malformed - empty title
            author: null, // Malformed - missing author
          }
        ])
      });
    });
    
    await page.goto('/');
    
    // Should not crash, should handle gracefully
    await expect(page.locator('body')).toBeVisible();
    
    // Should show some kind of error or fallback content
    await expect(page.locator('text=/fejl|ingen indlæg|problem/i')).toBeVisible({ timeout: 5000 });
  });
});
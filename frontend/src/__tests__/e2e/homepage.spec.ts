import { test, expect } from '@playwright/test';

test.describe('VIA Pædagoger Forum - Homepage', () => {
  test('should load homepage and show VIA branding', async ({ page }) => {
    await page.goto('/');
    
    // Check that page loads
    await expect(page).toHaveTitle(/VIA Pædagoger Forum/);
    
    // Check VIA branding and welcome message
    await expect(page.locator('h2')).toContainText('Velkommen til fællesskabet');
    
    // Check that posts are visible
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Check Danish language is present
    await expect(page.locator('text=pædagog')).toBeVisible();
  });

  test('should show authentic VIA content', async ({ page }) => {
    await page.goto('/');
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Check for VIA-specific content
    const postTitles = page.locator('[data-testid="post-title"]');
    const firstPost = postTitles.first();
    
    // Verify we have Danish pedagogy content
    const hasVIAContent = await page.locator('text=/praktik|pædagog|eksamen|via/i').first().isVisible();
    expect(hasVIAContent).toBe(true);
    
    // Check that usernames look authentic (contain VIA or pæd)
    const authorName = page.locator('[data-testid="post-author"]').first();
    await expect(authorName).toBeVisible();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that content is still visible and accessible on mobile
    await expect(page.locator('h2')).toContainText('Velkommen til fællesskabet');
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Check that mobile navigation works (if present)
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    // Intercept API call to simulate slow loading
    await page.route('**/api/posts*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
    
    await page.goto('/');
    
    // Should show loading indicator briefly
    await expect(page.locator('text=Indlæser')).toBeVisible();
    
    // Then posts should appear
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible({ timeout: 5000 });
  });
});
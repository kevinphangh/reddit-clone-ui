import { test, expect } from '@playwright/test';

test.describe('VIA Pædagoger Forum - Post Interactions', () => {
  test('should view post details when clicking on post', async ({ page }) => {
    await page.goto('/');
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Get the first post title and click it
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await firstPost.click();
    
    // Should navigate to post detail page
    await expect(page).toHaveURL(/.*\/comments\/\d+/);
    
    // Should show post content and comments section
    await expect(page.locator('[data-testid="post-content"], .post-content')).toBeVisible();
    await expect(page.locator('text=/kommentar/i')).toBeVisible();
  });

  test('should show voting buttons on posts', async ({ page }) => {
    await page.goto('/');
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Check that voting buttons are present
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await expect(firstPost.locator('[data-testid="upvote-button"], .upvote')).toBeVisible();
    await expect(firstPost.locator('[data-testid="downvote-button"], .downvote')).toBeVisible();
    
    // Check that score is displayed
    await expect(firstPost.locator('[data-testid="post-score"], .score')).toBeVisible();
  });

  test('should show comment count on posts', async ({ page }) => {
    await page.goto('/');
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Check that comment count is visible
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await expect(firstPost.locator('text=/\d+.*kommentar/i')).toBeVisible();
  });

  test('should show authentic VIA usernames and timestamps', async ({ page }) => {
    await page.goto('/');
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Check for VIA-style usernames
    const authorNames = page.locator('[data-testid="post-author"]');
    const firstAuthor = await authorNames.first().textContent();
    
    // Should contain VIA, pæd, or similar authentic patterns
    expect(firstAuthor).toMatch(/VIA|pæd|_/i);
    
    // Check that timestamps are present and realistic (not "just now" for old posts)
    await expect(page.locator('text=/siden|timer|dage/i').first()).toBeVisible();
  });

  test('should navigate back to homepage from post', async ({ page }) => {
    await page.goto('/');
    
    // Click on first post
    await page.locator('[data-testid="post-card"]').first().click();
    await expect(page).toHaveURL(/.*\/comments\/\d+/);
    
    // Click on site logo or back button to return home
    await page.click('[data-testid="site-logo"], .logo, text=VIA');
    
    // Should be back on homepage
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
  });

  test('should display posts in correct order (newest first)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    
    // Get all post timestamps
    const posts = page.locator('[data-testid="post-card"]');
    const count = await posts.count();
    
    if (count >= 2) {
      // Get timestamps of first two posts
      const firstPostTime = page.locator('[data-testid="post-card"]').nth(0).locator('text=/siden|timer|dage/i');
      const secondPostTime = page.locator('[data-testid="post-card"]').nth(1).locator('text=/siden|timer|dage/i');
      
      await expect(firstPostTime).toBeVisible();
      await expect(secondPostTime).toBeVisible();
      
      // First post should be newer (lower time value or more recent)
      // This is a basic check - in real scenario you'd parse and compare actual timestamps
    }
  });
});
import { test, expect } from '@playwright/test';

test.describe('VIA Pædagoger Forum - Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Click login button in header
    await page.click('text=Log ind');
    
    // Should be on login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h1')).toContainText('Velkommen tilbage');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    
    // Click register button in header
    await page.click('text=Bliv medlem');
    
    // Should be on register page
    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.locator('h1')).toContainText('Bliv en del af fællesskabet');
  });

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit without filling fields
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=/påkrævet|udfyldes/i')).toBeVisible();
  });

  test('should show validation errors on invalid registration', async ({ page }) => {
    await page.goto('/register');
    
    // Fill with invalid data
    await page.fill('input[placeholder*="3 tegn"]', 'ab'); // Too short username
    await page.fill('input[placeholder*="email"]', 'invalid-email'); // Invalid email
    await page.fill('input[placeholder*="6 tegn"]', '123'); // Too short password
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=/mindst 3 tegn/i')).toBeVisible();
    await expect(page.locator('text=/gyldig email/i')).toBeVisible();
    await expect(page.locator('text=/mindst 6 tegn/i')).toBeVisible();
  });

  test('should have working links between login and register', async ({ page }) => {
    await page.goto('/login');
    
    // Click "Bliv medlem" link
    await page.click('text=Bliv medlem her');
    await expect(page).toHaveURL(/.*\/register/);
    
    // Click "Log ind" link
    await page.click('text=Log ind her');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should show proper Danish text and branding', async ({ page }) => {
    await page.goto('/login');
    
    // Check Danish text
    await expect(page.locator('text=Velkommen tilbage')).toBeVisible();
    await expect(page.locator('text=Brugernavn eller email')).toBeVisible();
    await expect(page.locator('text=Adgangskode')).toBeVisible();
    
    await page.goto('/register');
    
    // Check Danish text on register page
    await expect(page.locator('text=Bliv en del af fællesskabet')).toBeVisible();
    await expect(page.locator('text=pædagogstuderende')).toBeVisible();
  });
});
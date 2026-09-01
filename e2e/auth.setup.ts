import { test as setup, expect } from '@playwright/test';

setup('authenticate as admin', async ({ page }) => {

await page.goto('/login');

// ==========================================
// LOGIN
// ==========================================

// Your login page uses "email" as the label.
const email = process.env.TMS_ADMIN_EMAIL;

const password = process.env.TMS_ADMIN_PASS;

if (!email) {
throw new Error(
'TMS_ADMIN_EMAIL environment variable is not set.'
);
}

if (!password) {
throw new Error(
'TMS_ADMIN_PASS environment variable is not set.'
);
}

// Fill Email
await page
.getByLabel('email', { exact: true })
.fill(email);

// Fill Password
await page
.getByLabel('Password', { exact: true })
.fill(password);

// Click Sign In
await page
.getByRole('button', {
name: 'Sign In',
exact: true
})
.click();

// ==========================================
// VERIFY LOGIN
// ==========================================

// After successful login, the protected
// Command Center should be displayed.
await expect(
page.getByRole('heading', {
name: /command center/i
})
).toBeVisible();

// ==========================================
// SAVE AUTHENTICATION STATE
// ==========================================

await page.context().storageState({
path: 'playwright/.auth/admin.json'
});
});

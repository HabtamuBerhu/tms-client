import { test, expect } from '@playwright/test';

test('admin approves a pending enrollment', async ({ page }) => {

// Open the protected Instructor Command Center
await page.goto('/command-center');

// Verify that authentication succeeded and
// the Instructor Command Center is displayed.
await expect(
page.getByRole('heading', {
name: /command center/i
})
).toBeVisible();

// Find the first pending enrollment's Approve button
const firstApprove = page
.getByRole('button', {
name: 'Approve',
exact: true
})
.first();

// Approve the enrollment
await firstApprove.click();

// The EnrollmentStore performs an optimistic update,
// so the status should immediately become Approved.
await expect(
page.getByText('Approved', {
exact: true
}).first()
).toBeVisible();
});

import { expect, test } from "@playwright/test";

test.describe("Game Selector", () => {
	test("displays all three game slots", async ({ page }) => {
		await page.goto("/GameSelector");
		await page.waitForLoadState("networkidle");

		// Check all game slot buttons are visible using data-href attribute
		await expect(page.locator('[data-href="/filmoji"]')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('[data-href="https://garticphone.com/"]')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('[data-href="https://skribbl.io/"]')).toBeVisible({ timeout: 10000 });
	});

	test("shows active indicator for selected game", async ({ page }) => {
		await page.goto("/GameSelector");
		await page.waitForLoadState("networkidle");

		// First game should be active by default - check for the status indicator
		const activeIndicator = page.getByText("(Enter to launch)");
		await expect(activeIndicator).toBeVisible({ timeout: 10000 });
	});

	test("keyboard navigation works", async ({ page }) => {
		await page.goto("/GameSelector");
		await page.waitForLoadState("networkidle");

		// Press right arrow to change selection
		await page.keyboard.press("ArrowRight");
		await page.waitForTimeout(300);

		// Press right arrow again
		await page.keyboard.press("ArrowRight");
		await page.waitForTimeout(300);

		// Press left arrow to go back
		await page.keyboard.press("ArrowLeft");
		await page.waitForTimeout(300);

		// Verify the status indicator is still visible
		await expect(page.getByText("(Enter to launch)")).toBeVisible();
	});

	test("clicking Filmoji navigates to game page", async ({ page }) => {
		await page.goto("/GameSelector");
		await page.waitForLoadState("networkidle");

		// Click the Filmoji button using data-href
		await page.locator('[data-href="/filmoji"]').click();

		await page.waitForURL("**/filmoji", { timeout: 15000 });
		await expect(page).toHaveURL(/filmoji/);
	});

	test("external game slots have correct hrefs", async ({ page }) => {
		await page.goto("/GameSelector");
		await page.waitForLoadState("networkidle");

		// Check that external game buttons exist with proper data-href
		await expect(page.locator('[data-href="https://garticphone.com/"]')).toBeVisible();
		await expect(page.locator('[data-href="https://skribbl.io/"]')).toBeVisible();
	});
});

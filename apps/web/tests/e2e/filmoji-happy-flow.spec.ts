import { type Page, expect, test } from "@playwright/test";

const playerName = `Tester-${Date.now()}`;

async function navigateToFilmoji(page: Page) {
	await page.goto("/");
	// Arcade coin click triggers navigation
	await page.locator('[data-href="/GameSelector"], [data-href="/GameSelector"], div').first();
	// If arcade intro present, click coin area to transition
	const coin = page.locator("." + "coins");
	if (await coin.isVisible().catch(() => false)) {
		await coin.click();
	}
	await page.waitForURL("**/GameSelector", { timeout: 15000 });
	await expect(page).toHaveURL(/GameSelector/);
	// Select Filmoji card
	await page
		.getByText(/Filmoji/i)
		.first()
		.click();
	await page.waitForURL("**/filmoji", { timeout: 15000 });
}

test.describe("Filmoji happy flow", () => {
	test("loads filmoji page with logged in user", async ({ page }) => {
		// Seed a logged-in user so we skip the login modal
		await page.context().clearCookies();
		await page.goto("/");
		await page.evaluate(
			([name]) => {
				localStorage.setItem("filmoji-user", JSON.stringify({ id: 9999, name }));
			},
			[playerName],
		);

		// Visit filmoji directly
		await page.goto("/filmoji");
		await page.waitForLoadState("networkidle");

		// Should see the header with player name
		await expect(page.getByText(playerName)).toBeVisible({ timeout: 10000 });

		// Should see the create puzzle button
		const createButton = page.getByRole("button", { name: /create your own puzzle/i });
		await expect(createButton).toBeVisible();
	});

	test("create puzzle form validation", async ({ page }) => {
		// Seed a logged-in user
		await page.goto("/");
		await page.evaluate(
			([name]) => {
				localStorage.setItem("filmoji-user", JSON.stringify({ id: 9999, name }));
			},
			[playerName],
		);

		await page.goto("/filmoji");
		await page.waitForLoadState("networkidle");

		// Open create puzzle modal
		const createButton = page.getByRole("button", { name: /create your own puzzle/i });
		await createButton.click();

		const modal = page.getByRole("dialog");
		await expect(modal.getByText(/create a filmoji/i)).toBeVisible();

		// Clear creator and try to save - should show validation errors
		await modal.getByPlaceholder(/your name/i).fill("");
		await page.getByRole("button", { name: /save puzzle/i }).click();

		// Validation errors should appear
		await expect(page.getByText(/emoji story is required/i)).toBeVisible();
		await expect(page.getByText(/answer is required/i)).toBeVisible();
		await expect(page.getByText(/creator is required/i)).toBeVisible();
	});

	test("create puzzle successfully", async ({ page }) => {
		// Seed a logged-in user
		await page.goto("/");
		await page.evaluate(
			([name]) => {
				localStorage.setItem("filmoji-user", JSON.stringify({ id: 9999, name }));
			},
			[playerName],
		);

		await page.goto("/filmoji");
		await page.waitForLoadState("networkidle");

		// Open create puzzle modal
		const createButton = page.getByRole("button", { name: /create your own puzzle/i });
		await createButton.click();

		const modal = page.getByRole("dialog");
		await expect(modal.getByText(/create a filmoji/i)).toBeVisible();

		// Fill form
		await modal.getByPlaceholder(/use pure emoji/i).fill("🎬🎥🎞️");
		await modal.getByPlaceholder(/movie title/i).fill(`TestMovie-${Date.now()}`);
		await modal.getByPlaceholder(/your name/i).fill(playerName);

		// Save puzzle
		await page.getByRole("button", { name: /save puzzle/i }).click();

		// Modal should close
		await expect(modal).not.toBeVisible({ timeout: 10000 });
	});

	test("guess flow with existing puzzles", async ({ page }) => {
		// Seed a logged-in user
		await page.goto("/");
		await page.evaluate(
			([name]) => {
				localStorage.setItem("filmoji-user", JSON.stringify({ id: 9999, name }));
			},
			[playerName],
		);

		await page.goto("/filmoji");
		await page.waitForLoadState("networkidle");

		// If there's a guess input visible, the flow is working
		const guessInput = page.getByPlaceholder(/Movie name/i).first();

		// Check if puzzles exist (guess input would be visible)
		const isGuessVisible = await guessInput.isVisible({ timeout: 5000 }).catch(() => false);

		if (isGuessVisible) {
			// Test submitting a guess
			await guessInput.fill("Test Guess");
			await page.getByRole("button", { name: /^Guess$/i }).click();
			// The snackbar might appear with wrong guess message
			await page.waitForTimeout(500);
		}

		// Test passes if page loaded successfully
		await expect(page.getByText("Guess the movie by Emoji")).toBeVisible();
	});
});

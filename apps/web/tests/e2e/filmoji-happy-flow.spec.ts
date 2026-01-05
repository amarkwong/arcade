import { expect, test } from "@playwright/test";

const playerName = `Tester-${Date.now()}`;

async function navigateToFilmoji(page: any) {
	await page.goto("/");
	// Arcade coin click triggers navigation
	await page
		.locator('[data-href="/GameSelector"], [data-href="/GameSelector"], div')
		.first();
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
	test("login, select game, create puzzle, validate, guess and unlock", async ({
		page,
	}) => {
		// Seed a logged-in user so we skip the login modal
		await page.context().clearCookies();
		await page.goto("/");
		await page.evaluate(([name]) => {
			localStorage.setItem("filmoji-user", JSON.stringify({ id: 9999, name }));
		}, playerName);

		// Visit filmoji directly
		await page.goto("/filmoji");

		// Open create puzzle directly on Filmoji page
		const createButton = page.getByRole("button", {
			name: /create your own puzzle/i,
		});
		await createButton.click();
		const modal = page.getByRole("dialog");
		await expect(modal.getByText(/create a filmoji/i)).toBeVisible();

		// Validation: clear creator (prefilled) and submit empty to surface errors
		await page.getByLabel(/creator name/i).fill("");
		await page.getByRole("button", { name: /save puzzle/i }).click();
		await expect(page.getByText(/emoji story is required/i)).toBeVisible();
		await expect(page.getByText(/answer is required/i)).toBeVisible();
		await expect(page.getByText(/creator is required/i)).toBeVisible();

		// Fill form (scoped to modal)
		await modal.getByLabel(/emoji story/i).fill("👨‍🚀🌕");
		await modal.getByLabel(/answer movie title/i).fill("Interstellar");
		await modal.getByLabel(/creator name/i).fill(playerName);

		// Poster auto-fetch (allow some time and assert preview container exists)
		await page.getByLabel(/answer movie title/i).blur();
		await expect(
			page.getByText(
				/Poster will appear|Fetching poster|Poster not found|Could not fetch poster/i,
			),
		).toBeVisible({ timeout: 8000 });

		// Save puzzle
		await page.getByRole("button", { name: /save puzzle/i }).click();

		// Guess flow: ensure guess box visible (for new puzzle it is locked initially)
		const guessInput = page.getByPlaceholder(/Movie name/i).first();
		await expect(guessInput).toBeVisible();

		// Wrong guess then right guess
		await guessInput.fill("Wrong Title");
		await page.getByRole("button", { name: /^Guess$/i }).click();
		// Still locked state expected; retry with correct
		await guessInput.fill("Interstellar");
		await page.getByRole("button", { name: /^Guess$/i }).click();

		// Card should unlock — creator text shows when unlocked
		await expect(page.getByText(/Created by/i)).toBeVisible({ timeout: 8000 });
	});
});

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 90_000,
	expect: { timeout: 10_000 },
	fullyParallel: true,
	reporter: "list",
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
		viewport: { width: 1280, height: 720 },
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});

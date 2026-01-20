import { expect, test } from "@playwright/test";

test.describe("API: Puzzles", () => {
	test("GET /api/puzzles returns puzzle list with solves", async ({ request }) => {
		const response = await request.get("/api/puzzles");

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body).toHaveProperty("puzzles");
		expect(Array.isArray(body.puzzles)).toBe(true);

		// Check puzzle structure if any exist
		if (body.puzzles.length > 0) {
			const puzzle = body.puzzles[0];
			expect(puzzle).toHaveProperty("id");
			expect(puzzle).toHaveProperty("puzzle");
			expect(puzzle).toHaveProperty("answer");
			expect(puzzle).toHaveProperty("solves");
		}
	});

	test("POST /api/puzzles creates a new puzzle", async ({ request }) => {
		const puzzleData = {
			movieName: `Test Movie ${Date.now()}`,
			puzzle: "🎬🎥",
			answer: "Test Answer",
			creator: "TestCreator",
		};

		const response = await request.post("/api/puzzles", {
			data: puzzleData,
		});

		expect(response.status()).toBe(201);
		const body = await response.json();
		expect(body).toHaveProperty("id");
		expect(body.puzzle).toBe(puzzleData.puzzle);
		expect(body.answer).toBe(puzzleData.answer);
	});

	test("POST /api/puzzles returns 400 for missing required fields", async ({ request }) => {
		const response = await request.post("/api/puzzles", {
			data: { movieName: "Test" },
		});

		expect(response.status()).toBe(400);
	});
});

test.describe("API: Puzzle Solves", () => {
	test("GET /api/puzzles/[id]/solves returns solves for valid puzzle", async ({ request }) => {
		// First get a puzzle ID
		const puzzlesResponse = await request.get("/api/puzzles");
		const { puzzles } = await puzzlesResponse.json();

		// Skip if no puzzles exist
		test.skip(puzzles.length === 0, "No puzzles in database");

		const puzzleId = puzzles[0].id;
		const response = await request.get(`/api/puzzles/${puzzleId}/solves`);

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body).toHaveProperty("solves");
		expect(Array.isArray(body.solves)).toBe(true);
	});

	test("GET /api/puzzles/[id]/solves returns 400 for non-numeric ID", async ({ request }) => {
		const response = await request.get("/api/puzzles/abc/solves");

		expect(response.status()).toBe(400);
		const body = await response.json();
		expect(body.error).toBe("Invalid puzzle id");
	});
});

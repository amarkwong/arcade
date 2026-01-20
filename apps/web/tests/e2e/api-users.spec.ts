import { expect, test } from "@playwright/test";

test.describe("API: Users", () => {
	const uniqueName = `TestUser-${Date.now()}`;

	test("creates a new user with valid name", async ({ request }) => {
		const response = await request.post("/api/users", {
			data: { name: uniqueName },
		});

		expect(response.status()).toBe(201);
		const body = await response.json();
		expect(body).toHaveProperty("id");
		expect(body).toHaveProperty("name", uniqueName);
	});

	test("returns existing user if same name submitted", async ({ request }) => {
		// Create user first
		await request.post("/api/users", {
			data: { name: uniqueName },
		});

		// Submit same name again
		const response = await request.post("/api/users", {
			data: { name: uniqueName },
		});

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body).toHaveProperty("name", uniqueName);
	});

	test("returns 400 for empty name", async ({ request }) => {
		const response = await request.post("/api/users", {
			data: { name: "" },
		});

		expect(response.status()).toBe(400);
		const body = await response.json();
		expect(body).toHaveProperty("error");
	});

	test("returns 400 for whitespace-only name", async ({ request }) => {
		const response = await request.post("/api/users", {
			data: { name: "   " },
		});

		expect(response.status()).toBe(400);
		const body = await response.json();
		expect(body.error).toBe("Name is required");
	});

	test("returns 400 for missing name field", async ({ request }) => {
		const response = await request.post("/api/users", {
			data: {},
		});

		expect(response.status()).toBe(400);
	});

	test("trims whitespace from name", async ({ request }) => {
		const nameWithSpaces = `  SpacedUser-${Date.now()}  `;
		const response = await request.post("/api/users", {
			data: { name: nameWithSpaces },
		});

		expect(response.status()).toBe(201);
		const body = await response.json();
		expect(body.name).toBe(nameWithSpaces.trim());
	});
});

import { test, expect } from "@playwright/test";

test("dashboard API returns operational reporting data", async ({
  request,
}) => {
  const response = await request.get("/api/dashboard");

  expect(response.ok()).toBeTruthy();

  const data = await response.json();

  expect(data.health).toBe("Operational");
  expect(data.activities.total).toBeGreaterThanOrEqual(0);
  expect(data.generation.totalAttempts).toBeGreaterThanOrEqual(0);
  expect(data.generation.successRate).toBeGreaterThanOrEqual(0);
  expect(data.content.wordLists).toBeGreaterThanOrEqual(0);
});
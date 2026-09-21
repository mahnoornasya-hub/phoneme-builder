import { test, expect } from "@playwright/test";

test("user can create, update and delete a Word List", async ({ page }) => {
  const originalName = `Playwright Test List ${Date.now()}`;
  const updatedName = `Playwright Updated List ${Date.now()}`;

  await page.goto("/manage-words");

  await expect(
    page.getByRole("heading", {
      name: "Manage Words",
      level: 1,
    })
  ).toBeVisible();

  // -------------------------
  // CREATE
  // -------------------------

  await page.getByLabel("Word List Name").fill(originalName);

  await page
    .getByLabel("Description")
    .fill("Created automatically by Playwright.");

  await page.getByRole("button", { name: "Save Word List" }).click();

  await expect(
    page.getByText("Word List saved successfully.")
  ).toBeVisible();

  const originalHeading = page.getByRole("heading", {
    name: originalName,
    exact: true,
  });

  await expect(originalHeading).toBeVisible();

  // -------------------------
  // UPDATE
  // -------------------------

  const originalCard = originalHeading.locator("..");

  await originalCard
    .getByRole("button", { name: "Edit Word List" })
    .click();

  await expect(page.getByLabel("Word List Name")).toHaveValue(
    originalName
  );

  await page.getByLabel("Word List Name").fill(updatedName);

  await page
    .getByLabel("Description")
    .fill("Updated automatically by Playwright.");

  await page
    .getByRole("button", { name: "Update Word List" })
    .click();

  // Verify the database-backed UI now shows the updated list.
  const updatedHeading = page.getByRole("heading", {
    name: updatedName,
    exact: true,
  });

  await expect(updatedHeading).toBeVisible({
    timeout: 10000,
  });

  // -------------------------
  // DELETE
  // -------------------------

  const updatedCard = updatedHeading.locator("..");

  await updatedCard
    .getByRole("button", { name: "Delete Word List" })
    .click();

  const dialog = page.getByRole("dialog");

  await expect(dialog).toBeVisible();

  await expect(
    dialog.getByRole("heading", {
      name: "Delete Word List?",
    })
  ).toBeVisible();

  await dialog
    .getByRole("button", {
      name: "Delete Word List",
      exact: true,
    })
    .click();

  await expect(
    page.getByText("Word List deleted successfully.")
  ).toBeVisible();

  await expect(updatedHeading).toHaveCount(0);
});
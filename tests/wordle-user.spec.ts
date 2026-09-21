import { test, expect } from "@playwright/test";

test("user can generate and complete a Wordle activity", async ({ page }) => {
  // Open the Wordle builder
  await page.goto("/wordle");

  // Confirm the builder loaded
  await expect(
    page.getByRole("heading", {
      name: "Phoneme Wordle Builder",
      level: 1,
    })
  ).toBeVisible();

  // Enter a simple Wordle activity
  await page.getByLabel("Phoneme Word").fill("θ ɪ ŋ");
  await page.getByLabel("English Equivalence").fill("Thing");

  // Generate the activity preview
  await page.getByRole("button", { name: "Generate Preview" }).click();

  // Confirm generation succeeded
  await expect(
    page.getByText(/Preview generated for θ ɪ ŋ — Thing\./)
  ).toBeVisible();

  // Play the generated activity using the correct phonemes
  await page
    .getByRole("button", { name: /θ, TH as in thin/i })
    .click();

  await page
    .getByRole("button", { name: /ɪ, I as in bid/i })
    .click();

  await page
    .getByRole("button", { name: /ŋ, NG as in ring/i })
    .click();

  // Submit the guess
  await page.getByRole("button", { name: "Enter Guess" }).click();

  // Confirm the user completed the activity successfully
  await expect(
    page.getByText(/Correct!.*English word.*Thing/i)
  ).toBeVisible();
});
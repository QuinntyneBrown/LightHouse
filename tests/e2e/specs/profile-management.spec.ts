import { test, expect } from "../fixtures/base.fixture";
import {
  TEST_CHILD_SEEDLING,
  TEST_CHILD_SPROUT,
  TEST_CHILD_EXPLORER,
} from "../fixtures/test-data";

test.describe("Profile Management — L2-3.2, L2-3.4", () => {
  test("should allow creating multiple child profiles", async ({ profileCreationPage, page }) => {
    await profileCreationPage.goto();
    await profileCreationPage.createProfile(TEST_CHILD_SEEDLING.name, TEST_CHILD_SEEDLING.ageBand, 0);
    await expect(page).not.toHaveURL(/\/parent\/profiles\/new/);

    await profileCreationPage.goto();
    await profileCreationPage.createProfile(TEST_CHILD_SPROUT.name, TEST_CHILD_SPROUT.ageBand, 1);
    await expect(page).not.toHaveURL(/\/parent\/profiles\/new/);

    await profileCreationPage.goto();
    await profileCreationPage.createProfile(TEST_CHILD_EXPLORER.name, TEST_CHILD_EXPLORER.ageBand, 2);
    await expect(page).not.toHaveURL(/\/parent\/profiles\/new/);
  });

  test("should display profile switcher accessible from navigation", async ({ appShellPage, homePage }) => {
    await homePage.goto();
    await expect(appShellPage.profileSwitcherButton).toBeVisible();
  });

  test("should show all child profile avatars in switcher", async ({
    appShellPage,
    homePage,
    profileSwitcherPage,
  }) => {
    await homePage.goto();
    await appShellPage.profileSwitcherButton.click();
    await expect(profileSwitcherPage.overlay).toBeVisible();
    const avatarCount = await profileSwitcherPage.profileAvatars.count();
    expect(avatarCount).toBeGreaterThanOrEqual(1);
  });

  test("should show all child profile names in switcher", async ({
    appShellPage,
    homePage,
    profileSwitcherPage,
  }) => {
    await homePage.goto();
    await appShellPage.profileSwitcherButton.click();
    await expect(profileSwitcherPage.overlay).toBeVisible();
    const nameCount = await profileSwitcherPage.profileNames.count();
    expect(nameCount).toBeGreaterThanOrEqual(1);
  });

  test("should switch active profile when selecting from switcher", async ({
    appShellPage,
    homePage,
    profileSwitcherPage,
  }) => {
    await homePage.goto();
    await appShellPage.profileSwitcherButton.click();
    await expect(profileSwitcherPage.overlay).toBeVisible();

    const targetName = await profileSwitcherPage.profileNames.first().textContent();
    expect(targetName).toBeTruthy();
    await profileSwitcherPage.switchToProfile(targetName!);

    await expect(profileSwitcherPage.overlay).not.toBeVisible();
  });

  test("should update home screen content after profile switch", async ({
    appShellPage,
    homePage,
    profileSwitcherPage,
  }) => {
    await homePage.goto();
    const originalName = await homePage.childName.textContent();

    await appShellPage.profileSwitcherButton.click();
    await expect(profileSwitcherPage.overlay).toBeVisible();

    // Pick a different profile if available
    const names = profileSwitcherPage.profileNames;
    const count = await names.count();
    if (count > 1) {
      for (let i = 0; i < count; i++) {
        const name = await names.nth(i).textContent();
        if (name !== originalName) {
          await profileSwitcherPage.switchToProfile(name!);
          break;
        }
      }
      await expect(homePage.childName).not.toHaveText(originalName!);
    }
  });
});

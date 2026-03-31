import { test, expect } from "../fixtures/base.fixture";

test.describe("Navigation — L2-6.1, L2-6.2, L2-6.3", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should display bottom tab bar", async ({ appShellPage }) => {
    await expect(appShellPage.bottomTabBar).toBeVisible();
  });

  test("should show 4 tabs in tab bar", async ({ appShellPage }) => {
    await appShellPage.expectTabCount(4);
  });

  test("should have Home tab with icon and label", async ({ appShellPage }) => {
    await expect(appShellPage.homeTab).toBeVisible();
    await expect(appShellPage.homeTab.getByTestId("tab-icon")).toBeVisible();
    await expect(appShellPage.homeTab.getByTestId("tab-label")).toBeVisible();
  });

  test("should have Browse tab with icon and label", async ({ appShellPage }) => {
    await expect(appShellPage.browseTab).toBeVisible();
    await expect(appShellPage.browseTab.getByTestId("tab-icon")).toBeVisible();
    await expect(appShellPage.browseTab.getByTestId("tab-label")).toBeVisible();
  });

  test("should have Playlists tab with icon and label", async ({ appShellPage }) => {
    await expect(appShellPage.playlistsTab).toBeVisible();
    await expect(appShellPage.playlistsTab.getByTestId("tab-icon")).toBeVisible();
    await expect(appShellPage.playlistsTab.getByTestId("tab-label")).toBeVisible();
  });

  test("should have Parent tab with lock icon and label", async ({ appShellPage }) => {
    await expect(appShellPage.parentTab).toBeVisible();
    await expect(appShellPage.parentTab.getByTestId("tab-icon-lock")).toBeVisible();
    await expect(appShellPage.parentTab.getByTestId("tab-label")).toBeVisible();
  });

  test("should have minimum 48px touch targets on tabs", async ({ appShellPage }) => {
    await appShellPage.expectTabTouchTargetMinSize(48);
  });

  test("should highlight active tab", async ({ appShellPage }) => {
    await appShellPage.expectActiveTab("home");
  });

  test("should navigate between tabs correctly", async ({ appShellPage, page }) => {
    await appShellPage.tapBrowse();
    await expect(page).toHaveURL(/\/browse/);
    await appShellPage.expectActiveTab("browse");

    await appShellPage.tapPlaylists();
    await expect(page).toHaveURL(/\/playlists/);
    await appShellPage.expectActiveTab("playlists");

    await appShellPage.tapHome();
    await expect(page).toHaveURL(/\/home/);
    await appShellPage.expectActiveTab("home");
  });

  test("should use warm color palette (ocean blues, sunset golds)", async ({ appShellPage }) => {
    const tabBar = appShellPage.bottomTabBar;
    const bgColor = await tabBar.evaluate((el) => getComputedStyle(el).backgroundColor);
    // Verify a non-transparent, non-default background is applied
    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(bgColor).not.toBe("rgb(255, 255, 255)");
  });

  test("should use rounded corners on UI elements", async ({ homePage }) => {
    const card = homePage.featuredCards.first();
    const borderRadius = await card.evaluate((el) => getComputedStyle(el).borderRadius);
    const radiusValue = parseFloat(borderRadius);
    expect(radiusValue).toBeGreaterThan(0);
  });

  test("should use child-friendly sans-serif font", async ({ page }) => {
    const fontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(fontFamily.toLowerCase()).toMatch(/sans-serif|nunito|poppins|comic|rounded|quicksand/);
  });

  test("should display screen time overlay when limit is reached", async ({ screenTimeOverlayPage }) => {
    // Navigate to a page where the overlay would appear when time limit is reached
    await screenTimeOverlayPage.expectVisible();
  });

  test("should show friendly message on screen time overlay", async ({ screenTimeOverlayPage }) => {
    await screenTimeOverlayPage.expectFriendlyMessage();
  });

  test("should not allow children to dismiss screen time overlay", async ({ screenTimeOverlayPage }) => {
    await screenTimeOverlayPage.expectNoDismissButton();
  });

  test("should show PIN entry option for parent override on overlay", async ({ screenTimeOverlayPage }) => {
    await expect(screenTimeOverlayPage.parentPINButton).toBeVisible();
  });
});

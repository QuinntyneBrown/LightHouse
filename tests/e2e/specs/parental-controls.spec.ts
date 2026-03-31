import { test, expect } from "../fixtures/base.fixture";
import { TEST_PIN, WRONG_PIN } from "../fixtures/test-data";

test.describe("Parental Controls — L2-4.1, L2-4.2, L2-4.3, L2-4.4", () => {
  test("should require PIN entry to access parent dashboard", async ({ appShellPage, homePage, pinEntryPage }) => {
    await homePage.goto();
    await appShellPage.tapParent();
    await expect(pinEntryPage.pinDots).toBeVisible();
    await expect(pinEntryPage.numpad).toBeVisible();
  });

  test("should reject incorrect PIN", async ({ appShellPage, homePage, pinEntryPage, page }) => {
    await homePage.goto();
    await appShellPage.tapParent();
    await pinEntryPage.enterPIN(WRONG_PIN);
    await expect(pinEntryPage.errorMessage).toBeVisible();
    await expect(page).not.toHaveURL(/\/parent\/dashboard/);
  });

  test("should show per-child cards with watch time summary", async ({ parentDashboardPage }) => {
    await parentDashboardPage.goto();
    const count = await parentDashboardPage.childCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    await expect(parentDashboardPage.childCardName(0)).toBeVisible();
    await expect(parentDashboardPage.childCardWatchTime(0)).toBeVisible();
  });

  test("should show recent content titles in dashboard", async ({ parentDashboardPage }) => {
    await parentDashboardPage.goto();
    await expect(parentDashboardPage.recentActivity).toBeVisible();
    const count = await parentDashboardPage.activityItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await expect(parentDashboardPage.activityItemTitle(0)).toBeVisible();
    await expect(parentDashboardPage.activityItemTitle(0)).not.toBeEmpty();
  });

  test("should display screen time limit indicator per child", async ({ parentDashboardPage }) => {
    await parentDashboardPage.goto();
    await expect(parentDashboardPage.childCardLimitIndicator(0)).toBeVisible();
  });

  test("should show screen time configuration panel", async ({ parentDashboardPage }) => {
    await parentDashboardPage.goto();
    await expect(parentDashboardPage.screenTimeSection).toBeVisible();
    await expect(parentDashboardPage.screenTimeCard).toBeVisible();
  });

  test("should allow setting daily screen time limit per child", async ({ screenTimePage }) => {
    await screenTimePage.goto();
    await expect(screenTimePage.dailyLimitSlider).toBeVisible();
    await screenTimePage.setLimit(60);
    await screenTimePage.save();
    await expect(screenTimePage.limitValue).toContainText("60");
  });

  test("should display current usage alongside limit", async ({ screenTimePage }) => {
    await screenTimePage.goto();
    await expect(screenTimePage.currentUsage).toBeVisible();
    await expect(screenTimePage.limitValue).toBeVisible();
  });

  test("should show content library with preview and block options", async ({ contentBlockingPage }) => {
    await contentBlockingPage.goto();
    await expect(contentBlockingPage.contentList).toBeVisible();
    const count = await contentBlockingPage.contentItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await expect(contentBlockingPage.itemPreviewButton(0)).toBeVisible();
    await expect(contentBlockingPage.itemBlockToggle(0)).toBeVisible();
  });

  test("should allow previewing content from parent dashboard", async ({ contentBlockingPage }) => {
    await contentBlockingPage.goto();
    await expect(contentBlockingPage.itemPreviewButton(0)).toBeVisible();
    await contentBlockingPage.previewContent(0);
  });

  test("should allow blocking specific content items", async ({ contentBlockingPage }) => {
    await contentBlockingPage.goto();
    await contentBlockingPage.toggleBlock(0);
    await expect(contentBlockingPage.itemBlockToggle(0)).toBeChecked();
  });

  test("should display viewing history per child", async ({ viewHistoryPage }) => {
    await viewHistoryPage.goto();
    await expect(viewHistoryPage.historyList).toBeVisible();
    const count = await viewHistoryPage.historyItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("should show title, date, and duration in history", async ({ viewHistoryPage }) => {
    await viewHistoryPage.goto();
    await expect(viewHistoryPage.itemTitle(0)).toBeVisible();
    await expect(viewHistoryPage.itemTitle(0)).not.toBeEmpty();
    await expect(viewHistoryPage.itemDate(0)).toBeVisible();
    await expect(viewHistoryPage.itemDate(0)).not.toBeEmpty();
    await expect(viewHistoryPage.itemDuration(0)).toBeVisible();
    await expect(viewHistoryPage.itemDuration(0)).not.toBeEmpty();
  });

  test("should show chronological ordering in history", async ({ viewHistoryPage }) => {
    await viewHistoryPage.goto();
    const count = await viewHistoryPage.historyItems.count();
    if (count >= 2) {
      const firstDate = await viewHistoryPage.itemDate(0).textContent();
      const secondDate = await viewHistoryPage.itemDate(1).textContent();
      expect(firstDate).toBeTruthy();
      expect(secondDate).toBeTruthy();
      // Most recent should appear first
      expect(new Date(firstDate!).getTime()).toBeGreaterThanOrEqual(new Date(secondDate!).getTime());
    }
  });
});

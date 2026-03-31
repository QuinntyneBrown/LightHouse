import { type Locator, type Page } from "@playwright/test";

export default class ParentDashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly settingsButton: Locator;
  readonly childCards: Locator;
  readonly screenTimeSection: Locator;
  readonly editLink: Locator;
  readonly screenTimeCard: Locator;
  readonly recentActivity: Locator;
  readonly activityItems: Locator;
  readonly contentManagement: Locator;
  readonly previewButton: Locator;
  readonly blockedButton: Locator;
  readonly reportsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId("parent-dashboard-title");
    this.settingsButton = page.getByTestId("parent-dashboard-settings-button");
    this.childCards = page.getByTestId("parent-dashboard-child-card");
    this.screenTimeSection = page.getByTestId("parent-dashboard-screen-time-section");
    this.editLink = page.getByTestId("parent-dashboard-edit-link");
    this.screenTimeCard = page.getByTestId("parent-dashboard-screen-time-card");
    this.recentActivity = page.getByTestId("parent-dashboard-recent-activity");
    this.activityItems = page.getByTestId("parent-dashboard-activity-item");
    this.contentManagement = page.getByTestId("parent-dashboard-content-management");
    this.previewButton = page.getByTestId("parent-dashboard-preview-button");
    this.blockedButton = page.getByTestId("parent-dashboard-blocked-button");
    this.reportsButton = page.getByTestId("parent-dashboard-reports-button");
  }

  childCardAvatar(index: number): Locator {
    return this.childCards.nth(index).getByTestId("child-card-avatar");
  }

  childCardName(index: number): Locator {
    return this.childCards.nth(index).getByTestId("child-card-name");
  }

  childCardAgeBand(index: number): Locator {
    return this.childCards.nth(index).getByTestId("child-card-age-band");
  }

  childCardWatchTime(index: number): Locator {
    return this.childCards.nth(index).getByTestId("child-card-watch-time");
  }

  childCardLimitIndicator(index: number): Locator {
    return this.childCards.nth(index).getByTestId("child-card-limit-indicator");
  }

  screenTimeDailyLimit(): Locator {
    return this.screenTimeCard.getByTestId("screen-time-daily-limit");
  }

  screenTimeSlider(): Locator {
    return this.screenTimeCard.getByTestId("screen-time-slider");
  }

  screenTimeLabels(): Locator {
    return this.screenTimeCard.getByTestId("screen-time-labels");
  }

  activityItemIcon(index: number): Locator {
    return this.activityItems.nth(index).getByTestId("activity-item-icon");
  }

  activityItemTitle(index: number): Locator {
    return this.activityItems.nth(index).getByTestId("activity-item-title");
  }

  activityItemDetails(index: number): Locator {
    return this.activityItems.nth(index).getByTestId("activity-item-details");
  }

  async goto() {
    await this.page.goto("/parent/dashboard");
  }

  async tapEditScreenTime() {
    await this.editLink.click();
  }

  async tapPreview() {
    await this.previewButton.click();
  }

  async tapBlocked() {
    await this.blockedButton.click();
  }

  async tapReports() {
    await this.reportsButton.click();
  }

  async tapChildCard(index: number) {
    await this.childCards.nth(index).click();
  }
}

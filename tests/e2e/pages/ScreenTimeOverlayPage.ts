import { type Locator, type Page, expect } from "@playwright/test";

export default class ScreenTimeOverlayPage {
  readonly page: Page;
  readonly overlay: Locator;
  readonly friendlyMessage: Locator;
  readonly illustration: Locator;
  readonly stars: Locator;
  readonly parentPINButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overlay = page.getByTestId("screen-time-overlay");
    this.friendlyMessage = page.getByTestId("screen-time-overlay-message");
    this.illustration = page.getByTestId("screen-time-overlay-illustration");
    this.stars = page.getByTestId("screen-time-overlay-stars");
    this.parentPINButton = page.getByTestId("screen-time-overlay-parent-pin-button");
  }

  async expectVisible() {
    await expect(this.overlay).toBeVisible();
  }

  async expectNoDismissButton() {
    await expect(this.page.getByTestId("screen-time-overlay-dismiss-button")).toHaveCount(0);
  }

  async expectFriendlyMessage() {
    await expect(this.friendlyMessage).toBeVisible();
    await expect(this.friendlyMessage).not.toBeEmpty();
  }

  async tapParentPIN() {
    await this.parentPINButton.click();
  }
}

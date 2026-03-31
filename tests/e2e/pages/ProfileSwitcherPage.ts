import { type Locator, type Page } from "@playwright/test";

export default class ProfileSwitcherPage {
  readonly page: Page;
  readonly overlay: Locator;
  readonly profileAvatars: Locator;
  readonly profileNames: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overlay = page.getByTestId("profile-switcher-overlay");
    this.profileAvatars = page.getByTestId("profile-switcher-avatar");
    this.profileNames = page.getByTestId("profile-switcher-name");
    this.closeButton = page.getByTestId("profile-switcher-close-button");
  }

  async switchToProfile(name: string) {
    await this.profileNames.filter({ hasText: name }).click();
  }

  async close() {
    await this.closeButton.click();
  }
}

import { type Locator, type Page } from "@playwright/test";

export default class ScreenTimePage {
  readonly page: Page;
  readonly childSelector: Locator;
  readonly dailyLimitSlider: Locator;
  readonly currentUsage: Locator;
  readonly limitValue: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.childSelector = page.getByTestId("screen-time-child-selector");
    this.dailyLimitSlider = page.getByTestId("screen-time-daily-limit-slider");
    this.currentUsage = page.getByTestId("screen-time-current-usage");
    this.limitValue = page.getByTestId("screen-time-limit-value");
    this.saveButton = page.getByTestId("screen-time-save-button");
  }

  async goto() {
    await this.page.goto("/parent/screen-time");
  }

  async setLimit(minutes: number) {
    await this.dailyLimitSlider.fill(String(minutes));
  }

  async selectChild(name: string) {
    await this.childSelector.selectOption({ label: name });
  }

  async save() {
    await this.saveButton.click();
  }
}

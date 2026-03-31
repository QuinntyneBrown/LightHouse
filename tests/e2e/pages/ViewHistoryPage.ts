import { type Locator, type Page, expect } from "@playwright/test";

export default class ViewHistoryPage {
  readonly page: Page;
  readonly childSelector: Locator;
  readonly historyList: Locator;
  readonly historyItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.childSelector = page.getByTestId("history-child-selector");
    this.historyList = page.getByTestId("history-list");
    this.historyItems = page.getByTestId("history-item");
  }

  itemTitle(index: number): Locator {
    return this.historyItems.nth(index).getByTestId("history-item-title");
  }

  itemDate(index: number): Locator {
    return this.historyItems.nth(index).getByTestId("history-item-date");
  }

  itemDuration(index: number): Locator {
    return this.historyItems.nth(index).getByTestId("history-item-duration");
  }

  async goto() {
    await this.page.goto("/parent/history");
  }

  async selectChild(name: string) {
    await this.childSelector.selectOption({ label: name });
  }

  async expectItemCount(n: number) {
    await expect(this.historyItems).toHaveCount(n);
  }
}

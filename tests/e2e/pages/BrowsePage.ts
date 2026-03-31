import { type Locator, type Page } from "@playwright/test";

export default class BrowsePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly filterChips: Locator;
  readonly contentGrid: Locator;
  readonly contentCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId("browse-page-title");
    this.filterChips = page.getByTestId("browse-filter-chip");
    this.contentGrid = page.getByTestId("browse-content-grid");
    this.contentCards = page.getByTestId("browse-content-card");
  }

  async goto() {
    await this.page.goto("/browse");
  }

  async selectFilter(name: string) {
    await this.page.getByTestId(`browse-filter-${name.toLowerCase().replace(/\s+/g, "-")}`).click();
  }

  async tapContentCard(index: number) {
    await this.contentCards.nth(index).click();
  }
}

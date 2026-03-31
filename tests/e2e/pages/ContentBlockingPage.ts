import { type Locator, type Page } from "@playwright/test";

export default class ContentBlockingPage {
  readonly page: Page;
  readonly contentList: Locator;
  readonly contentItems: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contentList = page.getByTestId("content-blocking-list");
    this.contentItems = page.getByTestId("content-blocking-item");
    this.searchInput = page.getByTestId("content-blocking-search-input");
  }

  itemThumbnail(index: number): Locator {
    return this.contentItems.nth(index).getByTestId("blocking-item-thumbnail");
  }

  itemTitle(index: number): Locator {
    return this.contentItems.nth(index).getByTestId("blocking-item-title");
  }

  itemPreviewButton(index: number): Locator {
    return this.contentItems.nth(index).getByTestId("blocking-item-preview-button");
  }

  itemBlockToggle(index: number): Locator {
    return this.contentItems.nth(index).getByTestId("blocking-item-block-toggle");
  }

  async goto() {
    await this.page.goto("/parent/content-blocking");
  }

  async toggleBlock(index: number) {
    await this.itemBlockToggle(index).click();
  }

  async previewContent(index: number) {
    await this.itemPreviewButton(index).click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }
}

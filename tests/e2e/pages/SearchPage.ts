import { type Locator, type Page } from "@playwright/test";

export default class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categoryButtons: Locator;
  readonly recentSearches: Locator;
  readonly searchResults: Locator;
  readonly resultCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId("search-input");
    this.categoryButtons = page.getByTestId("search-category-button");
    this.recentSearches = page.getByTestId("search-recent-searches");
    this.searchResults = page.getByTestId("search-results");
    this.resultCards = page.getByTestId("search-result-card");
  }

  async goto() {
    await this.page.goto("/search");
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }

  async tapCategory(name: string) {
    await this.page.getByTestId(`search-category-${name.toLowerCase().replace(/\s+/g, "-")}`).click();
  }

  async clearSearch() {
    await this.searchInput.clear();
  }
}

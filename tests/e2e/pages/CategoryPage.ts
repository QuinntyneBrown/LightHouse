import { type Locator, type Page } from "@playwright/test";

export default class CategoryPage {
  readonly page: Page;
  readonly categoryTitle: Locator;
  readonly filterChips: Locator;
  readonly contentGrid: Locator;
  readonly contentCards: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categoryTitle = page.getByTestId("category-title");
    this.filterChips = page.getByTestId("category-filter-chip");
    this.contentGrid = page.getByTestId("category-content-grid");
    this.contentCards = page.getByTestId("category-content-card");
    this.backButton = page.getByTestId("category-back-button");
  }

  cardThumbnail(index: number): Locator {
    return this.contentCards.nth(index).getByTestId("card-thumbnail");
  }

  cardTitle(index: number): Locator {
    return this.contentCards.nth(index).getByTestId("card-title");
  }

  cardAgeBadge(index: number): Locator {
    return this.contentCards.nth(index).getByTestId("card-age-badge");
  }

  cardDuration(index: number): Locator {
    return this.contentCards.nth(index).getByTestId("card-duration");
  }

  async goto(category: string) {
    await this.page.goto(`/browse/${category}`);
  }

  async selectAgeFilter(band: string) {
    await this.page.getByTestId(`category-filter-${band.toLowerCase()}`).click();
  }

  async tapContentCard(index: number) {
    await this.contentCards.nth(index).click();
  }
}

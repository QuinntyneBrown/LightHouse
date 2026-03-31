import { type Locator, type Page, expect } from "@playwright/test";

export default class HomePage {
  readonly page: Page;
  readonly heroBanner: Locator;
  readonly childName: Locator;
  readonly childAvatar: Locator;
  readonly greeting: Locator;
  readonly categoryButtons: Locator;
  readonly categoryRow: Locator;
  readonly featuredCarousel: Locator;
  readonly featuredCards: Locator;
  readonly playlistSection: Locator;
  readonly playlistCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroBanner = page.getByTestId("home-hero-banner");
    this.childName = page.getByTestId("home-child-name");
    this.childAvatar = page.getByTestId("home-child-avatar");
    this.greeting = page.getByTestId("home-greeting");
    this.categoryButtons = page.getByTestId("home-category-button");
    this.categoryRow = page.getByTestId("home-category-row");
    this.featuredCarousel = page.getByTestId("home-featured-carousel");
    this.featuredCards = page.getByTestId("home-featured-card");
    this.playlistSection = page.getByTestId("home-playlist-section");
    this.playlistCards = page.getByTestId("home-playlist-card");
  }

  async goto() {
    await this.page.goto("/home");
  }

  async tapCategory(name: string) {
    await this.page.getByTestId(`home-category-${name.toLowerCase().replace(/\s+/g, "-")}`).click();
  }

  async tapFeaturedCard(index: number) {
    await this.featuredCards.nth(index).click();
  }

  async tapPlaylist(index: number) {
    await this.playlistCards.nth(index).click();
  }

  async expectHeroVisible() {
    await expect(this.heroBanner).toBeVisible();
  }

  async expectCategoryCount(n: number) {
    await expect(this.categoryButtons).toHaveCount(n);
  }

  async expectFeaturedCardCount(n: number) {
    await expect(this.featuredCards).toHaveCount(n);
  }
}

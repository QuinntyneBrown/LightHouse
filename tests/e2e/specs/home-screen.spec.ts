import { test, expect } from "../fixtures/base.fixture";

test.describe("Home Screen — L2-1.1, L2-1.2, L2-1.3, L2-1.4", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should display hero section with child name and avatar", async ({ homePage }) => {
    await homePage.expectHeroVisible();
    await expect(homePage.childName).toBeVisible();
    await expect(homePage.childAvatar).toBeVisible();
  });

  test("should show warm greeting message in hero", async ({ homePage }) => {
    await expect(homePage.greeting).toBeVisible();
    await expect(homePage.greeting).not.toBeEmpty();
  });

  test("should apply age-band-appropriate color palette on hero", async ({ homePage }) => {
    const heroBanner = homePage.heroBanner;
    await expect(heroBanner).toBeVisible();
    const bgColor = await heroBanner.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("should display featured content carousel below hero", async ({ homePage }) => {
    await expect(homePage.featuredCarousel).toBeVisible();
  });

  test("should show 4-6 featured items in carousel", async ({ homePage }) => {
    const count = await homePage.featuredCards.count();
    expect(count).toBeGreaterThanOrEqual(4);
    expect(count).toBeLessThanOrEqual(6);
  });

  test("should display thumbnail, title, and content type on each featured card", async ({ homePage }) => {
    const firstCard = homePage.featuredCards.first();
    await expect(firstCard.getByTestId("featured-card-thumbnail")).toBeVisible();
    await expect(firstCard.getByTestId("featured-card-title")).toBeVisible();
    await expect(firstCard.getByTestId("featured-card-content-type")).toBeVisible();
  });

  test("should show category quick-access row with at least 5 buttons", async ({ homePage }) => {
    await expect(homePage.categoryRow).toBeVisible();
    const count = await homePage.categoryButtons.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("should include Bible Stories, Songs, Prayers, Devotionals categories", async ({ homePage }) => {
    const categories = ["Bible Stories", "Songs", "Prayers", "Devotionals"];
    for (const cat of categories) {
      await expect(
        homePage.page.getByTestId(`home-category-${cat.toLowerCase().replace(/\s+/g, "-")}`)
      ).toBeVisible();
    }
  });

  test("should have category buttons with minimum 64px touch targets", async ({ homePage }) => {
    const count = await homePage.categoryButtons.count();
    for (let i = 0; i < count; i++) {
      const box = await homePage.categoryButtons.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(64);
      expect(box!.height).toBeGreaterThanOrEqual(64);
    }
  });

  test("should display curated playlist section", async ({ homePage }) => {
    await expect(homePage.playlistSection).toBeVisible();
  });

  test("should show 2-3 playlist cards with cover art, title, and item count", async ({ homePage }) => {
    const count = await homePage.playlistCards.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(3);

    const firstCard = homePage.playlistCards.first();
    await expect(firstCard.getByTestId("playlist-card-cover-art")).toBeVisible();
    await expect(firstCard.getByTestId("playlist-card-title")).toBeVisible();
    await expect(firstCard.getByTestId("playlist-card-item-count")).toBeVisible();
  });

  test("should allow horizontal scrolling on featured carousel", async ({ homePage }) => {
    const carousel = homePage.featuredCarousel;
    const overflowX = await carousel.evaluate((el) => getComputedStyle(el).overflowX);
    expect(["scroll", "auto"]).toContain(overflowX);
  });
});

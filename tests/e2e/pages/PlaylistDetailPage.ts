import { type Locator, type Page } from "@playwright/test";

export default class PlaylistDetailPage {
  readonly page: Page;
  readonly coverArt: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly itemCount: Locator;
  readonly playAllButton: Locator;
  readonly itemsList: Locator;
  readonly items: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.coverArt = page.getByTestId("playlist-detail-cover-art");
    this.title = page.getByTestId("playlist-detail-title");
    this.description = page.getByTestId("playlist-detail-description");
    this.itemCount = page.getByTestId("playlist-detail-item-count");
    this.playAllButton = page.getByTestId("playlist-detail-play-all-button");
    this.itemsList = page.getByTestId("playlist-detail-items-list");
    this.items = page.getByTestId("playlist-detail-item");
    this.backButton = page.getByTestId("playlist-detail-back-button");
  }

  itemNumber(index: number): Locator {
    return this.items.nth(index).getByTestId("playlist-item-number");
  }

  itemThumbnail(index: number): Locator {
    return this.items.nth(index).getByTestId("playlist-item-thumbnail");
  }

  itemTitle(index: number): Locator {
    return this.items.nth(index).getByTestId("playlist-item-title");
  }

  itemDuration(index: number): Locator {
    return this.items.nth(index).getByTestId("playlist-item-duration");
  }

  itemPlayButton(index: number): Locator {
    return this.items.nth(index).getByTestId("playlist-item-play-button");
  }

  async goto(id: string) {
    await this.page.goto(`/playlists/${id}`);
  }

  async playAll() {
    await this.playAllButton.click();
  }

  async playItem(index: number) {
    await this.itemPlayButton(index).click();
  }
}

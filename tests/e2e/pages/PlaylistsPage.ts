import { type Locator, type Page } from "@playwright/test";

export default class PlaylistsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly playlistCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId("playlists-page-title");
    this.playlistCards = page.getByTestId("playlists-card");
  }

  async goto() {
    await this.page.goto("/playlists");
  }

  async tapPlaylist(index: number) {
    await this.playlistCards.nth(index).click();
  }
}

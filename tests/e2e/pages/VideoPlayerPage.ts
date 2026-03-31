import { type Locator, type Page } from "@playwright/test";

export default class VideoPlayerPage {
  readonly page: Page;
  readonly videoPlayer: Locator;
  readonly playPauseButton: Locator;
  readonly rewindButton: Locator;
  readonly forwardButton: Locator;
  readonly progressBar: Locator;
  readonly titleText: Locator;
  readonly seriesText: Locator;
  readonly playlistQueue: Locator;
  readonly queueItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.videoPlayer = page.getByTestId("video-player");
    this.playPauseButton = page.getByTestId("video-play-pause-button");
    this.rewindButton = page.getByTestId("video-rewind-button");
    this.forwardButton = page.getByTestId("video-forward-button");
    this.progressBar = page.getByTestId("video-progress-bar");
    this.titleText = page.getByTestId("video-title-text");
    this.seriesText = page.getByTestId("video-series-text");
    this.playlistQueue = page.getByTestId("video-playlist-queue");
    this.queueItems = page.getByTestId("video-queue-item");
  }

  queueItemThumbnail(index: number): Locator {
    return this.queueItems.nth(index).getByTestId("queue-item-thumbnail");
  }

  queueItemTitle(index: number): Locator {
    return this.queueItems.nth(index).getByTestId("queue-item-title");
  }

  queueItemDuration(index: number): Locator {
    return this.queueItems.nth(index).getByTestId("queue-item-duration");
  }

  async goto(id: string) {
    await this.page.goto(`/play/${id}`);
  }

  async play() {
    await this.playPauseButton.click();
  }

  async pause() {
    await this.playPauseButton.click();
  }

  async rewind() {
    await this.rewindButton.click();
  }

  async forward() {
    await this.forwardButton.click();
  }

  async tapQueueItem(index: number) {
    await this.queueItems.nth(index).click();
  }
}

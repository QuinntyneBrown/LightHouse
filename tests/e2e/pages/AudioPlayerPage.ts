import { type Locator, type Page } from "@playwright/test";

export default class AudioPlayerPage {
  readonly page: Page;
  readonly coverArt: Locator;
  readonly titleText: Locator;
  readonly subtitleText: Locator;
  readonly progressBar: Locator;
  readonly currentTime: Locator;
  readonly totalTime: Locator;
  readonly playPauseButton: Locator;
  readonly skipPrevButton: Locator;
  readonly skipNextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.coverArt = page.getByTestId("audio-cover-art");
    this.titleText = page.getByTestId("audio-title-text");
    this.subtitleText = page.getByTestId("audio-subtitle-text");
    this.progressBar = page.getByTestId("audio-progress-bar");
    this.currentTime = page.getByTestId("audio-current-time");
    this.totalTime = page.getByTestId("audio-total-time");
    this.playPauseButton = page.getByTestId("audio-play-pause-button");
    this.skipPrevButton = page.getByTestId("audio-skip-prev-button");
    this.skipNextButton = page.getByTestId("audio-skip-next-button");
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

  async skipPrev() {
    await this.skipPrevButton.click();
  }

  async skipNext() {
    await this.skipNextButton.click();
  }
}

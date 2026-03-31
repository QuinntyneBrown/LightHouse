import { test, expect } from "../fixtures/base.fixture";

test.describe("Playback — L2-2.1, L2-2.2, L2-2.3", () => {
  test.describe("Video playback", () => {
    test.beforeEach(async ({ videoPlayerPage }) => {
      await videoPlayerPage.goto("sample-video-1");
    });

    test("should display full-width video player on playback screen", async ({ videoPlayerPage }) => {
      await expect(videoPlayerPage.videoPlayer).toBeVisible();
      const box = await videoPlayerPage.videoPlayer.boundingBox();
      const viewport = videoPlayerPage.page.viewportSize();
      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();
      expect(box!.width).toBeCloseTo(viewport!.width, -1);
    });

    test("should show oversized play/pause control", async ({ videoPlayerPage }) => {
      await expect(videoPlayerPage.playPauseButton).toBeVisible();
      const box = await videoPlayerPage.playPauseButton.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(48);
      expect(box!.height).toBeGreaterThanOrEqual(48);
    });

    test("should show rewind 10-second button", async ({ videoPlayerPage }) => {
      await expect(videoPlayerPage.rewindButton).toBeVisible();
    });

    test("should show forward 10-second button", async ({ videoPlayerPage }) => {
      await expect(videoPlayerPage.forwardButton).toBeVisible();
    });

    test("should display content title below video player", async ({ videoPlayerPage }) => {
      await expect(videoPlayerPage.titleText).toBeVisible();
      await expect(videoPlayerPage.titleText).not.toBeEmpty();
    });

    test("should display series name below video player", async ({ videoPlayerPage }) => {
      await expect(videoPlayerPage.seriesText).toBeVisible();
      await expect(videoPlayerPage.seriesText).not.toBeEmpty();
    });

    test("should show playlist queue below video player", async ({ videoPlayerPage }) => {
      await expect(videoPlayerPage.playlistQueue).toBeVisible();
    });

    test("should display thumbnails in playlist queue items", async ({ videoPlayerPage }) => {
      const firstItem = videoPlayerPage.queueItems.first();
      await expect(firstItem).toBeVisible();
      await expect(videoPlayerPage.queueItemThumbnail(0)).toBeVisible();
    });

    test("should display titles and durations in playlist queue items", async ({ videoPlayerPage }) => {
      await expect(videoPlayerPage.queueItemTitle(0)).toBeVisible();
      await expect(videoPlayerPage.queueItemTitle(0)).not.toBeEmpty();
      await expect(videoPlayerPage.queueItemDuration(0)).toBeVisible();
      await expect(videoPlayerPage.queueItemDuration(0)).not.toBeEmpty();
    });
  });

  test.describe("Audio playback", () => {
    test.beforeEach(async ({ audioPlayerPage }) => {
      await audioPlayerPage.goto("sample-audio-1");
    });

    test("should display large cover art for audio content", async ({ audioPlayerPage }) => {
      await expect(audioPlayerPage.coverArt).toBeVisible();
      const box = await audioPlayerPage.coverArt.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(200);
      expect(box!.height).toBeGreaterThanOrEqual(200);
    });

    test("should show progress bar for audio playback", async ({ audioPlayerPage }) => {
      await expect(audioPlayerPage.progressBar).toBeVisible();
    });

    test("should center playback controls for audio mode", async ({ audioPlayerPage }) => {
      const playButton = audioPlayerPage.playPauseButton;
      await expect(playButton).toBeVisible();
      const box = await playButton.boundingBox();
      const viewport = audioPlayerPage.page.viewportSize();
      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();
      const buttonCenter = box!.x + box!.width / 2;
      const viewportCenter = viewport!.width / 2;
      expect(Math.abs(buttonCenter - viewportCenter)).toBeLessThan(50);
    });

    test("should show skip previous and skip next buttons for audio", async ({ audioPlayerPage }) => {
      await expect(audioPlayerPage.skipPrevButton).toBeVisible();
      await expect(audioPlayerPage.skipNextButton).toBeVisible();
    });
  });
});

import { type Locator, type Page, expect } from "@playwright/test";

export default class AppShellPage {
  readonly page: Page;
  readonly bottomTabBar: Locator;
  readonly homeTab: Locator;
  readonly browseTab: Locator;
  readonly playlistsTab: Locator;
  readonly parentTab: Locator;
  readonly activeTab: Locator;
  readonly profileSwitcherButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bottomTabBar = page.getByTestId("app-bottom-tab-bar");
    this.homeTab = page.getByTestId("app-tab-home");
    this.browseTab = page.getByTestId("app-tab-browse");
    this.playlistsTab = page.getByTestId("app-tab-playlists");
    this.parentTab = page.getByTestId("app-tab-parent");
    this.activeTab = page.getByTestId("app-tab-active");
    this.profileSwitcherButton = page.getByTestId("app-profile-switcher-button");
  }

  async tapHome() {
    await this.homeTab.click();
  }

  async tapBrowse() {
    await this.browseTab.click();
  }

  async tapPlaylists() {
    await this.playlistsTab.click();
  }

  async tapParent() {
    await this.parentTab.click();
  }

  async expectTabCount(n: number) {
    const tabs = this.bottomTabBar.getByRole("tab");
    await expect(tabs).toHaveCount(n);
  }

  async expectActiveTab(name: string) {
    await expect(this.page.getByTestId(`app-tab-${name.toLowerCase()}`)).toHaveAttribute("aria-selected", "true");
  }

  async expectTabTouchTargetMinSize(minPx: number) {
    const tabs = [this.homeTab, this.browseTab, this.playlistsTab, this.parentTab];
    for (const tab of tabs) {
      const box = await tab.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(minPx);
      expect(box!.height).toBeGreaterThanOrEqual(minPx);
    }
  }
}

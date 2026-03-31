import { test as base } from "@playwright/test";
import WelcomePage from "../pages/WelcomePage";
import SignupPage from "../pages/SignupPage";
import ConsentPage from "../pages/ConsentPage";
import LoginPage from "../pages/LoginPage";
import PINSetupPage from "../pages/PINSetupPage";
import ProfileCreationPage from "../pages/ProfileCreationPage";
import HomePage from "../pages/HomePage";
import BrowsePage from "../pages/BrowsePage";
import CategoryPage from "../pages/CategoryPage";
import PlaylistsPage from "../pages/PlaylistsPage";
import PlaylistDetailPage from "../pages/PlaylistDetailPage";
import VideoPlayerPage from "../pages/VideoPlayerPage";
import AudioPlayerPage from "../pages/AudioPlayerPage";
import SearchPage from "../pages/SearchPage";
import ProfileSwitcherPage from "../pages/ProfileSwitcherPage";
import PINEntryPage from "../pages/PINEntryPage";
import ParentDashboardPage from "../pages/ParentDashboardPage";
import ScreenTimePage from "../pages/ScreenTimePage";
import ContentBlockingPage from "../pages/ContentBlockingPage";
import ViewHistoryPage from "../pages/ViewHistoryPage";
import ScreenTimeOverlayPage from "../pages/ScreenTimeOverlayPage";
import AppShellPage from "../pages/AppShellPage";

type PageObjects = {
  welcomePage: WelcomePage;
  signupPage: SignupPage;
  consentPage: ConsentPage;
  loginPage: LoginPage;
  pinSetupPage: PINSetupPage;
  profileCreationPage: ProfileCreationPage;
  homePage: HomePage;
  browsePage: BrowsePage;
  categoryPage: CategoryPage;
  playlistsPage: PlaylistsPage;
  playlistDetailPage: PlaylistDetailPage;
  videoPlayerPage: VideoPlayerPage;
  audioPlayerPage: AudioPlayerPage;
  searchPage: SearchPage;
  profileSwitcherPage: ProfileSwitcherPage;
  pinEntryPage: PINEntryPage;
  parentDashboardPage: ParentDashboardPage;
  screenTimePage: ScreenTimePage;
  contentBlockingPage: ContentBlockingPage;
  viewHistoryPage: ViewHistoryPage;
  screenTimeOverlayPage: ScreenTimeOverlayPage;
  appShellPage: AppShellPage;
};

export const test = base.extend<PageObjects>({
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  consentPage: async ({ page }, use) => {
    await use(new ConsentPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  pinSetupPage: async ({ page }, use) => {
    await use(new PINSetupPage(page));
  },
  profileCreationPage: async ({ page }, use) => {
    await use(new ProfileCreationPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  browsePage: async ({ page }, use) => {
    await use(new BrowsePage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
  playlistsPage: async ({ page }, use) => {
    await use(new PlaylistsPage(page));
  },
  playlistDetailPage: async ({ page }, use) => {
    await use(new PlaylistDetailPage(page));
  },
  videoPlayerPage: async ({ page }, use) => {
    await use(new VideoPlayerPage(page));
  },
  audioPlayerPage: async ({ page }, use) => {
    await use(new AudioPlayerPage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  profileSwitcherPage: async ({ page }, use) => {
    await use(new ProfileSwitcherPage(page));
  },
  pinEntryPage: async ({ page }, use) => {
    await use(new PINEntryPage(page));
  },
  parentDashboardPage: async ({ page }, use) => {
    await use(new ParentDashboardPage(page));
  },
  screenTimePage: async ({ page }, use) => {
    await use(new ScreenTimePage(page));
  },
  contentBlockingPage: async ({ page }, use) => {
    await use(new ContentBlockingPage(page));
  },
  viewHistoryPage: async ({ page }, use) => {
    await use(new ViewHistoryPage(page));
  },
  screenTimeOverlayPage: async ({ page }, use) => {
    await use(new ScreenTimeOverlayPage(page));
  },
  appShellPage: async ({ page }, use) => {
    await use(new AppShellPage(page));
  },
});

export { expect } from "@playwright/test";

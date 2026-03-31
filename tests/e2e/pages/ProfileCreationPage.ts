import { type Locator, type Page } from "@playwright/test";

export default class ProfileCreationPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly ageBandSelector: Locator;
  readonly avatarPicker: Locator;
  readonly avatarOptions: Locator;
  readonly createButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByTestId("profile-name-input");
    this.ageBandSelector = page.getByTestId("profile-age-band-selector");
    this.avatarPicker = page.getByTestId("profile-avatar-picker");
    this.avatarOptions = page.getByTestId("profile-avatar-option");
    this.createButton = page.getByTestId("profile-create-button");
    this.backButton = page.getByTestId("profile-back-button");
  }

  ageBandOption(band: string): Locator {
    return this.page.getByTestId(`profile-age-band-${band.toLowerCase()}`);
  }

  avatarOption(index: number): Locator {
    return this.avatarOptions.nth(index);
  }

  async goto() {
    await this.page.goto("/parent/profiles/new");
  }

  async createProfile(name: string, ageBand: string, avatarIndex: number = 0) {
    await this.nameInput.fill(name);
    await this.ageBandOption(ageBand).click();
    await this.avatarOption(avatarIndex).click();
    await this.createButton.click();
  }
}

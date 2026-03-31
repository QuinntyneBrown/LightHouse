import { type Locator, type Page } from "@playwright/test";

export default class PINSetupPage {
  readonly page: Page;
  readonly pinDots: Locator;
  readonly deleteButton: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pinDots = page.getByTestId("pin-setup-dots");
    this.deleteButton = page.getByTestId("pin-setup-delete-button");
    this.confirmationMessage = page.getByTestId("pin-setup-confirmation-message");
  }

  numpadButton(digit: number): Locator {
    return this.page.getByTestId(`pin-setup-numpad-${digit}`);
  }

  async goto() {
    await this.page.goto("/pin-setup");
  }

  async enterPIN(pin: string) {
    for (const digit of pin) {
      await this.numpadButton(Number(digit)).click();
    }
  }

  async confirmPIN(pin: string) {
    await this.enterPIN(pin);
  }
}

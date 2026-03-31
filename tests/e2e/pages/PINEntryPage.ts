import { type Locator, type Page } from "@playwright/test";

export default class PINEntryPage {
  readonly page: Page;
  readonly pinDots: Locator;
  readonly errorMessage: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pinDots = page.getByTestId("pin-entry-dots");
    this.errorMessage = page.getByTestId("pin-entry-error-message");
    this.cancelButton = page.getByTestId("pin-entry-cancel-button");
  }

  numpadButton(digit: number): Locator {
    return this.page.getByTestId(`pin-entry-numpad-${digit}`);
  }

  get numpad(): Locator {
    return this.page.getByTestId("pin-entry-numpad");
  }

  async enterPIN(pin: string) {
    for (const digit of pin) {
      await this.numpadButton(Number(digit)).click();
    }
  }
}

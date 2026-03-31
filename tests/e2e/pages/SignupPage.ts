import { type Locator, type Page } from "@playwright/test";

export default class SignupPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("signup-email-input");
    this.passwordInput = page.getByTestId("signup-password-input");
    this.confirmPasswordInput = page.getByTestId("signup-confirm-password-input");
    this.submitButton = page.getByTestId("signup-submit-button");
    this.errorMessage = page.getByTestId("signup-error-message");
  }

  async goto() {
    await this.page.goto("/signup");
  }

  async signup(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }
}

import { type Locator, type Page } from "@playwright/test";

export default class WelcomePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly tagline: Locator;
  readonly emailSignupButton: Locator;
  readonly googleSignupButton: Locator;
  readonly appleSignupButton: Locator;
  readonly termsText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId("welcome-logo");
    this.tagline = page.getByTestId("welcome-tagline");
    this.emailSignupButton = page.getByTestId("signup-email-button");
    this.googleSignupButton = page.getByTestId("signup-google-button");
    this.appleSignupButton = page.getByTestId("signup-apple-button");
    this.termsText = page.getByTestId("terms-text");
  }

  async goto() {
    await this.page.goto("/welcome");
  }

  async clickEmailSignup() {
    await this.emailSignupButton.click();
  }

  async clickGoogleSignup() {
    await this.googleSignupButton.click();
  }

  async clickAppleSignup() {
    await this.appleSignupButton.click();
  }
}

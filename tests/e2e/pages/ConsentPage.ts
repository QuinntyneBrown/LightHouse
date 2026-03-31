import { type Locator, type Page } from "@playwright/test";

export default class ConsentPage {
  readonly page: Page;
  readonly consentCheckbox: Locator;
  readonly ageVerification: Locator;
  readonly submitButton: Locator;
  readonly privacyPolicyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.consentCheckbox = page.getByTestId("consent-checkbox");
    this.ageVerification = page.getByTestId("consent-age-verification");
    this.submitButton = page.getByTestId("consent-submit-button");
    this.privacyPolicyLink = page.getByTestId("consent-privacy-policy-link");
  }

  async goto() {
    await this.page.goto("/consent");
  }

  async giveConsent() {
    await this.consentCheckbox.check();
    await this.ageVerification.check();
    await this.submitButton.click();
  }
}

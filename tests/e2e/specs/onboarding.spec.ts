import { test, expect } from "../fixtures/base.fixture";
import { TEST_PARENT, TEST_CHILD_SPROUT, TEST_PIN } from "../fixtures/test-data";

test.describe("Onboarding — L2-3.1, L2-3.2, L2-3.3", () => {
  test("should display welcome screen with logo and tagline", async ({ welcomePage }) => {
    await welcomePage.goto();
    await expect(welcomePage.logo).toBeVisible();
    await expect(welcomePage.tagline).toBeVisible();
  });

  test("should show email, Google, and Apple sign-up buttons", async ({ welcomePage }) => {
    await welcomePage.goto();
    await expect(welcomePage.emailSignupButton).toBeVisible();
    await expect(welcomePage.googleSignupButton).toBeVisible();
    await expect(welcomePage.appleSignupButton).toBeVisible();
  });

  test("should navigate to signup form when email button is clicked", async ({ welcomePage, page }) => {
    await welcomePage.goto();
    await welcomePage.clickEmailSignup();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("should allow email signup with valid credentials", async ({ signupPage, page }) => {
    await signupPage.goto();
    await signupPage.signup(TEST_PARENT.email, TEST_PARENT.password);
    await expect(page).toHaveURL(/\/consent/);
  });

  test("should show COPPA parental consent after signup", async ({ consentPage }) => {
    await consentPage.goto();
    await expect(consentPage.consentCheckbox).toBeVisible();
    await expect(consentPage.ageVerification).toBeVisible();
    await expect(consentPage.privacyPolicyLink).toBeVisible();
  });

  test("should navigate to profile creation after consent", async ({ consentPage, page }) => {
    await consentPage.goto();
    await consentPage.giveConsent();
    await expect(page).toHaveURL(/\/parent\/profiles\/new/);
  });

  test("should show name input field on profile creation", async ({ profileCreationPage }) => {
    await profileCreationPage.goto();
    await expect(profileCreationPage.nameInput).toBeVisible();
  });

  test("should show age-band selector with Seedlings, Sprouts, and Explorers options", async ({
    profileCreationPage,
  }) => {
    await profileCreationPage.goto();
    await expect(profileCreationPage.ageBandSelector).toBeVisible();
    await expect(profileCreationPage.ageBandOption("Seedlings")).toBeVisible();
    await expect(profileCreationPage.ageBandOption("Sprouts")).toBeVisible();
    await expect(profileCreationPage.ageBandOption("Explorers")).toBeVisible();
  });

  test("should show avatar picker with at least 6 character options", async ({ profileCreationPage }) => {
    await profileCreationPage.goto();
    await expect(profileCreationPage.avatarPicker).toBeVisible();
    await expect(profileCreationPage.avatarOptions).toHaveCount(6, { timeout: 5000 });
  });

  test("should create profile successfully with all fields filled", async ({ profileCreationPage, page }) => {
    await profileCreationPage.goto();
    await profileCreationPage.createProfile(TEST_CHILD_SPROUT.name, TEST_CHILD_SPROUT.ageBand, 0);
    await expect(page).toHaveURL(/\/pin-setup/);
  });

  test("should prompt for 4-digit PIN setup after first profile", async ({ pinSetupPage }) => {
    await pinSetupPage.goto();
    await expect(pinSetupPage.pinDots).toBeVisible();
  });

  test("should show 4 PIN dots on PIN setup screen", async ({ pinSetupPage, page }) => {
    await pinSetupPage.goto();
    const dots = pinSetupPage.pinDots.locator("[data-testid='pin-dot']");
    await expect(dots).toHaveCount(4);
  });

  test("should show numeric keypad with digits 0-9", async ({ pinSetupPage }) => {
    await pinSetupPage.goto();
    for (let i = 0; i <= 9; i++) {
      await expect(pinSetupPage.numpadButton(i)).toBeVisible();
    }
  });

  test("should reject mismatched PIN confirmation", async ({ pinSetupPage }) => {
    await pinSetupPage.goto();
    await pinSetupPage.enterPIN(TEST_PIN);
    await pinSetupPage.confirmPIN("5678");
    await expect(pinSetupPage.confirmationMessage).toContainText(/mismatch|don't match|try again/i);
  });

  test("should complete PIN setup with matching confirmation", async ({ pinSetupPage, page }) => {
    await pinSetupPage.goto();
    await pinSetupPage.enterPIN(TEST_PIN);
    await pinSetupPage.confirmPIN(TEST_PIN);
    await expect(page).toHaveURL(/\/home/);
  });
});

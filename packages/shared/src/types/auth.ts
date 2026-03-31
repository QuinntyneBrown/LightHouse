export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface ConsentRequest {
  consentType: "coppa" | "terms" | "privacy";
  version: string;
  granted: boolean;
}

export interface PinSetupRequest {
  pin: string;
}

export interface PinVerifyRequest {
  pin: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface OAuthCallbackQuery {
  code: string;
  state?: string;
}

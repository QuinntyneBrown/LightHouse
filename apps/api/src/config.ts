export interface AppConfig {
  port: number;
  host: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtAccessExpiry: string;
  jwtRefreshExpiry: string;
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
  keycloakClientSecret: string;
  minioEndpoint: string;
  minioPort: number;
  minioAccessKey: string;
  minioSecretKey: string;
  minioBucket: string;
  minioUseSSL: boolean;
  meilisearchUrl: string;
  meilisearchApiKey: string;
  corsOrigin: string;
  nodeEnv: string;
}

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function loadConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT ?? "3000", 10),
    host: process.env.HOST ?? "0.0.0.0",
    databaseUrl: requireEnv("DATABASE_URL", "postgresql://lighthouse:lighthouse@localhost:5432/lighthouse"),
    jwtSecret: requireEnv("JWT_SECRET", "dev-jwt-secret-change-in-production"),
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY ?? "15m",
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY ?? "7d",
    keycloakUrl: process.env.KEYCLOAK_URL ?? "http://localhost:8080",
    keycloakRealm: process.env.KEYCLOAK_REALM ?? "lighthouse",
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID ?? "lighthouse-api",
    keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
    minioEndpoint: process.env.MINIO_ENDPOINT ?? "localhost",
    minioPort: parseInt(process.env.MINIO_PORT ?? "9000", 10),
    minioAccessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
    minioSecretKey: process.env.MINIO_SECRET_KEY ?? "minioadmin",
    minioBucket: process.env.MINIO_BUCKET ?? "lighthouse-media",
    minioUseSSL: process.env.MINIO_USE_SSL === "true",
    meilisearchUrl: process.env.MEILISEARCH_URL ?? "http://localhost:7700",
    meilisearchApiKey: process.env.MEILISEARCH_API_KEY ?? "dev-meili-key",
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
}

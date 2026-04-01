export function getLoggerConfig(env: string): Record<string, unknown> | boolean {
  if (env === "test") {
    return false;
  }

  if (env === "development") {
    return {
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    };
  }

  return {
    level: "info",
  };
}

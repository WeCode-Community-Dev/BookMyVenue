import { getEnv } from "../utils/getEnv";

const envConfig = () => ({
  PORT: getEnv("PORT", "8000"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  MONGO_URI: getEnv("MONGO_URI", ""),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", ""),

  JWT_ACCESS_SECRET: getEnv("JWT_SECRET", "secert_jwt"),
  JWT_ACCESS_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m") as string,
});

export const Env = envConfig();

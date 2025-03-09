import dotenv from "dotenv";

dotenv.config();

const readEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not provided in .env file`);
  return value;
};

const readEnvArray = (key: string): string[] => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not provided in .env file`);
  return value.split(",");
};

export const envStore = {
  // service
  env: readEnv("ENV"),
  port: readEnv("PORT"),
  corsOrigins: readEnvArray("CORS_ORIGINS"),

  // database
  dbHost: readEnv("DATABASE_HOST"),
  dbPort: readEnv("DATABASE_PORT"),
  dbName: readEnv("DATABASE_NAME"),
  dbUser: readEnv("DATABASE_USER"),
  dbPassword: readEnv("DATABASE_PASSWORD"),
  dbSchema: readEnv("DATABASE_SCHEMA"),
};

const isProd = () => {
  return envStore.env?.toLowerCase() === "prod";
};

const isDev = () => {
  return envStore.env?.toLowerCase() === "dev";
};

const isLocal = () => {
  return envStore.env?.toLowerCase() === "local";
};

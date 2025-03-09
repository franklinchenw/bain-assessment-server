import { Knex } from "knex";
import { envStore } from "./src/utilities/env-store";

const connection = {
  host: envStore.dbHost,
  user: envStore.dbUser,
  password: envStore.dbPassword,
  database: envStore.dbName,
  port: Number(envStore.dbPort),
};

const knexConfig: Knex.Config = {
  client: "postgresql",
  connection,
  migrations: {
    directory: "./src/migrations",
    extension: "ts",
    schemaName: envStore.dbSchema,
  },
  searchPath: [envStore.dbSchema],
};

export default knexConfig;

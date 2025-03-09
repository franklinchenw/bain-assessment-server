import knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../../knexfile";

dotenv.config();

export const db = knex(knexConfig);

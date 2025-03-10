import { Knex } from "knex";
import { envStore } from "../utilities/env-store";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("user", (table) => {
      table.string("id").primary();

      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    })
    .createTable("distance_query", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw(`uuid_generate_v4()`));
      table.string("address1").notNullable();
      table.string("address2").notNullable();
      table.string("unit").notNullable().defaultTo("KM");
      table.jsonb("metadata").notNullable().defaultTo("{}");
      table.string("request_user_id").references("user.id").notNullable();

      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user").dropTable("distance_query");
}

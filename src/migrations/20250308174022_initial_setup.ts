import { Knex } from "knex";
import { envStore } from "../utilities/env-store";

export async function up(knex: Knex): Promise<void> {
  // Create schema and set it as default
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS ${envStore.dbSchema}`);
  await knex.raw(`SET search_path TO ${envStore.dbSchema}`);

  // Create the extension without specifying schema (it will use public)
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE');
  await knex.raw('CREATE EXTENSION "uuid-ossp"');

  // Create your schema
  await knex.schema.raw(`CREATE SCHEMA IF NOT EXISTS ${envStore.dbSchema}`);

  // Update search path to include both schemas
  await knex.raw(`SET search_path TO ${envStore.dbSchema}, public`);

  // Create function
  return knex.schema.raw(
    `CREATE OR REPLACE FUNCTION ${envStore.dbSchema}.set_updated_at_func()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        AS $function$
        BEGIN
            NEW."updatedAt" = NOW();
            RETURN NEW;
        END;
        $function$;`
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`DROP FUNCTION IF EXISTS ${envStore.dbSchema}.set_updated_at_func()`);
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE');
}

import { Migration, sql } from 'kysely';

/**
 * Initial migration for settings up the database.
 */
export const initialMigration: Migration = {
  async up(db) {
    await db.schema
      .createTable('url')
      .addColumn('short_code', 'varchar', (col) =>
        col.notNull().primaryKey().unique(),
      )
      .addColumn('original_url', 'text', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .addColumn('expires_at', 'timestamp')
      .execute();
  },
  async down(db) {
    await db.schema.dropTable('url').execute();
  },
};

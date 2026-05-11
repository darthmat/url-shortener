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
      .addColumn('original_url', 'varchar', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .addColumn('expires_at', 'timestamp', (col) => col.notNull())
      .execute();

    await db.schema
      .createIndex('url_short_code_idx')
      .on('url')
      .column('short_code')
      .execute();
  },
  async down(db) {
    await db.schema.dropTable('url').execute();
  },
};

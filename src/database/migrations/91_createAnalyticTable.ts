import { Migration, sql } from 'kysely';

/**
 * Migration for creating the analytics table.
 */
export const analyticsTableMigration: Migration = {
  async up(db) {
    await db.schema
      .createTable('analytics')
      .addColumn('id', 'bigserial', (col) => col.primaryKey())
      .addColumn('short_code', 'varchar', (col) => col.notNull())
      .addColumn('ip_address', 'varchar', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .execute();

    await db.schema
      .createIndex('analytics_short_code_idx')
      .on('analytics')
      .column('short_code')
      .execute();
  },
  async down(db) {
    await db.schema.dropTable('analytics').execute();
  },
};

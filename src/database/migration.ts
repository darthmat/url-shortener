import { Migrator } from 'kysely';
import { dbConfig } from '../dbConfig.js';
import { createDatabase } from './db.js';
import { UrlShortenerMigrationProvider } from './migrations/index.js';

await using db = createDatabase(dbConfig);

const migrator = new Migrator({
  db,
  provider: new UrlShortenerMigrationProvider(),
});

const { error, results } = await migrator.migrateToLatest();

results?.forEach((it) => {
  if (it.status === 'Success') {
    console.log(`Migration '${it.migrationName}' was executed successfully.`);
  } else if (it.status === 'Error') {
    console.error(`Failed to execute migration '${it.migrationName}.'`);
  }
});

if (error) {
  console.error('Failed to migrate.');
  console.error(error);
  process.exit(1);
}

if (!results?.length) {
  console.log('No migrations run.');
}

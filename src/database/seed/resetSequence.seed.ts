import { configDatabase } from '@/config';
import { sql } from 'drizzle-orm';
export async function resetSequences() {
  try {
    console.log('🔄 Resetting PostgreSQL sequences after seeding...');

    // Get all the table names using the database
    const tableNames = await configDatabase.db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    );
    console.log(tableNames);

    // Reset each sequence to the max ID + 1 for each table
    for (const table of tableNames.rows) {
      try {
        await configDatabase.db.execute(
          sql.raw(`
          SELECT setval(
            pg_get_serial_sequence('${table}', 'id'),
            COALESCE((SELECT MAX(id) FROM ${table}), 1),
            COALESCE((SELECT MAX(id) FROM ${table}) IS NOT NULL, false)
          );
        `),
        );
      } catch (error: any) {
        // Some tables might not exist or might not have sequences, that's ok
        console.warn(`⚠️ Could not reset sequence for ${table}: ${error.message}`);
      }
    }

    console.log('✅ All sequences reset successfully!');
  } catch (error: any) {
    console.error('❌ Error resetting sequences:', error.message);
    throw error;
  }
}

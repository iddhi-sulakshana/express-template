import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema/schema';
import { Pool } from 'pg';
import { ENV } from '@/core';

const connectionString = ENV.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
  connectionString: connectionString,
});

// Create drizzle instance
const db = drizzle(pool, { schema: schema });

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbInstance = typeof db | DbTransaction;

// Export the client for migrations
export default { pool, db };

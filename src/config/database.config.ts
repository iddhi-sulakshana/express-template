import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv-safe';

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

// Create postgres connection
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client);

// Export the client for migrations
export { client };

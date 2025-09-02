import { db } from 'config/database.config';
import { sql } from 'drizzle-orm';
import winston from 'winston';

export async function checkDatabaseConnection() {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { database } = await getDatabaseDetails();
      winston.info(`Connecting to database '${database}'`);
      if (attempt > 1) winston.info(`Checking database connection attempt ${attempt}...`);
      await db.execute(sql`SELECT 1`);
      return true;
    } catch (error: any) {
      winston.error('Error connecting to the database: ' + error.message, error);
      if (attempt === maxRetries) {
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      winston.warn(`Database connection attempt ${attempt} failed. Retrying...`);
    }
  }
  return false;
}

async function getDatabaseDetails() {
  const url = process.env.DATABASE_URL;
  const urlObject = new URL(url);
  const database = urlObject.pathname.split('/').pop();
  const host = urlObject.hostname;
  const port = urlObject.port;
  const username = urlObject.username;
  const password = urlObject.password;
  return { database, host, port, username, password };
}

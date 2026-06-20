import { createClient } from '@libsql/client';
import { neon } from '@neondatabase/serverless';

let dbClient = null;
let dbType = 'sqlite'; // 'sqlite' or 'postgres'
let initialized = false;

function getClient() {
  if (process.env.DATABASE_URL) {
    dbType = 'postgres';
    if (!dbClient) {
      dbClient = neon(process.env.DATABASE_URL);
    }
  } else {
    dbType = 'sqlite';
    if (!dbClient) {
      dbClient = createClient({ url: 'file:local.db' });
    }
  }
  return dbClient;
}

export async function ensureTables() {
  if (initialized) return;
  
  const client = getClient();
  
  try {
    if (dbType === 'postgres') {
      await client(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
    initialized = true;
    console.log(`Database tables verified/created successfully using: ${dbType}`);
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    throw error;
  }
}

/**
 * Execute a query with compatible parameters.
 * Replace '?' with '$1', '$2', etc. if Postgres is used.
 */
export async function query(sqlQuery, params = []) {
  await ensureTables();
  const client = getClient();
  
  try {
    if (dbType === 'postgres') {
      let index = 1;
      const pgQuery = sqlQuery.replace(/\?/g, () => `$${index++}`);
      const rows = await client(pgQuery, params);
      return rows;
    } else {
      const result = await client.execute({ sql: sqlQuery, args: params });
      return result.rows;
    }
  } catch (error) {
    console.error(`Database query error on [${dbType}]:`, error);
    throw error;
  }
}

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
// import { Env } from '@/libs/Env';
import * as schema from '@/models/Schema';

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with Next.js Boilerplate
export const createDbConnection = () => {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/local.db';
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1'),
    max: 1,
  });

  return drizzle({
    client: pool,
    schema,
  });
};

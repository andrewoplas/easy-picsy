import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './apps/backend/.env' });

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/photobooth_dev',
  },
  schema: './apps/backend/src/database/schema/index.ts',
  out: './apps/backend/src/database/migrations',
  verbose: true,
  strict: true,
});
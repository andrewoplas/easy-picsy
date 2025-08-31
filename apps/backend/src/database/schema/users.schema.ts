import { pgTable, uuid, varchar, timestamp, text, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Supabase auth integration
  supabaseId: uuid('supabase_id').unique().notNull(),
  
  // User information
  email: varchar('email', { length: 255 }).unique().notNull(),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  
  // Role and permissions
  role: varchar('role', { length: 50 }).default('user').notNull(), // 'admin', 'user'
  permissions: jsonb('permissions').default('[]'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
  
  // Metadata
  metadata: jsonb('metadata').default('{}'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
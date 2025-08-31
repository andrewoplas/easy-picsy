import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ConfigService } from '../config/config.service';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private sql: postgres.Sql;
  public db: PostgresJsDatabase<typeof schema>;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const databaseUrl = this.configService.databaseUrl;
    
    // Create postgres connection
    this.sql = postgres(databaseUrl, {
      max: 10, // Maximum number of connections
      idle_timeout: 20,
      connect_timeout: 10,
    });

    // Create drizzle instance
    this.db = drizzle(this.sql, { schema });

    // Test connection
    try {
      await this.sql`SELECT 1`;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.sql) {
      await this.sql.end();
      console.log('Database connection closed');
    }
  }

  getDb() {
    return this.db;
  }
}
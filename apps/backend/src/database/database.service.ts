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
    
    // Skip database initialization if no URL provided
    if (!databaseUrl) {
      console.log('⚠️ No DATABASE_URL provided, skipping database connection');
      return;
    }
    
    try {
      // Create postgres connection
      this.sql = postgres(databaseUrl, {
        max: 10, // Maximum number of connections
        idle_timeout: 20,
        connect_timeout: 30, // Increased timeout for Railway
      });

      // Create drizzle instance
      this.db = drizzle(this.sql, { schema });

      // Test connection with retry
      let retries = 3;
      while (retries > 0) {
        try {
          await this.sql`SELECT 1`;
          console.log('✅ Database connected successfully');
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            console.error('❌ Database connection failed after retries:', error);
            // Don't throw error - let app start without database
            console.log('🚀 App will start without database connection');
            return;
          }
          console.log(`⏳ Database connection failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      // Don't throw error - let app start without database
      console.log('🚀 App will start without database connection');
    }
  }

  async onModuleDestroy() {
    if (this.sql) {
      await this.sql.end();
      console.log('Database connection closed');
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Check DATABASE_URL configuration.');
    }
    return this.db;
  }

  isConnected(): boolean {
    return !!this.db && !!this.sql;
  }
}
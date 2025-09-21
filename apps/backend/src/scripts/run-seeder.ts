import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app/app.module';
import { DatabaseService } from '../database/database.service';
import { DatabaseSeeder } from '../database/seed';

async function runSeeder() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const databaseService = app.get(DatabaseService);
  
  const seeder = new DatabaseSeeder(databaseService);
  await seeder.seedAll();
  
  await app.close();
  console.log('🎉 Seeding completed!');
}

runSeeder().catch(console.error);

import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { BoothLoggingService } from './booth-logging.service';
import { BoothLoggingController } from './booth-logging.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    SupabaseModule,
  ],
  controllers: [LoggingController, BoothLoggingController],
  providers: [LoggingService, BoothLoggingService],
  exports: [LoggingService, BoothLoggingService],
})
export class LoggingModule {}
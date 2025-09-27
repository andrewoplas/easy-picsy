import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { BoothLoggingService } from './booth-logging.service';
import { BoothLoggingController } from './booth-logging.controller';
import { RequestLoggingInterceptor } from './request-logging.interceptor';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { QrCodesModule } from '../qr-codes/qr-codes.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    SupabaseModule,
    QrCodesModule,
  ],
  controllers: [LoggingController, BoothLoggingController],
  providers: [
    LoggingService, 
    BoothLoggingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
  exports: [LoggingService, BoothLoggingService],
})
export class LoggingModule {}
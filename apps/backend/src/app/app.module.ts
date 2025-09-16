import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';
import { LoggingModule } from '../logging/logging.module';
import { PaymongoModule } from '../paymongo/paymongo.module';
import { QrCodesModule } from '../qr-codes/qr-codes.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    EventsModule,
    PaymongoModule,
    QrCodesModule,
    RealtimeModule,
    WebhooksModule,
    LoggingModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

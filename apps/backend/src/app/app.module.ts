import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { PaymongoModule } from '../paymongo/paymongo.module';
import { QrCodesModule } from '../qr-codes/qr-codes.module';
import { RealtimeModule } from '../realtime/realtime.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

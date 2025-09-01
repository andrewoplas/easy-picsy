import { Module, forwardRef } from '@nestjs/common';
import { QrCodesService } from './qr-codes.service';
import { QrCodesController } from './qr-codes.controller';
import { DatabaseModule } from '../database/database.module';
import { PaymongoModule } from '../paymongo/paymongo.module';
import { UsersModule } from '../users/users.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    DatabaseModule, 
    PaymongoModule, 
    UsersModule, 
    SupabaseModule,
    forwardRef(() => RealtimeModule),
  ],
  controllers: [QrCodesController],
  providers: [QrCodesService],
  exports: [QrCodesService],
})
export class QrCodesModule {}
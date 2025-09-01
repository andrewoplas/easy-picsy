import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { RealtimeService } from './realtime.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SupabaseModule, UsersModule],
  providers: [EventsGateway, RealtimeService],
  exports: [EventsGateway, RealtimeService],
})
export class RealtimeModule {}
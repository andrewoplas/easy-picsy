import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';
import { EventsGateway } from './events.gateway';
import { RealtimeService } from './realtime.service';

@Module({
  imports: [SupabaseModule, UsersModule],
  controllers: [],
  providers: [EventsGateway, RealtimeService],
  exports: [EventsGateway, RealtimeService],
})
export class RealtimeModule {}

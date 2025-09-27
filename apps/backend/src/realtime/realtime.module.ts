import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';
import { EventsGateway } from './events.gateway';
import { LongPollingController } from './long-polling.controller';
import { RealtimeService } from './realtime.service';
import { TestGateway } from './test-gateway';

@Module({
  imports: [SupabaseModule, UsersModule],
  controllers: [LongPollingController],
  providers: [EventsGateway, TestGateway, RealtimeService],
  exports: [EventsGateway, TestGateway, RealtimeService],
})
export class RealtimeModule {}

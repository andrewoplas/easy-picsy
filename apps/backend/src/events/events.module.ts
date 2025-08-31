import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController, PublicEventsController } from './events.controller';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [DatabaseModule, UsersModule, SupabaseModule],
  controllers: [EventsController, PublicEventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
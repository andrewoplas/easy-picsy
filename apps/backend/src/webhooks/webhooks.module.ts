import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { WebhookReconciliationService } from './webhook-reconciliation.service';
import { DatabaseModule } from '../database/database.module';
import { PaymongoModule } from '../paymongo/paymongo.module';
import { QrCodesModule } from '../qr-codes/qr-codes.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    LoggingModule,
    PaymongoModule,
    forwardRef(() => QrCodesModule),
    forwardRef(() => RealtimeModule),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService, WebhookReconciliationService],
  exports: [WebhooksService, WebhookReconciliationService],
})
export class WebhooksModule {}
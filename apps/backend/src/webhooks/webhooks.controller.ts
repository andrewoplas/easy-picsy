import { Body, Controller, Headers, HttpException, HttpStatus, Logger, Post, Request } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { PaymongoWebhookPayload } from './webhooks.service';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('webhook')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({
    summary: 'PayMongo webhook endpoint',
    description: 'Handle PayMongo webhook events for payment status updates',
  })
  @ApiHeader({
    name: 'paymongo-signature',
    description: 'PayMongo webhook signature for verification',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook signature or payload',
  })
  async handleWebhook(
    @Body() payload: PaymongoWebhookPayload,
    @Headers('paymongo-signature') signature: string,
    @Request() req: { headers: Record<string, string> },
  ) {
    this.logger.log('payload', payload);
    // Best Practice #2: Log incoming webhook immediately
    const webhookId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`[${webhookId}] Received PayMongo webhook:`, {
      type: payload.data?.type,
      eventType: payload.data?.attributes?.type,
      eventId: payload.data?.id,
      timestamp: new Date().toISOString(),
    });

    try {
      // Best Practice #5: Verify signature (optional but recommended)
      // We do this synchronously but quickly
      await this.webhooksService.verifyWebhookSignature(payload, signature);

      // Best Practice #2: Respond immediately with 2xx
      // Queue the event for async processing instead of processing it synchronously
      setImmediate(async () => {
        try {
          // Best Practice #3: Log processing start
          this.logger.log(`[${webhookId}] Processing webhook asynchronously`);

          await this.webhooksService.processWebhookEvent(payload, {
            'paymongo-signature': signature,
            'user-agent': req.headers['user-agent'],
            'content-type': req.headers['content-type'],
            'webhook-id': webhookId,
          });

          // Best Practice #3: Log successful processing
          this.logger.log(`[${webhookId}] Webhook processed successfully`);
        } catch (asyncError) {
          // Best Practice #3: Log processing errors for monitoring
          this.logger.error(`[${webhookId}] Async webhook processing failed:`, {
            error: (asyncError as Error).message,
            stack: (asyncError as Error).stack,
            eventType: payload.data?.attributes?.type,
            eventId: payload.data?.id,
          });
        }
      });

      // Best Practice #2: Return 200 OK immediately
      return {
        status: 'accepted',
        message: 'Webhook received and queued for processing',
        webhookId,
      };
    } catch (error) {
      // Only catch signature verification errors here
      // These should fail fast and return appropriate status
      this.logger.error(`[${webhookId}] Webhook validation failed:`, {
        error: (error as Error).message,
        signature: signature?.substring(0, 50) + '...',
      });

      // Best Practice: Return 401 for signature failures so PayMongo knows it's an auth issue
      if ((error as Error).message?.includes('signature')) {
        throw new HttpException('Invalid webhook signature', HttpStatus.UNAUTHORIZED);
      }

      // For other validation errors, return 400
      throw new HttpException('Webhook validation failed', HttpStatus.BAD_REQUEST);
    }
  }
}

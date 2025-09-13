import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LoggingService } from './logging.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@ApiTags('Logs')
@ApiBearerAuth('JWT-auth')
@Controller('logs')
@UseGuards(SupabaseAuthGuard)
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get('webhooks')
  @ApiOperation({ 
    summary: 'Get webhook logs',
    description: 'Retrieve PayMongo webhook logs with optional filtering'
  })
  @ApiQuery({ name: 'eventType', required: false, description: 'Filter by event type' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by processing status' })
  @ApiQuery({ name: 'qrCodeId', required: false, description: 'Filter by QR code ID' })
  @ApiQuery({ name: 'eventId', required: false, description: 'Filter by event ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit results (default: 50)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'Webhook logs retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          eventType: { type: 'string' },
          paymongoEventId: { type: 'string' },
          status: { type: 'string', enum: ['received', 'processing', 'completed', 'failed'] },
          qrCodeId: { type: 'string', format: 'uuid' },
          eventId: { type: 'string', format: 'uuid' },
          paymentIntentId: { type: 'string' },
          signatureVerified: { type: 'boolean' },
          errorMessage: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          processedAt: { type: 'string', format: 'date-time' },
        }
      }
    }
  })
  async getWebhookLogs(
    @Query('eventType') eventType?: string,
    @Query('status') status?: string,
    @Query('qrCodeId') qrCodeId?: string,
    @Query('eventId') eventId?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return await this.loggingService.getWebhookLogs({
      eventType,
      status,
      qrCodeId,
      eventId,
      limit: limit || 50,
      offset: offset || 0,
    });
  }

  @Get('events')
  @ApiOperation({ 
    summary: 'Get event logs',
    description: 'Retrieve application event logs with optional filtering'
  })
  @ApiQuery({ name: 'eventType', required: false, description: 'Filter by event type' })
  @ApiQuery({ name: 'source', required: false, description: 'Filter by event source' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by event status' })
  @ApiQuery({ name: 'qrCodeId', required: false, description: 'Filter by QR code ID' })
  @ApiQuery({ name: 'eventId', required: false, description: 'Filter by event ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit results (default: 50)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'Event logs retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          eventType: { type: 'string' },
          source: { type: 'string', enum: ['webhook', 'api', 'cron_job', 'manual'] },
          status: { type: 'string', enum: ['success', 'error', 'warning'] },
          message: { type: 'string' },
          qrCodeId: { type: 'string', format: 'uuid' },
          eventId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          eventData: { type: 'object' },
          metadata: { type: 'object' },
          errorDetails: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        }
      }
    }
  })
  async getEventLogs(
    @Query('eventType') eventType?: string,
    @Query('source') source?: string,
    @Query('status') status?: string,
    @Query('qrCodeId') qrCodeId?: string,
    @Query('eventId') eventId?: string,
    @Query('userId') userId?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return await this.loggingService.getEventLogs({
      eventType,
      source: source as any,
      status: status as any,
      qrCodeId,
      eventId,
      userId,
      limit: limit || 50,
      offset: offset || 0,
    });
  }

  @Get('summary')
  @ApiOperation({ 
    summary: 'Get logs summary',
    description: 'Get summary statistics of webhook and event logs'
  })
  @ApiResponse({
    status: 200,
    description: 'Logs summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        webhooks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              count: { type: 'number' },
            }
          }
        },
        events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              eventType: { type: 'string' },
              status: { type: 'string' },
              count: { type: 'number' },
            }
          }
        }
      }
    }
  })
  async getLogsSummary() {
    return await this.loggingService.getLogsSummary();
  }
}
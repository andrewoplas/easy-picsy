import { Controller, Get, Post, Body, Query, UseGuards, ParseIntPipe, Param, ValidationPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { BoothLoggingService } from './booth-logging.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import {
  LogBoothEventDto,
  LogBoothEventResponseDto,
  BoothSessionsResponseDto,
  BoothLogDto,
  BoothEventStatsDto,
} from './dto';

@ApiTags('Booth Logs')
@Controller('logs/booth')
export class BoothLoggingController {
  constructor(private readonly boothLoggingService: BoothLoggingService) {}

  @Post('event')
  @ApiOperation({
    summary: 'Log DSLR booth event',
    description: 'Log a single DSLR booth event with structured data. Public endpoint for booth integration.'
  })
  @ApiBody({
    type: LogBoothEventDto,
    description: 'Booth event data to log',
    examples: {
      sessionStart: {
        summary: 'Session Start Event',
        value: {
          sessionId: 'abc-123-def-456',
          boothEvent: {
            event_type: 'session_start',
            param1: 'PrintAndGIF',
            timestamp: '16:20:7.287'
          },
          eventId: 'event-uuid',
          qrCodeId: 'qr-uuid',
          boothIdentifier: 'Booth-1'
        }
      },
      countdown: {
        summary: 'Countdown Progress Event',
        value: {
          sessionId: 'abc-123-def-456',
          boothEvent: {
            event_type: 'countdown',
            param1: '75',
            timestamp: '16:20:12.624'
          },
          boothIdentifier: 'Booth-1'
        }
      },
      printing: {
        summary: 'Printing Event',
        value: {
          sessionId: 'abc-123-def-456',
          boothEvent: {
            event_type: 'printing',
            param1: 'c:\\booth\\Prints\\file.jpg',
            param2: '1',
            param3: 'DS-RX1',
            timestamp: '16:19:47.130'
          },
          boothIdentifier: 'Booth-1'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Booth event logged successfully',
    type: LogBoothEventResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid event data'
  })
  // TODO: Add booth authentication/authorization
  async logBoothEvent(@Body(ValidationPipe) logData: LogBoothEventDto): Promise<LogBoothEventResponseDto> {
    const logId = await this.boothLoggingService.logBoothEvent(logData);
    return {
      logId,
      message: `Booth event ${logData.boothEvent.event_type} logged successfully`
    };
  }

  @Get('sessions')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get paginated booth sessions',
    description: 'Retrieve booth sessions with pagination. Admin access required.'
  })
  @ApiQuery({ name: 'eventId', required: false, description: 'Filter by event ID' })
  @ApiQuery({ name: 'boothIdentifier', required: false, description: 'Filter by booth identifier' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved successfully',
    type: BoothSessionsResponseDto
  })
  async getBoothSessions(
    @Query('eventId') eventId?: string,
    @Query('boothIdentifier') boothIdentifier?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ): Promise<BoothSessionsResponseDto> {
    return await this.boothLoggingService.getBoothSessions({
      eventId,
      boothIdentifier,
      page: page || 1,
      pageSize: pageSize || 10,
    }) as BoothSessionsResponseDto;
  }

  @Get('session/:sessionId/events')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all events for a specific session',
    description: 'Retrieve all booth events for a specific session in chronological order. Admin access required.'
  })
  @ApiParam({ name: 'sessionId', type: 'string', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session events retrieved successfully',
    type: [BoothLogDto]
  })
  async getSessionEvents(@Param('sessionId') sessionId: string): Promise<BoothLogDto[]> {
    return await this.boothLoggingService.getSessionEvents(sessionId) as unknown as BoothLogDto[];
  }

  @Get('events')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get booth event logs',
    description: 'Retrieve booth event logs with optional filtering. Admin access required.'
  })
  @ApiQuery({ name: 'boothEventType', required: false, description: 'Filter by booth event type' })
  @ApiQuery({ name: 'sessionId', required: false, description: 'Filter by session ID' })
  @ApiQuery({ name: 'eventId', required: false, description: 'Filter by event ID' })
  @ApiQuery({ name: 'qrCodeId', required: false, description: 'Filter by QR code ID' })
  @ApiQuery({ name: 'boothIdentifier', required: false, description: 'Filter by booth identifier' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit results (default: 50)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'Booth events retrieved successfully',
    type: [BoothLogDto]
  })
  async getBoothEvents(
    @Query('boothEventType') boothEventType?: string,
    @Query('sessionId') sessionId?: string,
    @Query('eventId') eventId?: string,
    @Query('qrCodeId') qrCodeId?: string,
    @Query('boothIdentifier') boothIdentifier?: string,
    @Query('status') status?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<BoothLogDto[]> {
    return await this.boothLoggingService.getBoothLogs({
      boothEventType: boothEventType as any,
      sessionId,
      eventId,
      qrCodeId,
      boothIdentifier,
      status: status as any,
      limit: limit || 50,
      offset: offset || 0,
    }) as unknown as BoothLogDto[];
  }

  @Get('stats')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get booth event statistics',
    description: 'Get statistical overview of booth events. Admin access required.'
  })
  @ApiQuery({ name: 'eventId', required: false, description: 'Filter stats by event ID' })
  @ApiQuery({ name: 'boothIdentifier', required: false, description: 'Filter stats by booth identifier' })
  @ApiQuery({ name: 'sessionId', required: false, description: 'Filter stats by session ID' })
  @ApiResponse({
    status: 200,
    description: 'Booth statistics retrieved successfully',
    type: [BoothEventStatsDto]
  })
  async getBoothStats(
    @Query('eventId') eventId?: string,
    @Query('boothIdentifier') boothIdentifier?: string,
    @Query('sessionId') sessionId?: string,
  ): Promise<BoothEventStatsDto[]> {
    return await this.boothLoggingService.getBoothEventStats({
      eventId,
      boothIdentifier,
      sessionId,
    });
  }
}

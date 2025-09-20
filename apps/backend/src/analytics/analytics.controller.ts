import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto, EventAnalyticsDto, TotalAnalyticsDto, DateRangeDto } from './dto';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
@UseGuards(SupabaseAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('total')
  @ApiOperation({
    summary: 'Get total analytics',
    description: 'Get aggregated analytics across all events or a specific event including revenue, session times, and print statistics',
  })
  @ApiQuery({
    name: 'eventId',
    required: false,
    type: String,
    description: 'Event ID to filter analytics for a specific event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for analytics range (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for analytics range (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Total analytics retrieved successfully',
    type: TotalAnalyticsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date range or event ID provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found (when eventId is provided)',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while calculating analytics',
  })
  async getTotalAnalytics(
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: AnalyticsQueryDto,
  ): Promise<TotalAnalyticsDto> {
    try {
      const dateRange = this.validateAndBuildDateRange(query);
      return await this.analyticsService.getTotalAnalytics(query.eventId, dateRange);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to retrieve total analytics', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('events')
  @ApiOperation({
    summary: 'Get per-event analytics',
    description: 'Get analytics data for each event including earnings, session times, and print counts. Use eventId to filter for a specific event.',
  })
  @ApiQuery({
    name: 'eventId',
    required: false,
    type: String,
    description: 'Event ID to filter analytics for a specific event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for analytics range (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for analytics range (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Event analytics retrieved successfully',
    type: [EventAnalyticsDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date range or event ID provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found (when eventId is provided)',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while calculating analytics',
  })
  async getEventAnalytics(
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: AnalyticsQueryDto,
  ): Promise<EventAnalyticsDto[]> {
    try {
      const dateRange = this.validateAndBuildDateRange(query);
      return await this.analyticsService.getEventAnalytics(query.eventId, dateRange);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to retrieve event analytics', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('events/:eventId')
  @ApiOperation({
    summary: 'Get analytics for a specific event',
    description: 'Get detailed analytics data for a specific event including earnings, session times, and print counts',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for analytics range (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for analytics range (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Event analytics retrieved successfully',
    type: EventAnalyticsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date range provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found or inactive',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error while calculating analytics',
  })
  async getSingleEventAnalytics(
    @Param('eventId') eventId: string,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: Omit<AnalyticsQueryDto, 'eventId'>,
  ): Promise<EventAnalyticsDto> {
    try {
      const dateRange = this.validateAndBuildDateRange(query);
      const results = await this.analyticsService.getEventAnalytics(eventId, dateRange);
      
      if (results.length === 0) {
        throw new HttpException('Event not found or inactive', HttpStatus.NOT_FOUND);
      }
      
      return results[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to retrieve event analytics', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Validate and build date range - DRY helper method
   */
  private validateAndBuildDateRange(query: AnalyticsQueryDto): DateRangeDto | undefined {
    const { startDate, endDate } = query;

    // If neither date is provided, return undefined (no filtering)
    if (!startDate && !endDate) {
      return undefined;
    }

    // Both dates must be provided when using date filtering
    if (!startDate || !endDate) {
      throw new HttpException(
        'Both startDate and endDate must be provided when using date filtering',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate date objects (class-validator already converted strings to Date)
    if (
      !(startDate instanceof Date) ||
      !(endDate instanceof Date) ||
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      throw new HttpException(
        'Invalid date format. Please use ISO string format (YYYY-MM-DDTHH:mm:ss.sssZ)',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Start date must be before or equal to end date
    if (startDate > endDate) {
      throw new HttpException('Start date must be before or equal to end date', HttpStatus.BAD_REQUEST);
    }

    return { start: startDate, end: endDate };
  }
}

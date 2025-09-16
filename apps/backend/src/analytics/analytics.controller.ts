import { Controller, Get, HttpException, HttpStatus, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { AnalyticsService, DateRange } from './analytics.service';
import { AnalyticsQueryDto, EventAnalyticsDto, TotalAnalyticsDto } from './dto';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
@UseGuards(SupabaseAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('total')
  @ApiOperation({
    summary: 'Get total analytics',
    description: 'Get aggregated analytics across all events including revenue, session times, and print statistics',
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
    description: 'Invalid date range provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
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
      return await this.analyticsService.getTotalAnalytics(dateRange);
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
    description: 'Get analytics data for each event including earnings, session times, and print counts',
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
    description: 'Invalid date range provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
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
      return await this.analyticsService.getEventAnalytics(dateRange);
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
  private validateAndBuildDateRange(query: AnalyticsQueryDto): DateRange | undefined {
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

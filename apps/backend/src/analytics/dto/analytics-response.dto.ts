import { ApiProperty } from '@nestjs/swagger';

export class TotalPrintAnalyticsDto {
  @ApiProperty({
    description: 'Total prints from single sessions (not reprints)',
    example: 150,
  })
  singleSession: number;

  @ApiProperty({
    description: 'Total reprints across all sessions',
    example: 45,
  })
  reprints: number;

  @ApiProperty({
    description: 'Average prints per event',
    example: 12.5,
  })
  averagePerEvent: number;

  @ApiProperty({
    description: 'Average reprints per event',
    example: 3.2,
  })
  averageReprintsPerEvent: number;
}

export class TotalAnalyticsDto {
  @ApiProperty({
    description: 'Total net revenue from all completed payments',
    example: 15750.0,
  })
  totalNetRevenue: number;

  @ApiProperty({
    description: 'Total withdrawable/cashout-able revenue',
    example: 15750.0,
  })
  totalWithdrawableRevenue: number;

  @ApiProperty({
    description: 'Average session time in seconds',
    example: 180,
  })
  averageSessionTime: number;

  @ApiProperty({
    description: 'Print statistics breakdown',
    type: TotalPrintAnalyticsDto,
  })
  totalPrints: TotalPrintAnalyticsDto;
}

export class EventAnalyticsDto {
  @ApiProperty({
    description: 'Event ID',
    example: 'event-uuid-123',
  })
  eventId: string;

  @ApiProperty({
    description: 'Event name',
    example: 'Wedding Photo Booth',
  })
  eventName: string;

  @ApiProperty({
    description: 'Running earnings for this event',
    example: 2500.0,
  })
  runningEarnings: number;

  @ApiProperty({
    description: 'Session average time for this event in seconds',
    example: 165,
  })
  sessionAverageTime: number;

  @ApiProperty({
    description: 'Number of prints for this event',
    example: 24,
  })
  numberOfPrints: number;

  @ApiProperty({
    description: 'Number of reprints for this event',
    example: 7,
  })
  numberOfReprints: number;
}

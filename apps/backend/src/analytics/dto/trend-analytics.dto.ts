import { ApiProperty } from '@nestjs/swagger';

export class TrendDataDto {
  @ApiProperty({
    description: 'Percentage change from previous period',
    example: 15.5,
  })
  value: number;

  @ApiProperty({
    description: 'Whether the trend is positive (increase) or negative (decrease)',
    example: true,
  })
  isPositive: boolean;

  @ApiProperty({
    description: 'Previous period value for comparison',
    example: 80.0,
  })
  previousValue: number;

  @ApiProperty({
    description: 'Current period value',
    example: 92.4,
  })
  currentValue: number;
}

export class TrendPrintAnalyticsDto {
  @ApiProperty({
    description: 'Current period prints from single sessions',
    example: 150,
  })
  singleSession: number;

  @ApiProperty({
    description: 'Current period reprints',
    example: 45,
  })
  reprints: number;

  @ApiProperty({
    description: 'Current period average prints per event',
    example: 12.5,
  })
  averagePerEvent: number;

  @ApiProperty({
    description: 'Current period average reprints per event',
    example: 3.2,
  })
  averageReprintsPerEvent: number;

  @ApiProperty({
    description: 'Trend data for single session prints',
    type: TrendDataDto,
  })
  singleSessionTrend: TrendDataDto;

  @ApiProperty({
    description: 'Trend data for reprints',
    type: TrendDataDto,
  })
  reprintsTrend: TrendDataDto;

  @ApiProperty({
    description: 'Trend data for average prints per event',
    type: TrendDataDto,
  })
  averagePerEventTrend: TrendDataDto;

  @ApiProperty({
    description: 'Trend data for average reprints per event',
    type: TrendDataDto,
  })
  averageReprintsPerEventTrend: TrendDataDto;
}

export class TrendTotalAnalyticsDto {
  @ApiProperty({
    description: 'Current period total net revenue',
    example: 15750.0,
  })
  totalNetRevenue: number;

  @ApiProperty({
    description: 'Current period total withdrawable revenue',
    example: 15750.0,
  })
  totalWithdrawableRevenue: number;

  @ApiProperty({
    description: 'Current period average session time in seconds',
    example: 180,
  })
  averageSessionTime: number;

  @ApiProperty({
    description: 'Current period print statistics with trends',
    type: TrendPrintAnalyticsDto,
  })
  totalPrints: TrendPrintAnalyticsDto;

  @ApiProperty({
    description: 'Trend data for total net revenue',
    type: TrendDataDto,
  })
  totalNetRevenueTrend: TrendDataDto;

  @ApiProperty({
    description: 'Trend data for average session time',
    type: TrendDataDto,
  })
  averageSessionTimeTrend: TrendDataDto;
}

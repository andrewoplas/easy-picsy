import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class AnalyticsQueryDto {
  @ApiPropertyOptional({
    description: 'Event ID to filter analytics for a specific event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Start date for analytics range (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date for analytics range (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  })
  endDate?: Date;
}

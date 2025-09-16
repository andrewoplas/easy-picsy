import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date for the analytics range',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDate()
  start: Date;

  @ApiProperty({
    description: 'End date for the analytics range',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsDate()
  end: Date;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({
    description: 'Event unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Event name',
    example: 'Birthday Party Photobooth',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: "Capture memories at John's 25th birthday celebration",
  })
  description?: string;

  @ApiProperty({
    description: 'Price per photobooth session',
    example: '50.00',
    type: 'string',
    format: 'decimal',
  })
  price: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'PHP',
  })
  currency: string;

  @ApiProperty({
    description: 'Whether the event is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'User ID who created the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Event creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Event last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  updatedAt: Date;
}

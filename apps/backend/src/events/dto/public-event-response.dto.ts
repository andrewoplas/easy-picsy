import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicEventResponseDto {
  @ApiProperty({ 
    description: 'Event unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({ 
    description: 'Event name',
    example: 'Birthday Party Photobooth'
  })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Event description',
    example: 'Capture memories at John\'s 25th birthday celebration'
  })
  description?: string | null;

  @ApiProperty({ 
    description: 'Price per photobooth session',
    example: '50.00',
    type: 'string',
    format: 'decimal'
  })
  price: string;

  @ApiProperty({ 
    description: 'Currency code',
    example: 'PHP'
  })
  currency: string;

  @ApiProperty({ 
    description: 'Whether the event is active',
    example: true
  })
  isActive: boolean;
}

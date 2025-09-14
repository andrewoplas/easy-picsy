import { ApiProperty } from '@nestjs/swagger';

export class EventDeleteResponseDto {
  @ApiProperty({ 
    description: 'Deletion confirmation message',
    example: 'Event deleted successfully'
  })
  message: string;
}

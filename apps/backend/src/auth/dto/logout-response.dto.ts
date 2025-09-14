import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ 
    description: 'Logout status message',
    example: 'Logout successful'
  })
  message: string;
}

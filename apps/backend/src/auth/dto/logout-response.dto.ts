import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ 
    description: 'Logout status message',
    example: 'Logout successful'
  })
  @IsString()
  message: string;
}

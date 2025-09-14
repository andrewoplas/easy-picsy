import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestDto {
  @ApiProperty({ 
    description: 'Valid refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  refresh_token: string;
}

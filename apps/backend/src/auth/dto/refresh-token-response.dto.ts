import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
  @ApiProperty({ 
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  access_token: string;

  @ApiProperty({ 
    description: 'Token expiration time in seconds',
    example: 3600
  })
  @IsNumber()
  expires_in: number;
}

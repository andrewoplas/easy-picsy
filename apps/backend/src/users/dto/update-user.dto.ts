import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'URL of the user avatar image',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
import { IsString, IsEmail, IsUUID, IsOptional, IsDateString, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  id: string;

  @ApiProperty({ 
    description: 'Supabase user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  supabaseId: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ 
    description: 'User full name',
    example: 'John Doe'
  })
  @IsString()
  @IsOptional()
  fullName?: string | null;

  @ApiPropertyOptional({ 
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg'
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string | null;

  @ApiProperty({ 
    description: 'User role',
    example: 'user',
    enum: ['admin', 'user']
  })
  @IsString()
  role: string;

  @ApiPropertyOptional({ 
    description: 'User permissions array',
    example: ['read', 'write'],
    type: [String]
  })
  @IsArray()
  @IsOptional()
  permissions?: string[];

  @ApiProperty({ 
    description: 'User creation timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ 
    description: 'User last update timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  @IsDateString()
  updatedAt: Date;

  @ApiPropertyOptional({ 
    description: 'User last login timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  lastLoginAt?: Date | null;

  @ApiPropertyOptional({ 
    description: 'Additional user metadata',
    example: { preferences: { theme: 'dark' } }
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

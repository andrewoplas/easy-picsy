import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ 
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({ 
    description: 'Supabase user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  supabaseId: string;
}

export class VerifyTokenResponseDto {
  @ApiProperty({ 
    description: 'Whether the token is valid',
    example: true
  })
  valid: boolean;

  @ApiProperty({ 
    description: 'User information associated with the token',
    type: AuthUserDto
  })
  user: AuthUserDto;
}

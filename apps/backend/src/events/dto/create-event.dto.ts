import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Length, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event name',
    example: 'Birthday Party Photobooth',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Capture memories at John\'s 25th birthday celebration'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price per photobooth session',
    example: 50.00,
    minimum: 0,
    type: 'number',
    format: 'decimal'
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'PHP',
    default: 'PHP',
    minLength: 3,
    maxLength: 3
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string = 'PHP';

  @ApiPropertyOptional({
    description: 'Whether the event is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
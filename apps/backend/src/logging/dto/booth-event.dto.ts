import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BoothEventDataDto {
  @ApiProperty({
    description: 'Type of booth event',
    example: 'session_start',
    enum: [
      'session_start',
      'countdown_start', 
      'countdown',
      'capture_start',
      'file_download',
      'processing_start',
      'sharing_screen',
      'printing',
      'file_upload',
      'session_end'
    ]
  })
  @IsString()
  event_type: string;

  @ApiPropertyOptional({
    description: 'First parameter (usage depends on event type)',
    example: 'PrintAndGIF'
  })
  @IsOptional()
  @IsString()
  param1?: string;

  @ApiPropertyOptional({
    description: 'Second parameter (usage depends on event type)',
    example: '1'
  })
  @IsOptional()
  @IsString()
  param2?: string;

  @ApiPropertyOptional({
    description: 'Third parameter (usage depends on event type)',
    example: 'DS-RX1'
  })
  @IsOptional()
  @IsString()
  param3?: string;

  @ApiPropertyOptional({
    description: 'Fourth parameter (usage depends on event type)',
    example: 'Album Name'
  })
  @IsOptional()
  @IsString()
  param4?: string;

  @ApiProperty({
    description: 'Booth event timestamp in HH:MM:SS.mmm format',
    example: '16:20:7.287'
  })
  @IsString()
  timestamp: string;
}

export class LogBoothEventDto {
  @ApiProperty({
    description: 'Client-generated session identifier (any unique string format)',
    example: 'session-abc123-2024'
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Booth event data',
    type: BoothEventDataDto
  })
  @ValidateNested()
  @Type(() => BoothEventDataDto)
  boothEvent: BoothEventDataDto;

  @ApiPropertyOptional({
    description: 'Event ID (photo booth package/event)',
    example: 'event-uuid-123',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'QR code ID associated with this session',
    example: 'qr-uuid-456',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  qrCodeId?: string;

  @ApiPropertyOptional({
    description: 'Physical booth identifier',
    example: 'Booth-1'
  })
  @IsOptional()
  @IsString()
  boothIdentifier?: string;

  @ApiPropertyOptional({
    description: 'Event status',
    example: 'success',
    enum: ['success', 'error', 'warning']
  })
  @IsOptional()
  @IsIn(['success', 'error', 'warning'])
  status?: 'success' | 'error' | 'warning';

  @ApiPropertyOptional({
    description: 'Custom message for this event',
    example: 'Custom booth event message'
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Error details if status is error',
    example: 'Printer connection failed'
  })
  @IsOptional()
  @IsString()
  errorDetails?: string;
}

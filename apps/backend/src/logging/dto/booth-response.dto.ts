import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogBoothEventResponseDto {
  @ApiProperty({
    description: 'Generated log ID',
    example: 'log-uuid-123',
    format: 'uuid'
  })
  logId: string;

  @ApiProperty({
    description: 'Success message',
    example: 'Booth event session_start logged successfully'
  })
  message: string;
}

export class EventInfoDto {
  @ApiProperty({
    description: 'Event ID',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({
    description: 'Event name',
    example: 'Wedding Photo Booth Package'
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Premium photo booth package for wedding events'
  })
  description?: string | null;

  @ApiProperty({
    description: 'Event price',
    example: '15000.00'
  })
  price: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'PHP'
  })
  currency: string;

  @ApiProperty({
    description: 'Whether the event is active',
    example: true
  })
  isActive: boolean;
}

export class BoothLogDto {
  @ApiProperty({
    description: 'Log entry ID',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({
    description: 'Session ID (client-generated identifier)',
    example: 'session-abc123-2024'
  })
  sessionId: string;

  @ApiProperty({
    description: 'Booth event type',
    example: 'session_start'
  })
  boothEventType: string;

  @ApiProperty({
    description: 'Original booth timestamp',
    example: '16:20:7.287'
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Event parameter 1',
    example: 'PrintAndGIF'
  })
  param1?: string | null;

  @ApiPropertyOptional({
    description: 'Event parameter 2',
    example: '1'
  })
  param2?: string | null;

  @ApiPropertyOptional({
    description: 'Event parameter 3',
    example: 'DS-RX1'
  })
  param3?: string | null;

  @ApiPropertyOptional({
    description: 'Event parameter 4',
    example: 'Album Name'
  })
  param4?: string | null;

  @ApiPropertyOptional({
    description: 'Associated event ID',
    format: 'uuid'
  })
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Associated QR code ID',
    format: 'uuid'
  })
  qrCodeId?: string;

  @ApiPropertyOptional({
    description: 'Booth identifier',
    example: 'Booth-1'
  })
  boothIdentifier?: string;

  @ApiProperty({
    description: 'Event status',
    example: 'success',
    enum: ['success', 'error', 'warning']
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Human-readable message',
    example: 'Booth session started with mode: PrintAndGIF'
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Error details if applicable'
  })
  errorDetails?: string;

  @ApiProperty({
    description: 'When this log was created',
    format: 'date-time'
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Associated event information',
    type: EventInfoDto
  })
  event?: EventInfoDto;
}

export class GroupedSessionDto {
  @ApiProperty({
    description: 'Session ID (client-generated identifier)',
    example: 'session-abc123-2024'
  })
  sessionId: string;

  @ApiProperty({
    description: 'Session start time',
    example: '16:20:7.287'
  })
  startTime: string;

  @ApiPropertyOptional({
    description: 'Session end time (null if incomplete)',
    example: '16:22:15.445'
  })
  endTime: string | null;

  @ApiPropertyOptional({
    description: 'Booth mode from session_start event',
    example: 'PrintAndGIF'
  })
  boothMode: string | null;

  @ApiPropertyOptional({
    description: 'Booth identifier',
    example: 'Booth-1'
  })
  boothIdentifier: string | null;

  @ApiProperty({
    description: 'Session completion status',
    example: 'complete',
    enum: ['complete', 'incomplete']
  })
  status: 'complete' | 'incomplete';

  @ApiProperty({
    description: 'Number of events in this session',
    example: 15
  })
  eventCount: number;

  @ApiPropertyOptional({
    description: 'Associated QR code ID',
    format: 'uuid'
  })
  qrCodeId: string | null;

  @ApiPropertyOptional({
    description: 'Associated event ID',
    format: 'uuid'
  })
  eventId: string | null;

  @ApiPropertyOptional({
    description: 'Associated event information',
    type: EventInfoDto
  })
  event?: EventInfoDto;

  @ApiProperty({
    description: 'All events in this session',
    type: [BoothLogDto]
  })
  events: BoothLogDto[];
}

export class PaginationInfoDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  currentPage: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  pageSize: number;

  @ApiProperty({
    description: 'Total number of sessions',
    example: 45
  })
  totalSessions: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false
  })
  hasPrevious: boolean;
}

export class BoothSessionsResponseDto {
  @ApiProperty({
    description: 'Array of booth sessions',
    type: [GroupedSessionDto]
  })
  sessions: GroupedSessionDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationInfoDto
  })
  pagination: PaginationInfoDto;
}

export class BoothEventStatsDto {
  @ApiProperty({
    description: 'Booth event type',
    example: 'session_start'
  })
  boothEventType: string;

  @ApiProperty({
    description: 'Event status',
    example: 'success'
  })
  status: string;

  @ApiProperty({
    description: 'Count of events',
    example: 25
  })
  count: number;
}

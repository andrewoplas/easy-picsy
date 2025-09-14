import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QrCodeStatus } from '@org/api-lib/types';

export class QrCodeResponseDto {
  @ApiProperty({ 
    description: 'QR code unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({ 
    description: 'Event ID associated with this QR code',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  eventId: string;

  @ApiPropertyOptional({ 
    description: 'Session ID (for future use)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: 'string',
    nullable: true
  })
  sessionId?: string | null;

  @ApiPropertyOptional({ 
    description: 'Payment ID if payment was made',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: 'string',
    nullable: true
  })
  paymentId?: string | null;

  @ApiProperty({ 
    description: 'QR code data/content (PayMongo checkout URL)',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
  })
  qrData: string;

  @ApiProperty({ 
    description: 'PayMongo payment intent ID',
    example: 'pi_test_123456789'
  })
  paymentIntentId: string;

  @ApiPropertyOptional({ 
    description: 'PayMongo payment link URL',
    example: 'https://links.paymongo.com/link_test_123456789',
    type: 'string',
    nullable: true
  })
  paymongoLinkUrl?: string | null;

  @ApiPropertyOptional({ 
    description: 'PayMongo QR Ph resource ID',
    example: 'qrph_test_123456789',
    type: 'string',
    nullable: true
  })
  paymongoQrphId?: string | null;

  @ApiProperty({ 
    description: 'QR code status',
    example: QrCodeStatus.ACTIVE,
    enum: Object.values(QrCodeStatus)
  })
  status: `${QrCodeStatus}`;

  @ApiProperty({ 
    description: 'QR code expiration timestamp',
    example: '2023-01-01T01:00:00.000Z',
    format: 'date-time'
  })
  expiresAt: Date;

  @ApiProperty({ 
    description: 'Number of times QR code was scanned',
    example: 0
  })
  usageCount: number;

  @ApiProperty({ 
    description: 'Maximum allowed usage count',
    example: 1
  })
  maxUsage: number;

  @ApiProperty({ 
    description: 'Whether the QR code is active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({ 
    description: 'QR code creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiPropertyOptional({ 
    description: 'QR code usage timestamp',
    example: '2023-01-01T00:30:00.000Z',
    format: 'date-time',
    type: 'string',
    nullable: true
  })
  usedAt?: Date | null;

  @ApiPropertyOptional({ 
    description: 'QR code invalidation timestamp',
    example: '2023-01-01T00:45:00.000Z',
    format: 'date-time',
    type: 'string',
    nullable: true
  })
  invalidatedAt?: Date | null;
}

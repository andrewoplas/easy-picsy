import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QrCodeResponseDto } from './qr-code-response.dto';

export class QrCodeStatusResponseDto {
  @ApiProperty({ 
    description: 'QR code details',
    type: QrCodeResponseDto
  })
  qrCode: QrCodeResponseDto;

  @ApiProperty({ 
    description: 'Whether the QR code is currently valid and usable',
    example: true
  })
  isValid: boolean;

  @ApiPropertyOptional({ 
    description: 'Time until QR code expiry in milliseconds',
    example: 1800000 // 30 minutes
  })
  timeUntilExpiry?: number;
}

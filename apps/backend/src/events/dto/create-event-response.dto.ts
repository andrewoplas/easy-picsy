import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventResponseDto } from './event-response.dto';
import { QrCodeResponseDto } from './qr-code-response.dto';

export class CreateEventResponseDto extends EventResponseDto {
  @ApiPropertyOptional({ 
    description: 'Generated QR code for the event (if successful)',
    type: QrCodeResponseDto
  })
  qrCode?: QrCodeResponseDto;
}

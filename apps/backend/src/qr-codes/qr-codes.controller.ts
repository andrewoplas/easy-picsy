import { Controller, Get, Post, Param, UseGuards, Request, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../types/auth.types';
import { QrCodesService } from './qr-codes.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { QrCodeResponseDto } from './dto/qr-code-response.dto';
import { QrCodeStatusResponseDto } from './dto/qr-code-status-response.dto';

@ApiTags('QR Codes')
@ApiBearerAuth('JWT-auth')
@Controller('qr-codes')
@UseGuards(SupabaseAuthGuard)
export class QrCodesController {
  constructor(private readonly qrCodesService: QrCodesService) {}

  @Get('event/:eventId/current')
  @ApiOperation({ 
    summary: 'Get current active QR code',
    description: 'Retrieve the currently active QR code for a specific event (if any)'
  })
  @ApiParam({ 
    name: 'eventId', 
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Active QR code retrieved successfully',
    type: QrCodeResponseDto
  })
  @ApiNotFoundResponse({ description: 'Event not found or no active QR code' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getCurrentQRCode(@Param('eventId') eventId: string, @Request() req: AuthenticatedRequest): Promise<QrCodeResponseDto | null> {
    return await this.qrCodesService.getCurrentQRCode(eventId, req.user.supabaseId);
  }

  @Post('event/:eventId/regenerate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Regenerate QR code',
    description: 'Generate new QR code for an event (manual regeneration). Invalidates current QR code if active.'
  })
  @ApiParam({ 
    name: 'eventId', 
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 201,
    description: 'New QR code generated successfully',
    type: QrCodeResponseDto
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async regenerateQRCode(@Param('eventId') eventId: string, @Request() req: AuthenticatedRequest): Promise<QrCodeResponseDto> {
    return await this.qrCodesService.regenerateQRCode(eventId, req.user.supabaseId);
  }

  @Get('event/:eventId/history')
  @ApiOperation({ 
    summary: 'Get QR code history',
    description: 'Retrieve complete QR code generation history for a specific event'
  })
  @ApiParam({ 
    name: 'eventId', 
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'QR code history retrieved successfully',
    type: [QrCodeResponseDto]
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getQRCodeHistory(@Param('eventId') eventId: string, @Request() req: AuthenticatedRequest): Promise<QrCodeResponseDto[]> {
    return await this.qrCodesService.getQRCodeHistory(eventId, req.user.supabaseId);
  }

  @Get(':qrCodeId/status')
  @ApiOperation({ 
    summary: 'Get QR code status',
    description: 'Check the current status of a specific QR code by its ID'
  })
  @ApiParam({ 
    name: 'qrCodeId', 
    description: 'QR Code UUID',
    example: '456e7890-e12c-34d5-b678-901234567890'
  })
  @ApiResponse({
    status: 200,
    description: 'QR code status retrieved successfully',
    type: QrCodeStatusResponseDto
  })
  @ApiNotFoundResponse({ description: 'QR code not found' })
  async getQRCodeStatus(@Param('qrCodeId') qrCodeId: string): Promise<QrCodeStatusResponseDto> {
    return await this.qrCodesService.getQRCodeStatus(qrCodeId);
  }


  @Get(':qrCodeId/image')
  @ApiOperation({ 
    summary: 'Get QR code image',
    description: 'Retrieve the QR code as base64-encoded string.'
  })
  @ApiParam({ 
    name: 'qrCodeId', 
    description: 'QR Code UUID',
    example: '456e7890-e12c-34d5-b678-901234567890'
  })
  @ApiResponse({
    status: 200,
    description: 'QR code retrieved successfully',
    schema: {
      type: 'string',
      description: 'Base64-encoded QR code',
      example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
    }
  })
  @ApiNotFoundResponse({ description: 'QR code not found' })
  async getQRCodeImage(@Param('qrCodeId') qrCodeId: string): Promise<string> {
    const result = await this.qrCodesService.getQRCodeStatus(qrCodeId);
    
    if (!result.qrCode.qrData) {
      throw new NotFoundException('QR code image not found');
    }

    return result.qrCode.qrData;
  }
}
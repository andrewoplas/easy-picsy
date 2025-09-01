import { Controller, Get, Post, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { QrCodesService } from './qr-codes.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        eventId: { type: 'string', format: 'uuid' },
        qrData: { type: 'string', description: 'PayMongo checkout URL' },
        paymongoLinkId: { type: 'string' },
        status: { type: 'string', enum: ['active', 'expired', 'used', 'invalidated'] },
        expiresAt: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Event not found or no active QR code' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getCurrentQRCode(@Param('eventId') eventId: string, @Request() req: any) {
    return await this.qrCodesService.getCurrentQRCode(eventId, req.user.sub);
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        eventId: { type: 'string', format: 'uuid' },
        qrData: { type: 'string', description: 'PayMongo checkout URL' },
        paymongoLinkId: { type: 'string' },
        status: { type: 'string', enum: ['active'] },
        expiresAt: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async regenerateQRCode(@Param('eventId') eventId: string, @Request() req: any) {
    return await this.qrCodesService.regenerateQRCode(eventId, req.user.sub);
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
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          eventId: { type: 'string', format: 'uuid' },
          qrData: { type: 'string', description: 'PayMongo checkout URL' },
          paymongoLinkId: { type: 'string' },
          status: { type: 'string', enum: ['active', 'expired', 'used', 'invalidated'] },
          expiresAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getQRCodeHistory(@Param('eventId') eventId: string, @Request() req: any) {
    return await this.qrCodesService.getQRCodeHistory(eventId, req.user.sub);
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
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        eventId: { type: 'string', format: 'uuid' },
        status: { type: 'string', enum: ['active', 'expired', 'used', 'invalidated'] },
        expiresAt: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        isActive: { type: 'boolean', description: 'Whether QR code is currently active and usable' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'QR code not found' })
  async getQRCodeStatus(@Param('qrCodeId') qrCodeId: string) {
    return await this.qrCodesService.getQRCodeStatus(qrCodeId);
  }
}
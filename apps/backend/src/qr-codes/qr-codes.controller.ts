import { Controller, Get, Post, Param, UseGuards, Request, HttpCode, HttpStatus, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
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

  @Get(':qrCodeId/payment-link')
  @ApiOperation({ 
    summary: 'Get payment link URL for testing',
    description: 'Get the PayMongo checkout URL for web-based payment testing'
  })
  @ApiParam({ 
    name: 'qrCodeId', 
    description: 'QR Code UUID',
    example: '456e7890-e12c-34d5-b678-901234567890'
  })
  @ApiResponse({
    status: 200,
    description: 'Payment link URL retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        checkoutUrl: { type: 'string', description: 'PayMongo checkout URL for testing' },
        qrCodeId: { type: 'string', format: 'uuid' },
        eventId: { type: 'string', format: 'uuid' },
        expiresAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'QR code not found' })
  async getPaymentLink(@Param('qrCodeId') qrCodeId: string) {
    const result = await this.qrCodesService.getQRCodeStatus(qrCodeId);
    
    return {
      checkoutUrl: result.qrCode.paymongoLinkUrl,
      qrCodeId: result.qrCode.id,
      eventId: result.qrCode.eventId,
      expiresAt: result.qrCode.expiresAt,
      isValid: result.isValid
    };
  }

  @Get(':qrCodeId/image')
  @ApiOperation({ 
    summary: 'Get QR code image',
    description: 'Retrieve the QR code image as PNG. Returns base64-encoded QR code image for display in frontend.'
  })
  @ApiParam({ 
    name: 'qrCodeId', 
    description: 'QR Code UUID',
    example: '456e7890-e12c-34d5-b678-901234567890'
  })
  @ApiResponse({
    status: 200,
    description: 'QR code image retrieved successfully',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      },
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            qrCodeImage: { 
              type: 'string', 
              description: 'Base64-encoded PNG image' 
            },
            format: { 
              type: 'string', 
              example: 'data:image/png;base64' 
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'QR code not found' })
  async getQRCodeImage(
    @Param('qrCodeId') qrCodeId: string, 
    @Request() req: any,
    @Res() res: Response
  ) {
    const result = await this.qrCodesService.getQRCodeStatus(qrCodeId);
    
    if (!result.qrCode.qrData) {
      return res.status(404).json({ message: 'QR code image not found' });
    }

    // Check if client wants JSON response or image
    const acceptHeader = req.headers.accept;
    
    if (acceptHeader?.includes('application/json')) {
      // Return JSON with base64 data
      return res.json({
        qrCodeImage: result.qrCode.qrData,
        format: 'data:image/png;base64',
        expiresAt: result.qrCode.expiresAt,
        isValid: result.isValid
      });
    } else {
      // Return raw image
      const base64Data = result.qrCode.qrData.replace(/^data:image\/png;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
      });
      
      return res.send(imageBuffer);
    }
  }
}
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@ApiTags('Events')
@ApiBearerAuth('JWT-auth')
@Controller('events')
@UseGuards(SupabaseAuthGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly qrCodesService: QrCodesService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create event',
    description: 'Create a new photobooth event with pricing information'
  })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number', format: 'decimal' },
        currency: { type: 'string', example: 'PHP' },
        isActive: { type: 'boolean' },
        userId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async create(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    return await this.eventsService.create(createEventDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all events',
    description: 'Retrieve all events created by the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', format: 'decimal' },
          currency: { type: 'string', example: 'PHP' },
          isActive: { type: 'boolean' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async findAll(@Request() req: any) {
    return await this.eventsService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get event by ID',
    description: 'Retrieve a specific event by its UUID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number', format: 'decimal' },
        currency: { type: 'string', example: 'PHP' },
        isActive: { type: 'boolean' },
        userId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return await this.eventsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Partially update event',
    description: 'Update specific fields of an event'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number', format: 'decimal' },
        currency: { type: 'string', example: 'PHP' },
        isActive: { type: 'boolean' },
        userId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req: any) {
    return await this.eventsService.update(id, updateEventDto, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Replace event',
    description: 'Completely replace an event with new data'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event replaced successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number', format: 'decimal' },
        currency: { type: 'string', example: 'PHP' },
        isActive: { type: 'boolean' },
        userId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async replace(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req: any) {
    return await this.eventsService.update(id, updateEventDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete event',
    description: 'Permanently delete an event and all associated data'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Event deleted successfully' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.eventsService.remove(id, req.user.sub);
    return { message: 'Event deleted successfully' };
  }

  @Get(':id/qr/current')
  @ApiOperation({ 
    summary: 'Get current QR code',
    description: 'Get the currently active QR code for this event'
  })
  @ApiParam({ 
    name: 'id', 
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
  async getCurrentQRCode(@Param('id') eventId: string, @Request() req: any) {
    return await this.qrCodesService.getCurrentQRCode(eventId, req.user.sub);
  }

  @Post(':id/qr/regenerate')
  @ApiOperation({ 
    summary: 'Regenerate QR code',
    description: 'Generate new QR code for this event (invalidates current one)'
  })
  @ApiParam({ 
    name: 'id', 
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
  async regenerateQRCode(@Param('id') eventId: string, @Request() req: any) {
    return await this.qrCodesService.regenerateQRCode(eventId, req.user.sub);
  }

  @Get(':id/qr/history')
  @ApiOperation({ 
    summary: 'Get QR code history',
    description: 'Get complete QR code generation history for this event'
  })
  @ApiParam({ 
    name: 'id', 
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
  async getQRCodeHistory(@Param('id') eventId: string, @Request() req: any) {
    return await this.qrCodesService.getQRCodeHistory(eventId, req.user.sub);
  }
}

@ApiTags('Public Events')
@Controller('public/events')
export class PublicEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get event for payment',
    description: 'Public endpoint to retrieve event details for QR code payment processing'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Event or QR Code UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Event details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number', format: 'decimal' },
        currency: { type: 'string', example: 'PHP' },
        isActive: { type: 'boolean' },
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Event not found or not accessible' })
  async getEventForPayment(@Param('id') id: string) {
    return await this.eventsService.findByQrCode(id);
  }
}
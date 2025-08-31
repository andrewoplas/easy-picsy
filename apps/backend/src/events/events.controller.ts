import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('events')
@UseGuards(SupabaseAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    return await this.eventsService.create(createEventDto, req.user.sub);
  }

  @Get()
  async findAll(@Request() req: any) {
    return await this.eventsService.findAll(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return await this.eventsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req: any) {
    return await this.eventsService.update(id, updateEventDto, req.user.sub);
  }

  // PUT endpoint as specified in requirements
  @Put(':id')
  async replace(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req: any) {
    return await this.eventsService.update(id, updateEventDto, req.user.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.eventsService.remove(id, req.user.sub);
    return { message: 'Event deleted successfully' };
  }
}

// Public endpoint for QR code scanning
@Controller('public/events')
export class PublicEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get(':id')
  async getEventForPayment(@Param('id') id: string) {
    return await this.eventsService.findByQrCode(id);
  }
}
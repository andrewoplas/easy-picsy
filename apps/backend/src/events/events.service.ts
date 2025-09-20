import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import { events, NewEvent } from '../database/schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { PublicEventResponseDto } from './dto/public-event-response.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly databaseService: DatabaseService, private readonly qrCodesService: QrCodesService) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<CreateEventResponseDto> {
    const newEvent: NewEvent = {
      name: createEventDto.name,
      description: createEventDto.description,
      price: createEventDto.price.toString(),
      currency: createEventDto.currency || 'PHP',
      isActive: createEventDto.isActive ?? true,
      createdBy: userId,
    };

    const [createdEvent] = await this.databaseService.db.insert(events).values(newEvent).returning();

    // Generate initial QR code for the event using Paymongo
    try {
      const qrCode = await this.qrCodesService.generateQRCode(createdEvent.id, userId);
      this.logger.log(`QR code generated for new event ${createdEvent.id}`);
      return { ...createdEvent, qrCode };
    } catch (error) {
      this.logger.error(`Failed to generate QR code for event ${createdEvent.id}:`, error);
      // Return the event even if QR generation fails
      return createdEvent;
    }
  }

  async findAll(userId: string): Promise<EventResponseDto[]> {
    const results = await this.databaseService.db
      .select()
      .from(events)
      .where(eq(events.createdBy, userId))
      .orderBy(events.createdAt);
    
    return results.map(event => ({
      ...event,
      description: event.description ?? undefined
    }));
  }

  async findOne(id: string, userId: string): Promise<EventResponseDto> {
    const [event] = await this.databaseService.db
      .select()
      .from(events)
      .where(and(eq(events.id, id), eq(events.createdBy, userId)));

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return {
      ...event,
      description: event.description ?? undefined
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string): Promise<EventResponseDto> {
    // Verify the event exists and user owns it
    await this.findOne(id, userId);

    const { price, ...rest } = updateEventDto;
    const updateData: Partial<NewEvent> = {
      ...rest,
      ...(price !== undefined && { price: price.toString() }),
      updatedAt: new Date(),
    };

    const [updatedEvent] = await this.databaseService.db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();

    return {
      ...updatedEvent,
      description: updatedEvent.description ?? undefined
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId); // Check if exists and user owns it

    await this.databaseService.db.delete(events).where(eq(events.id, id));
  }

  async findByQrCode(eventId: string): Promise<PublicEventResponseDto> {
    const [event] = await this.databaseService.db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.isActive, true)));

    if (!event) {
      throw new NotFoundException(`Active event with id ${eventId} not found`);
    }

    return event;
  }
}

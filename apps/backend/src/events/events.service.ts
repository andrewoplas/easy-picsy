import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { events, NewEvent } from '../database/schema';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { PublicEventResponseDto } from './dto/public-event-response.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FILE_UPLOAD_ERRORS } from './utils/file-validation.util';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly qrCodesService: QrCodesService,
    private readonly supabaseService: SupabaseService,
  ) {}

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
      return {
        ...createdEvent,
        qrCode,
        description: createdEvent.description ?? undefined,
        lockScreenDesignUrl: createdEvent.lockScreenDesignUrl ?? undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to generate QR code for event ${createdEvent.id}:`, error);
      // Return the event even if QR generation fails
      return {
        ...createdEvent,
        description: createdEvent.description ?? undefined,
        lockScreenDesignUrl: createdEvent.lockScreenDesignUrl ?? undefined,
      };
    }
  }

  async findAll(userId: string): Promise<EventResponseDto[]> {
    const results = await this.databaseService.db
      .select()
      .from(events)
      .where(eq(events.createdBy, userId))
      .orderBy(events.createdAt);

    return results.map((event) => ({
      ...event,
      description: event.description ?? undefined,
      lockScreenDesignUrl: event.lockScreenDesignUrl ?? undefined,
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
      description: event.description ?? undefined,
      lockScreenDesignUrl: event.lockScreenDesignUrl ?? undefined,
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
      description: updatedEvent.description ?? undefined,
      lockScreenDesignUrl: updatedEvent.lockScreenDesignUrl ?? undefined,
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

  async uploadLockScreenDesign(eventId: string, file: Express.Multer.File, userId: string): Promise<string> {
    // Verify event exists and user owns it
    await this.findOne(eventId, userId);

    try {
      const url = await this.supabaseService.uploadLockScreenDesign(eventId, file.buffer, file.originalname, {
        contentType: file.mimetype,
      });

      // Update event with new design URL
      await this.databaseService.db
        .update(events)
        .set({
          lockScreenDesignUrl: url,
          updatedAt: new Date(),
        })
        .where(eq(events.id, eventId));

      return url;
    } catch (error) {
      this.logger.error(`Failed to upload lock screen design for event ${eventId}:`, error);
      throw new BadRequestException(FILE_UPLOAD_ERRORS.UPLOAD_FAILED);
    }
  }

  async getLockScreenDesign(eventId: string, userId: string): Promise<string | null> {
    const event = await this.findOne(eventId, userId);
    return event.lockScreenDesignUrl ?? null;
  }
}

import {
  EventsApi,
  QRCodesApi,
  PublicEventsApi,
  Configuration,
  EventsControllerFindAll200ResponseInner as Event,
  EventsControllerGetCurrentQRCode200Response as QrCode,
  EventsControllerGetQRCodeHistory200ResponseInner as QrCodeHistory,
  CreateEventDto,
  UpdateEventDto,
} from '@org/api-lib';
import axiosInstance from './client2';
import { AxiosError } from 'axios';

const config = new Configuration();
const eventsApiInstance = new EventsApi(config, undefined, axiosInstance);
const qrCodesApiInstance = new QRCodesApi(config, undefined, axiosInstance);
const publicEventsApiInstance = new PublicEventsApi(config, undefined, axiosInstance);

export type { Event, QrCode, QrCodeHistory, CreateEventDto, UpdateEventDto };

export interface QrCodeStatus {
  qrCode: QrCode;
  isValid: boolean;
  timeUntilExpiry?: number;
}

export const eventsApi = {
  async getAll(): Promise<Event[]> {
    const response = await eventsApiInstance.eventsControllerFindAll();
    return response.data;
  },

  async getById(id: string): Promise<Event> {
    const response = await eventsApiInstance.eventsControllerFindOne(id);
    return response.data;
  },

  async create(data: CreateEventDto): Promise<Event> {
    const response = await eventsApiInstance.eventsControllerCreate(data);
    return response.data;
  },

  async update(id: string, data: UpdateEventDto): Promise<Event> {
    const response = await eventsApiInstance.eventsControllerReplace(id, data);
    return response.data;
  },

  async partialUpdate(id: string, data: UpdateEventDto): Promise<Event> {
    const response = await eventsApiInstance.eventsControllerUpdate(id, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await eventsApiInstance.eventsControllerRemove(id);
  },

  async getPublicEvent(id: string): Promise<Event> {
    const response = await publicEventsApiInstance.publicEventsControllerGetEventForPayment(id);
    return response.data;
  },

  qr: {
    async getCurrent(eventId: string): Promise<QrCode | null> {
      try {
        const response = await eventsApiInstance.eventsControllerGetCurrentQRCode(eventId);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },

    async getCurrentByEventId(eventId: string): Promise<QrCode | null> {
      try {
        const response = await qrCodesApiInstance.qrCodesControllerGetCurrentQRCode(eventId);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },

    async regenerate(eventId: string): Promise<QrCode> {
      const response = await eventsApiInstance.eventsControllerRegenerateQRCode(eventId);
      return response.data;
    },

    async getHistory(eventId: string): Promise<QrCodeHistory[]> {
      const response = await eventsApiInstance.eventsControllerGetQRCodeHistory(eventId);
      return response.data;
    },

    async getStatus(qrCodeId: string): Promise<QrCodeStatus> {
      const response = await qrCodesApiInstance.qrCodesControllerGetQRCodeStatus(qrCodeId);
      return {
        qrCode: response.data as unknown as QrCode,
        isValid: response.data.status === 'active',
        timeUntilExpiry: 0, // TODO: Calculate time difference between now and expiresAt (ISO string from API).
                              // QR codes expire after 30 minutes. This should return remaining seconds,
                              // or 0 if expired. Used by UI to show countdown timer.
      };
    },

    async getImage(qrCodeId: string): Promise<string> {
      const response = await qrCodesApiInstance.qrCodesControllerGetQRCodeImage(qrCodeId);
      const imageResponse = response.data as { qrCodeImage?: string };
      return imageResponse.qrCodeImage || '';
    },

    async getPaymentLink(qrCodeId: string): Promise<string> {
      const response = await qrCodesApiInstance.qrCodesControllerGetPaymentLink(qrCodeId);
      return response.data.checkoutUrl || '';
    },
  },
};
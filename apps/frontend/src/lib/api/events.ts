import {
  Configuration,
  CreateEventDto,
  CreateEventResponseDto,
  CurrentQrCodeResponseDto,
  EventResponseDto,
  EventsApi,
  PublicEventResponseDto,
  PublicEventsApi,
  QRCodesApi,
  UpdateEventDto,
} from '@org/api-lib';
import { AxiosError } from 'axios';
import axiosInstance from './client';

const config = new Configuration();
const eventsApiInstance = new EventsApi(config, undefined, axiosInstance);
const qrCodesApiInstance = new QRCodesApi(config, undefined, axiosInstance);
const publicEventsApiInstance = new PublicEventsApi(config, undefined, axiosInstance);

export type Event = EventResponseDto;
export type CreateEventResponse = CreateEventResponseDto;
export type QrCode = CurrentQrCodeResponseDto;
export type QrCodeHistory = CurrentQrCodeResponseDto;
export type PublicEvent = PublicEventResponseDto;
export type { CreateEventDto, UpdateEventDto };

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

  async create(data: CreateEventDto): Promise<CreateEventResponse> {
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

  async getPublicEvent(id: string): Promise<PublicEvent> {
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
        const response = await eventsApiInstance.eventsControllerGetCurrentQRCode(eventId);
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

      // The backend returns a nested structure: {qrCode: {...}, isValid: boolean, timeUntilExpiry: number}
      // We should use the backend's calculated values instead of recalculating
      const backendResponse = response.data as { qrCode: QrCode; isValid: boolean; timeUntilExpiry?: number };
      const qrCode = backendResponse.qrCode as QrCode;

      return {
        qrCode,
        isValid: backendResponse.isValid || false,
        timeUntilExpiry: backendResponse.timeUntilExpiry || 0,
      };
    },

    async getImage(qrCodeId: string): Promise<string> {
      const response = await qrCodesApiInstance.qrCodesControllerGetQRCodeImage(qrCodeId);
      const imageResponse = response.data as { qrCodeImage?: string };
      return imageResponse.qrCodeImage || '';
    },
  },

  lockScreen: {
    async upload(eventId: string, file: File, onProgress?: (progress: number) => void): Promise<Event> {
      const formData = new FormData();
      formData.append('file', file);

      await axiosInstance.post(
        `/api/events/${eventId}/lock-screen-design`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded * 100) / progressEvent.total;
            onProgress?.(progress);
          }
        },
      });

      // The backend returns just the URL string, but we need to return the full Event
      // We'll need to fetch the updated event after upload
      const updatedEventResponse = await eventsApiInstance.eventsControllerFindOne(eventId);
      return updatedEventResponse.data;
    },

    async get(eventId: string): Promise<string | null> {
      const response = await eventsApiInstance.eventsControllerGetLockScreenDesign(eventId);
      return response.data;
    },

    async delete(eventId: string): Promise<void> {
      // Note: There's no delete endpoint in the generated API client yet
      // We'll need to add this to the backend first
      throw new Error('Delete lock screen design endpoint not yet implemented');
    },
  },
};

import apiClient from './client';

export interface Event {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  qrCode?: QrCode; // Will be populated on creation
}

export interface QrCode {
  id: string;
  eventId: string;
  sessionId?: string;
  paymentId?: string;
  qrData: string;
  paymongoLinkId: string;
  paymongoLinkUrl: string;
  status: 'active' | 'expired' | 'used' | 'invalidated';
  expiresAt: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
  createdAt: string;
  usedAt?: string;
  invalidatedAt?: string;
}

export interface QrCodeStatus {
  qrCode: QrCode;
  isValid: boolean;
  timeUntilExpiry?: number;
}

export interface CreateEventData {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  isActive?: boolean;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export const eventsApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    const response = await apiClient.get('/events');
    return response.data;
  },

  // Get single event
  getById: async (id: string): Promise<Event> => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  create: async (data: CreateEventData): Promise<Event> => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },

  // Update event (PUT)
  update: async (id: string, data: UpdateEventData): Promise<Event> => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  // Get public event for QR scanning
  getPublicEvent: async (id: string): Promise<Event> => {
    const response = await apiClient.get(`/public/events/${id}`);
    return response.data;
  },

  // QR Code Management
  qr: {
    // Get current active QR code for an event
    getCurrent: async (eventId: string): Promise<QrCode | null> => {
      try {
        const response = await apiClient.get(`/events/${eventId}/qr/current`);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },

    // Regenerate QR code for an event
    regenerate: async (eventId: string): Promise<QrCode> => {
      const response = await apiClient.post(`/events/${eventId}/qr/regenerate`);
      return response.data;
    },

    // Get QR code history for an event
    getHistory: async (eventId: string): Promise<QrCode[]> => {
      const response = await apiClient.get(`/events/${eventId}/qr/history`);
      return response.data;
    },

    // Get QR code status by ID
    getStatus: async (qrCodeId: string): Promise<QrCodeStatus> => {
      const response = await apiClient.get(`/qr-codes/${qrCodeId}/status`);
      return response.data;
    },
  },
};
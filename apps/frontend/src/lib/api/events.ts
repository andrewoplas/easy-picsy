import apiClient from './client';

export interface Event {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  isActive: boolean;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  }
};
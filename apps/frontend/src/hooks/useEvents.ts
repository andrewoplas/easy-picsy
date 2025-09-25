import { eventsApi, type CreateEventDto, type Event, type UpdateEventDto } from '@/lib/api/events';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const EVENTS_QUERY_KEY = ['events'] as const;
export const EVENT_QUERY_KEY = (id: string) => [...EVENTS_QUERY_KEY, id] as const;

export function useEventById(id: string) {
  return useQuery({
    queryKey: EVENT_QUERY_KEY(id),
    queryFn: () => eventsApi.getById(id),
  });
}

export function useEvents() {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: eventsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEventDto) => eventsApi.create(data),
    onSuccess: (newEvent) => {
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) => [newEvent, ...old]);
      toast.success('Event created successfully!');
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventDto }) => eventsApi.update(id, data),
    onSuccess: (updatedEvent) => {
      // Update both the list and single event queries
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)),
      );
      queryClient.setQueryData<Event>(EVENT_QUERY_KEY(updatedEvent.id), updatedEvent);
      toast.success('Event updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast.error('Failed to update event. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) => old.filter((event) => event.id !== deletedId));
      toast.success('Event deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
    },
  });

  const uploadLockScreenMutation = useMutation({
    mutationFn: ({
      eventId,
      file,
      onProgress,
    }: {
      eventId: string;
      file: File;
      onProgress?: (progress: number) => void;
    }) => eventsApi.lockScreen.upload(eventId, file, onProgress),
    onSuccess: (updatedEvent) => {
      // Update both the list and single event queries
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)),
      );
      queryClient.setQueryData<Event>(EVENT_QUERY_KEY(updatedEvent.id), updatedEvent);
      toast.success('Lock screen design uploaded successfully!');
    },
    onError: (error) => {
      console.error('Error uploading lock screen design:', error);
      toast.error('Failed to upload lock screen design. Please try again.');
    },
  });

  const deleteLockScreenMutation = useMutation({
    mutationFn: (eventId: string) => eventsApi.lockScreen.delete(eventId),
    onSuccess: (_, eventId) => {
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.map((event) => (event.id === eventId ? { ...event, lockScreenDesignUrl: undefined } : event)),
      );
      toast.success('Lock screen design removed successfully!');
    },
    onError: (error) => {
      console.error('Error removing lock screen design:', error);
      toast.error('Failed to remove lock screen design. Please try again.');
    },
  });

  return {
    events,
    isLoading,
    createEvent: createMutation,
    updateEvent: updateMutation.mutateAsync,
    deleteEvent: deleteMutation.mutate,
    isCreatingEvent: createMutation.isPending,
    uploadLockScreen: uploadLockScreenMutation.mutateAsync,
    deleteLockScreen: deleteLockScreenMutation.mutate,
    isUploadingLockScreen: uploadLockScreenMutation.isPending,
  };
}

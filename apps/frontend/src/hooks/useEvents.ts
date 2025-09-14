import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi, type Event, type CreateEventDto, type UpdateEventDto } from '@/lib/api/events';
import { toast } from 'sonner';

export const EVENTS_QUERY_KEY = ['events'] as const;

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
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
      );
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
      queryClient.setQueryData<Event[]>(EVENTS_QUERY_KEY, (old = []) =>
        old.filter((event) => event.id !== deletedId)
      );
      toast.success('Event deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
    },
  });

  return {
    events,
    isLoading,
    createEvent: createMutation.mutate,
    updateEvent: updateMutation.mutate,
    deleteEvent: deleteMutation.mutate,
  };
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  QrCode,
  Coins,
  Search,
  ChevronLeft,
  ChevronRight,
  History,
  BarChart,
  Activity,
} from 'lucide-react';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { EditEventModal } from '@/components/events/EditEventModal';
import { QRCodeModal } from '@/components/events/QRCodeModal';
import { QRCodeHistoryModal } from '@/components/events/QRCodeHistoryModal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Event, CreateEventDto, UpdateEventDto } from '@/lib/api/events';
import { useEvents } from '@/hooks/useEvents';

export default function EventsPage() {
  const router = useRouter();
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showQRHistoryModal, setShowQRHistoryModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);

  // Filter events based on search
  const filteredEvents = events.filter((event) =>
    searchQuery.trim()
      ? event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
      : true
  );

  const handleCreateEvent = (newEventData: CreateEventDto) => {
    createEvent(newEventData, {
      onSuccess: () => setShowCreateModal(false),
    });
  };

  const handleEditEvent = (eventId: string, updateData: UpdateEventDto) => {
    updateEvent(
      { id: eventId, data: updateData },
      {
        onSuccess: () => {
          setShowEditModal(false);
          setSelectedEvent(null);
        },
      }
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const openQRModal = (event: Event) => {
    setSelectedEvent(event);
    setShowQRModal(true);
  };

  const openQRHistoryModal = (event: Event) => {
    setSelectedEvent(event);
    setShowQRHistoryModal(true);
  };

  const openAnalytics = (event: Event) => {
    router.push(`/admin/dashboard/events/${event.id}/analytics`);
  };

  const openRemoteControl = (event: Event) => {
    router.push(`/admin/dashboard/events/${event.id}/remote`);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Events</h1>
            <p className="text-dash-navy/70">Manage your photobooth events</p>
          </div>
          <div className="w-32 h-10 bg-dash-gray/30 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-dash-gray/30 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Events</h1>
          <p className="text-dash-navy/70">
            Manage your photobooth events and QR codes
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Total Events
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {events.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-dash-navy/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Avg. Price
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  ₱
                  {events.length > 0
                    ? (
                        events.reduce((sum, e) => sum + (Number(e.price) || 0), 0) /
                        events.length
                      ).toFixed(0)
                    : '0'}
                </p>
              </div>
              <Coins className="h-8 w-8 text-dash-navy/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="text-sm text-dash-navy/70">
          Showing {currentEvents.length} of {filteredEvents.length} events
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card className="bg-dash-white">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-dash-navy/30 mx-auto mb-4" />
              <h3 className="text-lg font-normal text-dash-navy mb-2 tracking-wide">
                {events.length === 0 ? 'No events yet' : 'No events found'}
              </h3>
              <p className="text-dash-navy/70 mb-4">
                {events.length === 0
                  ? 'Create your first event to get started'
                  : 'Try adjusting your search or filter criteria'}
              </p>
              {events.length === 0 && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          currentEvents.map((event) => (
            <Card
              key={event.id}
              className="bg-dash-white hover:bg-gray-50/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-normal text-dash-navy tracking-wide">
                        {event.name}
                      </h3>
                    </div>
                    <div className="flex items-center text-sm text-dash-navy/60">
                      <span className="flex items-center">
                        <Coins className="w-4 h-4 mr-1" />₱
                        {Number(event.price || 0)?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openQRModal(event)}
                          className="border-dash-gray/50 hover:bg-dash-gray/10"
                        >
                          <QrCode className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View QR Code</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openQRHistoryModal(event)}
                          className="border-dash-gray/50 hover:bg-dash-gray/10"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>QR Code History</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAnalytics(event)}
                          className="border-dash-gray/50 hover:bg-dash-gray/10"
                        >
                          <BarChart className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Analytics</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRemoteControl(event)}
                          className="border-dash-gray/50 hover:bg-dash-gray/10"
                        >
                          <Activity className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remote Control</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(event)}
                          className="border-dash-gray/50 hover:bg-dash-gray/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Event</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => event.id && handleDeleteEvent(event.id)}
                          className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Event</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-dash-navy/70">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-dash-gray/50 hover:bg-dash-gray/10"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;

                const pageButton = (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={
                      page === currentPage
                        ? 'bg-dash-orange hover:bg-dash-orange/90 text-white'
                        : 'border-dash-gray/50 hover:bg-dash-gray/10'
                    }
                  >
                    {page}
                  </Button>
                );

                return pageButton;
              }).filter(Boolean)}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-dash-gray/50 hover:bg-dash-gray/10"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEvent}
      />

      {selectedEvent && (
        <>
          <EditEventModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
            onSubmit={handleEditEvent}
          />

          <QRCodeModal
            isOpen={showQRModal}
            onClose={() => {
              setShowQRModal(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
          />

          <QRCodeHistoryModal
            isOpen={showQRHistoryModal}
            onClose={() => {
              setShowQRHistoryModal(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
          />
        </>
      )}
    </div>
  );
}
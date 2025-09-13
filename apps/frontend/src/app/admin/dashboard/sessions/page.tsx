'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Search,
  Camera,
  Clock,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Timer,
  Images,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock data - will be replaced with API calls
const mockSessions = [
  {
    id: 'sess_001',
    eventId: 'evt_001',
    eventName: 'Sarah & John Wedding',
    paymentId: 'pay_001',
    customerName: 'Maria Santos',
    status: 'completed',
    startedAt: '2024-01-15T10:30:15Z',
    endedAt: '2024-01-15T10:33:45Z',
    duration: 210, // seconds
    photosTaken: 12,
    boothId: 'booth_001',
    sessionSettings: {
      maxPhotos: 15,
      sessionDuration: 300,
      printingEnabled: true,
    },
    qrCodeId: 'qr_001',
  },
  {
    id: 'sess_002',
    eventId: 'evt_002',
    eventName: 'Birthday Celebration',
    paymentId: 'pay_002',
    customerName: 'Juan Dela Cruz',
    status: 'completed',
    startedAt: '2024-01-14T15:45:08Z',
    endedAt: '2024-01-14T15:48:22Z',
    duration: 194,
    photosTaken: 8,
    boothId: 'booth_001',
    sessionSettings: {
      maxPhotos: 10,
      sessionDuration: 240,
      printingEnabled: false,
    },
    qrCodeId: 'qr_002',
  },
  {
    id: 'sess_003',
    eventId: 'evt_001',
    eventName: 'Sarah & John Wedding',
    paymentId: 'pay_006',
    customerName: 'Carlos Rivera',
    status: 'active',
    startedAt: '2024-01-15T14:20:30Z',
    endedAt: null,
    duration: 0,
    photosTaken: 5,
    boothId: 'booth_001',
    sessionSettings: {
      maxPhotos: 15,
      sessionDuration: 300,
      printingEnabled: true,
    },
    qrCodeId: 'qr_006',
  },
  {
    id: 'sess_004',
    eventId: 'evt_003',
    eventName: 'Corporate Event',
    paymentId: 'pay_007',
    customerName: 'Sandra Lopez',
    status: 'expired',
    startedAt: '2024-01-13T11:15:00Z',
    endedAt: '2024-01-13T11:20:00Z',
    duration: 300,
    photosTaken: 3,
    boothId: 'booth_001',
    sessionSettings: {
      maxPhotos: 20,
      sessionDuration: 300,
      printingEnabled: true,
    },
    qrCodeId: 'qr_007',
  },
  {
    id: 'sess_005',
    eventId: 'evt_002',
    eventName: 'Birthday Celebration',
    paymentId: 'pay_005',
    customerName: 'Lisa Reyes',
    status: 'cancelled',
    startedAt: '2024-01-12T16:30:12Z',
    endedAt: '2024-01-12T16:31:45Z',
    duration: 93,
    photosTaken: 1,
    boothId: 'booth_001',
    sessionSettings: {
      maxPhotos: 10,
      sessionDuration: 240,
      printingEnabled: false,
    },
    qrCodeId: 'qr_005',
  },
];

type SessionStatus = 'all' | 'active' | 'completed' | 'expired' | 'cancelled';

export default function SessionsPage() {
  const [sessions, setSessions] = useState(mockSessions);
  const [filteredSessions, setFilteredSessions] = useState(mockSessions);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus>('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10);

  // Filter sessions
  useEffect(() => {
    let filtered = sessions;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (session) =>
          session.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((session) => session.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(
        (session) => new Date(session.startedAt) >= filterDate
      );
    }

    setFilteredSessions(filtered);
    setCurrentPage(1);
  }, [sessions, searchQuery, statusFilter, dateFilter]);

  // Calculate stats
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter((s) => s.status === 'active').length;
  const completedSessions = sessions.filter((s) => s.status === 'completed').length;
  const avgPhotosPerSession = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + s.photosTaken, 0) / sessions.length)
    : 0;

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, startIndex + sessionsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Play className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Timer className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const SessionDetailsModal = ({ session }: { session: any }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-normal text-dash-navy tracking-wide">
          Session Details
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-dash-navy mb-3">Session Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dash-navy/70">Session ID:</span>
                <span className="font-mono">{session.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dash-navy/70">Event:</span>
                <span>{session.eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dash-navy/70">Customer:</span>
                <span>{session.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dash-navy/70">Status:</span>
                {getStatusBadge(session.status)}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-dash-navy mb-3">Session Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dash-navy/70">Photos Taken:</span>
                <span className="font-semibold">{session.photosTaken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dash-navy/70">Duration:</span>
                <span>{formatDuration(session.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dash-navy/70">Started:</span>
                <span>{formatDate(session.startedAt)}</span>
              </div>
              {session.endedAt && (
                <div className="flex justify-between">
                  <span className="text-dash-navy/70">Ended:</span>
                  <span>{formatDate(session.endedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-dash-navy mb-3">Session Settings</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dash-navy/70">Max Photos:</span>
              <span>{session.sessionSettings.maxPhotos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dash-navy/70">Max Duration:</span>
              <span>{formatDuration(session.sessionSettings.sessionDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dash-navy/70">Printing:</span>
              <span>{session.sessionSettings.printingEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Sessions</h1>
          <p className="text-dash-navy/70">
            Monitor and manage photobooth sessions
          </p>
        </div>
        <Button
          variant="outline"
          className="border-dash-gray/50 hover:bg-dash-gray/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Total Sessions
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {totalSessions}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  All time
                </p>
              </div>
              <Users className="h-8 w-8 text-dash-navy/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Active Now
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {activeSessions}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Currently in progress
                </p>
              </div>
              <Play className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Completed
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {completedSessions}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Successfully finished
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Avg. Photos
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {avgPhotosPerSession}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Per session
                </p>
              </div>
              <Camera className="h-8 w-8 text-dash-navy/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-dash-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value: SessionStatus) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-dash-navy/70">
              Showing {currentSessions.length} of {filteredSessions.length} sessions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card className="bg-dash-white">
        <CardHeader>
          <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentSessions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-dash-navy/30 mx-auto mb-4" />
                <h3 className="text-lg font-normal text-dash-navy mb-2 tracking-wide">
                  No sessions found
                </h3>
                <p className="text-dash-navy/70">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              currentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="font-medium text-dash-navy">
                        {session.eventName}
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-dash-navy/60">
                      <span>{session.customerName}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Images className="w-3 h-3 mr-1" />
                        {session.photosTaken} photos
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(session.duration)}
                      </span>
                      <span>•</span>
                      <span>{formatDate(session.startedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-dash-gray/50 hover:bg-dash-gray/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <SessionDetailsModal session={session} />
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-dash-gray/30">
              <div className="text-sm text-dash-navy/70">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-dash-gray/50 hover:bg-dash-gray/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (page > totalPages) return null;

                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={
                          page === currentPage
                            ? 'bg-dash-orange hover:bg-dash-orange/90 text-white'
                            : 'border-dash-gray/50 hover:bg-dash-gray/10'
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-dash-gray/50 hover:bg-dash-gray/10"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
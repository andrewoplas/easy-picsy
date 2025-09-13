'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data - will be replaced with API calls
const mockPayments = [
  {
    id: 'pay_001',
    eventId: 'evt_001',
    eventName: 'Sarah & John Wedding',
    amount: 150,
    currency: 'PHP',
    status: 'completed',
    paymentMethod: 'GCash',
    customerName: 'Maria Santos',
    customerEmail: 'maria@example.com',
    transactionId: 'pi_3N4KxJ2eZvKYlo2C0k7t8uB5',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:30:15Z',
    qrCodeId: 'qr_001',
  },
  {
    id: 'pay_002',
    eventId: 'evt_002',
    eventName: 'Birthday Celebration',
    amount: 100,
    currency: 'PHP',
    status: 'completed',
    paymentMethod: 'Maya',
    customerName: 'Juan Dela Cruz',
    customerEmail: 'juan@example.com',
    transactionId: 'pi_3N4KxJ2eZvKYlo2C0k7t8uB6',
    createdAt: '2024-01-14T15:45:00Z',
    completedAt: '2024-01-14T15:45:08Z',
    qrCodeId: 'qr_002',
  },
  {
    id: 'pay_003',
    eventId: 'evt_001',
    eventName: 'Sarah & John Wedding',
    amount: 150,
    currency: 'PHP',
    status: 'pending',
    paymentMethod: 'BPI',
    customerName: 'Ana Garcia',
    customerEmail: 'ana@example.com',
    transactionId: 'pi_3N4KxJ2eZvKYlo2C0k7t8uB7',
    createdAt: '2024-01-14T12:20:00Z',
    completedAt: null,
    qrCodeId: 'qr_003',
  },
  {
    id: 'pay_004',
    eventId: 'evt_003',
    eventName: 'Corporate Event',
    amount: 200,
    currency: 'PHP',
    status: 'failed',
    paymentMethod: 'GCash',
    customerName: 'Roberto Kim',
    customerEmail: 'roberto@example.com',
    transactionId: 'pi_3N4KxJ2eZvKYlo2C0k7t8uB8',
    createdAt: '2024-01-13T09:15:00Z',
    completedAt: null,
    qrCodeId: 'qr_004',
  },
  {
    id: 'pay_005',
    eventId: 'evt_002',
    eventName: 'Birthday Celebration',
    amount: 100,
    currency: 'PHP',
    status: 'completed',
    paymentMethod: 'UnionBank',
    customerName: 'Lisa Reyes',
    customerEmail: 'lisa@example.com',
    transactionId: 'pi_3N4KxJ2eZvKYlo2C0k7t8uB9',
    createdAt: '2024-01-12T16:30:00Z',
    completedAt: '2024-01-12T16:30:12Z',
    qrCodeId: 'qr_005',
  },
];

type PaymentStatus = 'all' | 'completed' | 'pending' | 'failed' | 'refunded';

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);

  // Filter payments
  useEffect(() => {
    let filtered = payments;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (payment) =>
          payment.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
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
        (payment) => new Date(payment.createdAt) >= filterDate
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [payments, searchQuery, statusFilter, dateFilter]);

  // Calculate stats
  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedPayments = payments.filter((p) => p.status === 'completed').length;
  const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  const failedPayments = payments.filter((p) => p.status === 'failed').length;

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const startIndex = (currentPage - 1) * paymentsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + paymentsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Payments</h1>
          <p className="text-dash-navy/70">
            Track and manage all payment transactions
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
                  Total Revenue
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  ₱{totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center text-sm font-semibold text-green-600 mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-dash-navy/50" />
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
                  {completedPayments}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Successful payments
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
                  Pending
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {pendingPayments}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Awaiting confirmation
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Failed
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {failedPayments}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Unsuccessful attempts
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
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
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value: PaymentStatus) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
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
              Showing {currentPayments.length} of {filteredPayments.length} payments
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-dash-white">
        <CardHeader>
          <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentPayments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-dash-navy/30 mx-auto mb-4" />
                <h3 className="text-lg font-normal text-dash-navy mb-2 tracking-wide">
                  No payments found
                </h3>
                <p className="text-dash-navy/70">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              currentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="font-medium text-dash-navy">
                        {payment.eventName}
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-dash-navy/60">
                      <span>{payment.customerName}</span>
                      <span>•</span>
                      <span>{payment.paymentMethod}</span>
                      <span>•</span>
                      <span>{formatDate(payment.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-dash-navy">
                      ₱{payment.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-dash-navy/50">
                      {payment.transactionId.slice(-8)}
                    </div>
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
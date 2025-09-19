'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Calendar, Timer, Users, Trash2, QrCode as QrCodeIcon, AlertCircle } from 'lucide-react';
import { eventsApi, Event, QrCode } from '@/lib/api/events';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { QrCodeStatus } from '@org/commons';

interface QrCodeStatusBadgeProps {
  status: `${QrCodeStatus}`;
}

const statusConfig: Record<`${QrCodeStatus}`, { color: string; label: string }> = {
  [QrCodeStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', label: 'ACTIVE' },
  [QrCodeStatus.EXPIRED]: { color: 'bg-red-100 text-red-800', label: 'EXPIRED' },
  [QrCodeStatus.USED]: { color: 'bg-blue-100 text-blue-800', label: 'USED' },
  [QrCodeStatus.INVALIDATED]: { color: 'bg-gray-100 text-gray-800', label: 'INVALIDATED' },
  [QrCodeStatus.PAID]: { color: 'bg-green-800 text-white', label: 'PAID' },
  [QrCodeStatus.FAILED]: { color: 'bg-red-100 text-red-800', label: 'FAILED' },
};

function QrCodeStatusBadge({ status }: QrCodeStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge className={cn(config.color, 'px-2 py-0.5 text-xs font-medium')}>{config.label}</Badge>;
}

interface QrCodeStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

function QrCodeStat({ icon, label, value, bgColor, iconColor }: QrCodeStatProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn('p-1.5 rounded-md', bgColor)}>
        <div className={cn('w-4 h-4', iconColor)}>{icon}</div>
      </div>
      <div>
        <div className="text-xs text-dash-navy/50 font-medium">{label}</div>
        <div className="text-dash-navy">{value}</div>
      </div>
    </div>
  );
}

interface QrCodeItemProps {
  qrCode: QrCode;
}

function QrCodeItem({ qrCode }: QrCodeItemProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  const formatDuration = (createdAt: string, expiresAt: string) => {
    const diffMinutes = Math.floor((new Date(expiresAt).getTime() - new Date(createdAt).getTime()) / 60000);
    return `${diffMinutes} mins`;
  };

  return (
    <Card className="border-dash-gray/30 hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <QrCodeStatusBadge status={qrCode.status} />
              <span className="text-xs bg-dash-gray/10 px-2 py-0.5 rounded text-dash-navy/60 font-mono">
                {qrCode.id.slice(0, 8)}...
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <QrCodeStat
                icon={<Calendar />}
                label="Created"
                value={formatDateTime(qrCode.createdAt)}
                bgColor="bg-blue-50"
                iconColor="text-blue-500"
              />
              <QrCodeStat
                icon={<Calendar />}
                label="Expires"
                value={formatDateTime(qrCode.expiresAt)}
                bgColor="bg-red-50"
                iconColor="text-red-500"
              />
              <QrCodeStat
                icon={<RefreshCw />}
                label="Duration"
                value={formatDuration(qrCode.createdAt, qrCode.expiresAt)}
                bgColor="bg-purple-50"
                iconColor="text-purple-500"
              />
              <QrCodeStat
                icon={<Users />}
                label="Usage"
                value={`${qrCode.usageCount}/${qrCode.maxUsage}`}
                bgColor="bg-green-50"
                iconColor="text-green-500"
              />
            </div>

            <div className="flex gap-3 pt-1">
              {qrCode.usedAt && (
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center">
                  <Timer className="w-3 h-3 mr-1" />
                  Used: {formatDateTime(qrCode.usedAt as unknown as string)}
                </div>
              )}
              {qrCode.invalidatedAt && (
                <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md flex items-center">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Invalidated: {formatDateTime(qrCode.invalidatedAt as unknown as string)}
                </div>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="bg-red-50 border-red-200">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load QR code history.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-2 border-red-200 hover:bg-red-100/50 text-red-600"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function QRCodeSkeleton() {
  return (
    <Card className="border-dash-gray/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QRCodeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

interface QrCodeStatsProps {
  qrCodes: QrCode[];
}

function QrCodeStats({ qrCodes }: QrCodeStatsProps) {
  const stats = [
    {
      label: 'Total QR Codes',
      value: qrCodes.length,
      icon: (
        <QrCodeIcon className="w-4 h-4 text-dash-navy/50 group-hover:text-dash-navy transition-colors duration-200" />
      ),
      bgColor: 'bg-dash-gray/5',
      hoverBgColor: 'hover:bg-dash-gray/10',
      textColor: 'text-dash-navy',
    },
    {
      label: 'Active',
      value: qrCodes.filter((qr) => qr.status === QrCodeStatus.ACTIVE).length,
      icon: <div className="w-2 h-2 rounded-full bg-green-500" />,
      bgColor: 'bg-green-50',
      hoverBgColor: 'hover:bg-green-100/50',
      textColor: 'text-green-600',
    },
    {
      label: 'Used',
      value: qrCodes.filter((qr) => qr.status === QrCodeStatus.USED).length,
      icon: <div className="w-2 h-2 rounded-full bg-blue-500" />,
      bgColor: 'bg-blue-50',
      hoverBgColor: 'hover:bg-blue-100/50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Expired',
      value: qrCodes.filter((qr) => qr.status === QrCodeStatus.EXPIRED).length,
      icon: <div className="w-2 h-2 rounded-full bg-red-500" />,
      bgColor: 'bg-red-50',
      hoverBgColor: 'hover:bg-red-100/50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="border-t border-dash-gray/30 pt-4">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              'rounded-lg p-3 text-center group transition-colors duration-200',
              stat.bgColor,
              stat.hoverBgColor,
            )}
          >
            <div className={cn('text-lg font-semibold flex items-center justify-center gap-2', stat.textColor)}>
              {stat.icon}
              {stat.value}
            </div>
            <div className="text-xs text-dash-navy/60 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QRCodeHistoryModal({ isOpen, onClose, event }: QRCodeHistoryModalProps) {
  const {
    data: qrCodes = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<QrCode[], Error>({
    queryKey: ['qrCodeHistory', event.id] as const,
    queryFn: () => eventsApi.qr.getHistory(event.id),
    enabled: isOpen && !!event.id,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5 text-dash-orange" />
            QR Code History
            <span className="text-dash-navy/50 text-base font-normal">- {event.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-6 pt-2">
          {/* Refresh Button */}
          <div className="flex justify-between items-center bg-dash-gray/5 p-3 rounded-lg">
            <p className="text-sm text-dash-navy/70 flex items-center gap-2">
              <QrCodeIcon className="w-4 h-4" />
              View all QR codes generated for this event
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              className={cn(
                'border-dash-gray/50 hover:bg-dash-gray/10 transition-all duration-200 hover:shadow-sm',
                isFetching && 'opacity-70',
              )}
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', (isLoading || isFetching) && 'animate-spin')} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* QR Code List */}
          <div className="space-y-3 max-h-[calc(90vh-300px)] overflow-y-auto pr-2 -mr-2">
            {error ? (
              <ErrorState onRetry={() => refetch()} />
            ) : isLoading ? (
              <>
                <QRCodeSkeleton />
                <QRCodeSkeleton />
                <QRCodeSkeleton />
              </>
            ) : qrCodes.length > 0 ? (
              qrCodes.map((qrCode) => <QrCodeItem key={qrCode.id} qrCode={qrCode} />)
            ) : (
              <div className="text-center py-8 text-dash-navy/60">
                <QrCodeIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No QR codes found for this event</p>
              </div>
            )}
          </div>

          {/* Statistics */}
          {qrCodes.length > 0 && <QrCodeStats qrCodes={qrCodes} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

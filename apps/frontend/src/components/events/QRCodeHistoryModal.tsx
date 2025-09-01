'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Clock, Eye, Trash2, QrCode as QrCodeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { eventsApi, QrCode } from '@/lib/api/events';
import { toast } from 'sonner';

interface Event {
  id: string;
  name: string;
}

interface QRCodeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export function QRCodeHistoryModal({ isOpen, onClose, event }: QRCodeHistoryModalProps) {
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(false);

  // Load QR code history when modal opens
  useEffect(() => {
    if (isOpen && event.id) {
      loadQRCodeHistory();
    }
  }, [isOpen, event.id]);

  const loadQRCodeHistory = async () => {
    setLoading(true);
    try {
      const history = await eventsApi.qr.getHistory(event.id);
      setQrCodes(history);
    } catch (error) {
      console.error('Failed to load QR code history:', error);
      toast.error('Failed to load QR code history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'invalidated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (createdAt: string, expiresAt: string): string => {
    const created = new Date(createdAt);
    const expired = new Date(expiresAt);
    const diffMinutes = Math.floor((expired.getTime() - created.getTime()) / 60000);
    return `${diffMinutes} mins`;
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>QR Code History - {event.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Refresh Button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-dash-navy/70">
              View all QR codes generated for this event
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadQRCodeHistory}
              disabled={loading}
              className="border-dash-gray/50 hover:bg-dash-gray/10"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {/* QR Code List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-dash-orange" />
              </div>
            ) : qrCodes.length > 0 ? (
              qrCodes.map((qrCode) => (
                <Card key={qrCode.id} className="border-dash-gray/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(qrCode.status)}>
                            {qrCode.status.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-dash-navy/60">
                            ID: {qrCode.id.slice(0, 8)}...
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-dash-navy">Created:</span>
                            <br />
                            <span className="text-dash-navy/70">
                              {formatDateTime(qrCode.createdAt)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-dash-navy">Expires:</span>
                            <br />
                            <span className="text-dash-navy/70">
                              {formatDateTime(qrCode.expiresAt)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-dash-navy">Duration:</span>
                            <br />
                            <span className="text-dash-navy/70">
                              {formatDuration(qrCode.createdAt, qrCode.expiresAt)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-dash-navy">Usage:</span>
                            <br />
                            <span className="text-dash-navy/70">
                              {qrCode.usageCount}/{qrCode.maxUsage}
                            </span>
                          </div>
                        </div>

                        {/* Additional status info */}
                        {qrCode.usedAt && (
                          <div className="text-xs text-green-600">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Used: {formatDateTime(qrCode.usedAt)}
                          </div>
                        )}
                        {qrCode.invalidatedAt && (
                          <div className="text-xs text-gray-600">
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            Invalidated: {formatDateTime(qrCode.invalidatedAt)}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(qrCode.paymongoLinkUrl);
                            toast.success('Payment URL copied');
                          }}
                          className="border-dash-gray/50 hover:bg-dash-gray/10 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View URL
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-dash-navy/60">
                <QrCodeIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No QR codes found for this event</p>
              </div>
            )}
          </div>

          {/* Statistics */}
          {qrCodes.length > 0 && (
            <div className="border-t border-dash-gray/30 pt-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-dash-navy">
                    {qrCodes.length}
                  </div>
                  <div className="text-xs text-dash-navy/60">Total QR Codes</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {qrCodes.filter(qr => qr.status === 'active').length}
                  </div>
                  <div className="text-xs text-dash-navy/60">Active</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">
                    {qrCodes.filter(qr => qr.status === 'used').length}
                  </div>
                  <div className="text-xs text-dash-navy/60">Used</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">
                    {qrCodes.filter(qr => qr.status === 'expired').length}
                  </div>
                  <div className="text-xs text-dash-navy/60">Expired</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
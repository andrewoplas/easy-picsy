'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { eventsApi, QrCode, QrCodeStatus, Event } from '@/lib/api/events';
import { toast } from 'sonner';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

interface QRCodeState {
  qrCode: QrCode | null;
  status: QrCodeStatus | null;
  loading: boolean;
  regenerating: boolean;
  timeUntilExpiry: number | null;
  error: string | null;
}

export function QRCodeModal({ isOpen, onClose, event }: QRCodeModalProps) {
  const [qrState, setQrState] = useState<QRCodeState>({
    qrCode: null,
    status: null,
    loading: false,
    regenerating: false,
    timeUntilExpiry: null,
    error: null,
  });

  // Memoized computed values
  const isQRCodeValid = useMemo(
    () => qrState.qrCode && qrState.status?.isValid,
    [qrState.qrCode, qrState.status?.isValid],
  );

  const formattedPrice = useMemo(() => `₱${Number(event.price || 0).toFixed(2)}`, [event.price]);

  // Enhanced QR code loading with better state management
  const loadCurrentQRCode = useCallback(async () => {
    setQrState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const currentQrCode = await eventsApi.qr.getCurrent(event.id);

      let status: QrCodeStatus | null = null;
      if (currentQrCode) {
        status = await eventsApi.qr.getStatus(currentQrCode.id);
      }

      setQrState((prev) => ({
        ...prev,
        qrCode: currentQrCode,
        status,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load QR code';
      console.error('Failed to load QR code:', error);

      setQrState((prev) => ({
        ...prev,
        qrCode: null,
        status: null,
        loading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  }, [event.id]);

  // Load QR code when modal opens
  useEffect(() => {
    if (isOpen && event.id) {
      loadCurrentQRCode();
    }
  }, [isOpen, event.id, loadCurrentQRCode]);

  // Enhanced countdown timer with better cleanup
  useEffect(() => {
    if (!qrState.status?.isValid || !qrState.status.timeUntilExpiry) {
      return;
    }

    setQrState((prev) => ({
      ...prev,
      timeUntilExpiry: qrState.status?.timeUntilExpiry || null,
    }));

    const interval = setInterval(() => {
      setQrState((prev) => {
        const newTime = prev.timeUntilExpiry ? prev.timeUntilExpiry - 1000 : null;

        if (!newTime || newTime <= 0) {
          clearInterval(interval);
          loadCurrentQRCode(); // Refresh status when expired
          return { ...prev, timeUntilExpiry: null };
        }

        return { ...prev, timeUntilExpiry: newTime };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qrState.status?.isValid, qrState.status?.timeUntilExpiry, loadCurrentQRCode]);

  // Enhanced regenerate handler
  const handleRegenerate = useCallback(async () => {
    setQrState((prev) => ({ ...prev, regenerating: true, error: null }));

    try {
      const newQrCode = await eventsApi.qr.regenerate(event.id);
      const status = await eventsApi.qr.getStatus(newQrCode.id);

      setQrState((prev) => ({
        ...prev,
        qrCode: newQrCode,
        status,
        regenerating: false,
        error: null,
      }));

      toast.success('QR code regenerated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to regenerate QR code';
      console.error('Failed to regenerate QR code:', error);

      setQrState((prev) => ({
        ...prev,
        regenerating: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  }, [event.id]);

  // Utility functions with better type safety
  const formatTimeUntilExpiry = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getStatusColor = useCallback((status: string): string => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      used: 'bg-blue-100 text-blue-800 border-blue-200',
      invalidated: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  }, []);

  // Enhanced close handler with cleanup
  const handleClose = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQrState((prev) => ({
        ...prev,
        error: null,
        timeUntilExpiry: null,
      }));
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold tracking-wide text-dash-navy">QR Payment Code</DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6">
          {/* Event Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-dash-navy tracking-wide">{event.name}</h3>
            {event.description && (
              <p className="text-sm text-dash-navy/70 max-w-sm mx-auto leading-relaxed">{event.description}</p>
            )}
            <p className="text-2xl font-bold text-dash-orange">{formattedPrice}</p>

            {/* Enhanced QR Code Status */}
            {qrState.qrCode && qrState.status && (
              <div className="flex justify-center items-center gap-3 mt-4">
                <Badge className={`${getStatusColor(qrState.qrCode.status)} border`}>
                  {qrState.qrCode.status.toUpperCase()}
                </Badge>
                {qrState.status.isValid && qrState.timeUntilExpiry && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeUntilExpiry(qrState.timeUntilExpiry)}
                  </Badge>
                )}
              </div>
            )}

            {/* Error Display */}
            {qrState.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-red-600">{qrState.error}</p>
              </div>
            )}
          </div>

          {/* Enhanced QR Code Display */}
          <div className="flex justify-center">
            {qrState.loading ? (
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 w-64 h-64 flex items-center justify-center shadow-sm">
                <div className="text-center space-y-3">
                  <RefreshCw className="w-10 h-10 animate-spin mx-auto text-dash-orange" />
                  <p className="text-sm text-dash-navy/70 font-medium">Loading QR code...</p>
                </div>
              </div>
            ) : isQRCodeValid ? (
              <div className="p-4 bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={qrState.qrCode?.qrData || ''}
                  alt={`QR Payment Code for ${event.name}`}
                  width={224}
                  height={224}
                  className="w-56 h-56 rounded-lg"
                  priority
                  unoptimized // Important: QR code is already base64 encoded
                />
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 w-64 h-64 flex items-center justify-center shadow-sm">
                <div className="text-center space-y-4">
                  <AlertTriangle className="w-10 h-10 mx-auto text-red-500" />
                  <div className="space-y-2">
                    <p className="text-sm text-red-700 font-medium">
                      {qrState.qrCode ? 'QR code has expired' : 'No active QR code'}
                    </p>
                    <p className="text-xs text-red-600">
                      {qrState.qrCode ? 'Generate a new one to continue' : 'Create your first QR code'}
                    </p>
                  </div>
                  <Button
                    onClick={handleRegenerate}
                    disabled={qrState.regenerating}
                    size="sm"
                    className="bg-dash-orange hover:bg-dash-orange/90 text-white shadow-md"
                  >
                    {qrState.regenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    {qrState.qrCode ? 'Regenerate QR' : 'Generate QR'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Regenerate Button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={qrState.regenerating}
              className="border-dash-orange text-dash-orange hover:bg-dash-orange/10 min-w-[130px] transition-all"
              aria-label="Generate new QR code"
            >
              {qrState.regenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {qrState.regenerating ? 'Generating...' : 'Regenerate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

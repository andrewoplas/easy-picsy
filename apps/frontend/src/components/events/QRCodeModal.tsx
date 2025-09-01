'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Check, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { eventsApi, QrCode, QrCodeStatus } from '@/lib/api/events';
import { toast } from 'sonner';

interface Event {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export function QRCodeModal({ isOpen, onClose, event }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState<QrCode | null>(null);
  const [qrStatus, setQrStatus] = useState<QrCodeStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  const handleCopyUrl = async () => {
    if (qrCode?.paymongoLinkUrl) {
      await navigator.clipboard.writeText(qrCode.paymongoLinkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Payment URL copied to clipboard');
    }
  };

  const handleDownloadQR = () => {
    if (qrCode) {
      // Generate QR code image and trigger download
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      
      if (ctx) {
        // Simple QR code placeholder - in production use a proper QR library
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 300, 300);
        ctx.fillStyle = 'black';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('QR Code for', 150, 130);
        ctx.fillText(event.name, 150, 150);
        ctx.fillText(`₱${event.price.toFixed(2)}`, 150, 170);
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `qr-code-${event.name.replace(/\s+/g, '-')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('QR code downloaded');
        }
      });
    }
  };

  // Load QR code when modal opens
  useEffect(() => {
    if (isOpen && event.id) {
      loadCurrentQRCode();
    }
  }, [isOpen, event.id]);

  // Update countdown timer
  useEffect(() => {
    if (qrStatus?.isValid && qrStatus.timeUntilExpiry) {
      setTimeUntilExpiry(qrStatus.timeUntilExpiry);
      
      const interval = setInterval(() => {
        setTimeUntilExpiry((prev) => {
          if (prev === null || prev <= 1000) {
            // QR code expired
            clearInterval(interval);
            loadCurrentQRCode(); // Refresh status
            return null;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
    
    return () => {}; // Empty cleanup function for when condition is not met
  }, [qrStatus]);

  const loadCurrentQRCode = async () => {
    setLoading(true);
    try {
      const currentQrCode = await eventsApi.qr.getCurrent(event.id);
      setQrCode(currentQrCode);
      
      if (currentQrCode) {
        const status = await eventsApi.qr.getStatus(currentQrCode.id);
        setQrStatus(status);
      } else {
        setQrStatus(null);
      }
    } catch (error) {
      console.error('Failed to load QR code:', error);
      toast.error('Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const newQrCode = await eventsApi.qr.regenerate(event.id);
      setQrCode(newQrCode);
      
      const status = await eventsApi.qr.getStatus(newQrCode.id);
      setQrStatus(status);
      
      toast.success('QR code regenerated successfully');
    } catch (error) {
      console.error('Failed to regenerate QR code:', error);
      toast.error('Failed to regenerate QR code');
    } finally {
      setRegenerating(false);
    }
  };

  const formatTimeUntilExpiry = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  // Generate QR code data URL (placeholder - use proper QR library in production)
  const generateQRCodeDataUrl = (qrData: string) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="none" stroke="black" stroke-width="2"/>
        <text x="100" y="80" text-anchor="middle" font-family="monospace" font-size="10" fill="black">
          Paymongo QR
        </text>
        <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12" fill="black">
          ${event.name}
        </text>
        <text x="100" y="120" text-anchor="middle" font-family="monospace" font-size="8" fill="gray">
          ₱${event.price.toFixed(2)}
        </text>
        <text x="100" y="140" text-anchor="middle" font-family="monospace" font-size="6" fill="gray">
          Scan to Pay
        </text>
        <rect x="40" y="40" width="20" height="20" fill="black"/>
        <rect x="140" y="40" width="20" height="20" fill="black"/>
        <rect x="40" y="140" width="20" height="20" fill="black"/>
        <rect x="60" y="60" width="80" height="80" fill="none" stroke="black" stroke-width="1"/>
      </svg>
    `)}`;
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-normal tracking-wide">QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          {/* Event Info */}
          <div>
            <h3 className="text-lg font-normal text-dash-navy mb-1 tracking-wide">{event.name}</h3>
            {event.description && (
              <p className="text-sm text-dash-navy/70 mb-2">{event.description}</p>
            )}
            <p className="text-xl font-bold text-dash-orange">
              ₱{event.price.toFixed(2)}
            </p>
            
            {/* QR Code Status */}
            {qrCode && qrStatus && (
              <div className="flex justify-center items-center gap-2 mt-2">
                <Badge className={getStatusColor(qrCode.status)}>
                  {qrCode.status.toUpperCase()}
                </Badge>
                {qrStatus.isValid && timeUntilExpiry && (
                  <Badge variant="outline" className="text-orange-600">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeUntilExpiry(timeUntilExpiry)}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            {loading ? (
              <div className="p-4 bg-white rounded-lg border-2 border-dash-gray/30 w-56 h-56 flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-dash-orange" />
                  <p className="text-sm text-dash-navy/60">Loading QR code...</p>
                </div>
              </div>
            ) : qrCode && qrStatus?.isValid ? (
              <div className="p-4 bg-white rounded-lg border-2 border-dash-gray/30">
                <img 
                  src={generateQRCodeDataUrl(qrCode.qrData)} 
                  alt={`QR Code for ${event.name}`}
                  className="w-48 h-48"
                />
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200 w-56 h-56 flex items-center justify-center">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <p className="text-sm text-red-600 mb-2">
                    {qrCode ? 'QR code has expired' : 'No active QR code'}
                  </p>
                  <Button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    size="sm"
                    className="bg-dash-orange hover:bg-dash-orange/90"
                  >
                    {regenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      'Generate New QR'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* QR Code URL */}
          {qrCode && (
            <div>
              <label className="block text-sm font-medium text-dash-navy mb-2">
                Payment URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={qrCode.paymongoLinkUrl || ''}
                  readOnly
                  className="flex-1 px-3 py-2 border border-dash-gray/50 rounded-lg bg-dash-gray/10 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="border-dash-gray/50 hover:bg-dash-gray/10"
                  disabled={!qrStatus?.isValid}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-left bg-dash-gray/10 p-4 rounded-lg">
            <h4 className="font-semibold text-dash-navy mb-2">Instructions:</h4>
            <ol className="text-sm text-dash-navy/70 space-y-1 list-decimal list-inside">
              <li>Download the QR code image</li>
              <li>Add it to your dslrBooth lock screen background</li>
              <li>Customers scan to pay and unlock the booth</li>
              <li>Sessions automatically lock when complete</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={handleCopyUrl}
              className="border-dash-gray/50 hover:bg-dash-gray/10"
              disabled={!qrStatus?.isValid}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy URL'}
            </Button>
            <Button
              onClick={handleDownloadQR}
              className="bg-dash-orange hover:bg-dash-orange/90 text-white"
              disabled={!qrStatus?.isValid}
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="border-dash-orange text-dash-orange hover:bg-dash-orange/10"
            >
              {regenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Regenerate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
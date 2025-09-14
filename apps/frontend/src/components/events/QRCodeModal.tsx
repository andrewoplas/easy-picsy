'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Check, RefreshCw, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
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

type ActionState = 'idle' | 'loading' | 'success' | 'error';

interface QRCodeState {
  qrCode: QrCode | null;
  status: QrCodeStatus | null;
  loading: boolean;
  regenerating: boolean;
  timeUntilExpiry: number | null;
  error: string | null;
}

export function QRCodeModal({ isOpen, onClose, event }: QRCodeModalProps) {
  const [copyState, setCopyState] = useState<ActionState>('idle');
  const [qrState, setQrState] = useState<QRCodeState>({
    qrCode: null,
    status: null,
    loading: false,
    regenerating: false,
    timeUntilExpiry: null,
    error: null,
  });

  // Memoized computed values
  const isQRCodeValid = useMemo(() => 
    qrState.qrCode && qrState.status?.isValid, 
    [qrState.qrCode, qrState.status?.isValid]
  );

  const formattedPrice = useMemo(() => 
    `₱${Number(event.price || 0).toFixed(2)}`, 
    [event.price]
  );

  const qrCodeImageName = useMemo(() => 
    `qr-code-${event.name.replace(/\s+/g, '-')}.png`, 
    [event.name]
  );

  // Enhanced copy handler with better error handling
  const handleCopyUrl = useCallback(async () => {
    if (!qrState.qrCode?.paymongoLinkUrl) {
      toast.error('No payment URL available');
      return;
    }

    try {
      setCopyState('loading');
      await navigator.clipboard.writeText(qrState.qrCode.paymongoLinkUrl);
      setCopyState('success');
      toast.success('Payment URL copied to clipboard');
      
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('error');
      toast.error('Failed to copy URL');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  }, [qrState.qrCode?.paymongoLinkUrl]);

  // Enhanced download handler with better error handling
  const handleDownloadQR = useCallback(() => {
    if (!isQRCodeValid) {
      toast.error('No valid QR code available for download');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }
      
      canvas.width = 400;
      canvas.height = 400;

      // Enhanced QR code placeholder with better styling
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 400, 400);
      
      // Border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 380, 380);
      
      // Content
      ctx.fillStyle = 'black';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR Payment Code', 200, 80);
      
      ctx.font = '18px Arial';
      ctx.fillText(event.name, 200, 120);
      
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#ea580c';
      ctx.fillText(formattedPrice, 200, 160);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Scan to pay with GCash, Maya or Bank App', 200, 320);
      
      // QR code placeholder dots
      ctx.fillStyle = 'black';
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          if (Math.random() > 0.3) {
            ctx.fillRect(150 + i * 8, 180 + j * 8, 6, 6);
          }
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to generate image');
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = qrCodeImageName;
        link.setAttribute('aria-label', `Download QR code for ${event.name}`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('QR code downloaded successfully');
      }, 'image/png', 0.95);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download QR code');
    }
  }, [isQRCodeValid, event.name, formattedPrice, qrCodeImageName]);

  // Enhanced QR code loading with better state management
  const loadCurrentQRCode = useCallback(async () => {
    setQrState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const currentQrCode = await eventsApi.qr.getCurrent(event.id);
      
      let status: QrCodeStatus | null = null;
      if (currentQrCode) {
        status = await eventsApi.qr.getStatus(currentQrCode.id);
      }
      
      setQrState(prev => ({
        ...prev,
        qrCode: currentQrCode,
        status,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load QR code';
      console.error('Failed to load QR code:', error);
      
      setQrState(prev => ({
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

    setQrState(prev => ({ 
      ...prev, 
      timeUntilExpiry: qrState.status?.timeUntilExpiry || null 
    }));

    const interval = setInterval(() => {
      setQrState(prev => {
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
    setQrState(prev => ({ ...prev, regenerating: true, error: null }));
    
    try {
      const newQrCode = await eventsApi.qr.regenerate(event.id);
      const status = await eventsApi.qr.getStatus(newQrCode.id);
      
      setQrState(prev => ({
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
      
      setQrState(prev => ({
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

  // Enhanced QR code SVG generator with better design
  const generateQRCodeDataUrl = useCallback((qrData: string) => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="240" height="240" fill="url(#bg)" rx="12"/>
        
        <!-- Border -->
        <rect x="8" y="8" width="224" height="224" fill="none" stroke="#e2e8f0" stroke-width="2" rx="8"/>
        
        <!-- Header -->
        <text x="120" y="35" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="600" fill="#1e293b">
          PayMongo QR Payment
        </text>
        
        <!-- Event name -->
        <text x="120" y="55" text-anchor="middle" font-family="system-ui" font-size="12" fill="#334155">
          ${event.name.length > 20 ? event.name.substring(0, 20) + '...' : event.name}
        </text>
        
        <!-- Price -->
        <text x="120" y="75" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="700" fill="#ea580c">
          ${formattedPrice}
        </text>
        
        <!-- QR Code Area -->
        <rect x="50" y="90" width="140" height="140" fill="white" stroke="#e2e8f0" stroke-width="1" rx="4"/>
        
        <!-- QR Code Pattern (enhanced placeholder) -->
        <g fill="#000">
          <!-- Corner squares -->
          <rect x="60" y="100" width="30" height="30"/>
          <rect x="150" y="100" width="30" height="30"/>
          <rect x="60" y="190" width="30" height="30"/>
          
          <!-- Inner corner dots -->
          <rect x="70" y="110" width="10" height="10" fill="white"/>
          <rect x="160" y="110" width="10" height="10" fill="white"/>
          <rect x="70" y="200" width="10" height="10" fill="white"/>
          
          <!-- Data pattern -->
          ${Array.from({ length: 12 }, (_, i) => 
            Array.from({ length: 12 }, (_, j) => 
              Math.random() > 0.4 ? 
                `<rect x="${100 + j * 6}" y="${130 + i * 6}" width="4" height="4"/>` : ''
            ).join('')
          ).join('')}
        </g>
        
        <!-- Footer -->
        <text x="120" y="250" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748b">
          Scan with GCash, Maya, or Bank App
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  }, [event.name, formattedPrice]);

  // Enhanced close handler with cleanup
  const handleClose = useCallback((open: boolean) => {
    if (!open) {
      // Reset copy state when closing
      setCopyState('idle');
      onClose();
    }
  }, [onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopyState('idle');
      setQrState(prev => ({ 
        ...prev, 
        error: null,
        timeUntilExpiry: null 
      }));
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold tracking-wide text-dash-navy">
            QR Payment Code
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6">
          {/* Event Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-dash-navy tracking-wide">
              {event.name}
            </h3>
            {event.description && (
              <p className="text-sm text-dash-navy/70 max-w-sm mx-auto leading-relaxed">
                {event.description}
              </p>
            )}
            <p className="text-2xl font-bold text-dash-orange">
              {formattedPrice}
            </p>

            {/* Enhanced QR Code Status */}
            {qrState.qrCode && qrState.status && (
              <div className="flex justify-center items-center gap-3 mt-4">
                <Badge className={`${getStatusColor(qrState.qrCode.status)} border`}>
                  {qrState.qrCode.status.toUpperCase()}
                </Badge>
                {qrState.status.isValid && qrState.timeUntilExpiry && (
                  <Badge 
                    variant="outline" 
                    className="text-orange-600 border-orange-200 bg-orange-50"
                  >
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
                  src={generateQRCodeDataUrl(qrState.qrCode?.qrData || '')}
                  alt={`QR Payment Code for ${event.name}`}
                  width={224}
                  height={224}
                  className="w-56 h-56 rounded-lg"
                  priority
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

          {/* Enhanced Payment URL Section */}
          {qrState.qrCode && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <label className="text-sm font-medium text-dash-navy">
                  Payment URL
                </label>
                {qrState.qrCode.paymongoLinkUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(qrState.qrCode?.paymongoLinkUrl, '_blank')}
                    className="text-dash-orange hover:text-dash-orange/80 p-1 h-auto"
                    disabled={!isQRCodeValid}
                    aria-label="Open payment URL in new tab"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={qrState.qrCode.paymongoLinkUrl || ''}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-dash-orange/20 focus:border-dash-orange transition-colors"
                  aria-label="Payment URL"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={!isQRCodeValid || copyState === 'loading'}
                  aria-label="Copy payment URL"
                >
                  {copyState === 'loading' ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : copyState === 'success' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Instructions */}
          <div className="text-left bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-dash-orange rounded-full"></div>
              <h4 className="font-semibold text-dash-navy">Setup Instructions</h4>
            </div>
            <ol className="text-sm text-dash-navy/80 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Download the QR code image using the button below</li>
              <li>Add it to your dslrBooth lock screen background</li>
              <li>Customers scan with GCash, Maya, or bank apps to pay</li>
              <li>Payment unlocks the booth automatically</li>
              <li>Sessions lock again when the timer expires</li>
            </ol>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCopyUrl}
              className="border-gray-300 hover:bg-gray-50 min-w-[120px] transition-all"
              disabled={!isQRCodeValid || copyState === 'loading'}
              aria-label="Copy payment URL to clipboard"
            >
              {copyState === 'loading' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : copyState === 'success' ? (
                <Check className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copyState === 'success' ? 'Copied!' : 'Copy URL'}
            </Button>
            
            <Button
              onClick={handleDownloadQR}
              className="bg-dash-orange hover:bg-dash-orange/90 text-white min-w-[140px] shadow-md transition-all"
              disabled={!isQRCodeValid}
              aria-label="Download QR code image"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
            
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
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Event {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  isActive: boolean;
  qrCodeUrl?: string;
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

  const handleCopyUrl = async () => {
    if (event.qrCodeUrl) {
      await navigator.clipboard.writeText(event.qrCodeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    // In a real implementation, this would generate and download a QR code image
    // For now, we'll just show an alert
    alert('QR Code download would be implemented here. The QR code would contain: ' + event.qrCodeUrl);
  };

  // Generate a simple QR code placeholder (in production, use a QR code library)
  const qrCodeDataUrl = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="160" height="160" fill="none" stroke="black" stroke-width="2"/>
      <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12" fill="black">
        QR Code for
      </text>
      <text x="100" y="120" text-anchor="middle" font-family="monospace" font-size="10" fill="black">
        ${event.name}
      </text>
      <text x="100" y="140" text-anchor="middle" font-family="monospace" font-size="8" fill="gray">
        ₱${event.price.toFixed(2)}
      </text>
      <rect x="40" y="40" width="20" height="20" fill="black"/>
      <rect x="140" y="40" width="20" height="20" fill="black"/>
      <rect x="40" y="140" width="20" height="20" fill="black"/>
      <rect x="60" y="60" width="80" height="80" fill="none" stroke="black" stroke-width="1"/>
    </svg>
  `)}`;

  const handleClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          {/* Event Info */}
          <div>
            <h3 className="text-lg font-semibold text-dash-navy mb-1">{event.name}</h3>
            {event.description && (
              <p className="text-sm text-dash-navy/70 mb-2">{event.description}</p>
            )}
            <p className="text-xl font-bold text-dash-orange">
              ₱{event.price.toFixed(2)}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border-2 border-dash-gray/30">
              <img 
                src={qrCodeDataUrl} 
                alt={`QR Code for ${event.name}`}
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* QR Code URL */}
          <div>
            <label className="block text-sm font-medium text-dash-navy mb-2">
              Payment URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={event.qrCodeUrl || ''}
                readOnly
                className="flex-1 px-3 py-2 border border-dash-gray/50 rounded-lg bg-dash-gray/10 text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="border-dash-gray/50 hover:bg-dash-gray/10"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

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
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy URL'}
            </Button>
            <Button
              onClick={handleDownloadQR}
              className="bg-dash-orange hover:bg-dash-orange/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: {
    name: string;
    price: number;
  }) => void;
  isLoading?: boolean;
}

export function CreateEventModal({ isOpen, onClose, onSubmit, isLoading = false }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.price || parseFloat(formData.price) < 20) newErrors.price = 'Price must be ₱20 or more';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      price: parseFloat(formData.price)
    });

    // Reset form
    setFormData({
      name: '',
      price: ''
    });
    setErrors({});
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setFormData({
        name: '',
        price: ''
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-dash-white border-dash-gray/30">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-sans text-dash-navy tracking-wide">
            Create New Event
          </DialogTitle>
          <p className="text-sm text-dash-navy/60 font-sans">
            Set up a new event with pricing details
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dash-navy font-sans">
              Event Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Sarah's Wedding"
              disabled={isLoading}
              className={`font-sans ${errors.name ? 'border-destructive focus:border-destructive' : 'border-dash-gray/50 focus:border-dash-orange focus:ring-dash-orange/20'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
            {errors.name && (
              <p className="text-destructive text-sm font-sans flex items-center gap-1">
                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dash-navy font-sans">
              Price (₱) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dash-navy/60 font-sans">
                ₱
              </span>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                disabled={isLoading}
                className={`pl-8 font-sans ${errors.price ? 'border-destructive focus:border-destructive' : 'border-dash-gray/50 focus:border-dash-orange focus:ring-dash-orange/20'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.price && (
              <p className="text-destructive text-sm font-sans flex items-center gap-1">
                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                {errors.price}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-dash-gray/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isLoading}
              className="font-sans border-dash-gray/50 text-dash-navy hover:bg-dash-gray/10 hover:border-dash-gray/70 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-dash-orange hover:bg-dash-orange/90 text-white font-sans font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
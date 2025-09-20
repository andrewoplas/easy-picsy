'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Event } from '@/lib/api/events';

interface UpdateEventData {
  name?: string;
  price?: number;
}

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSubmit: (eventId: string, updateData: UpdateEventData) => void;
}

export function EditEventModal({ isOpen, onClose, event, onSubmit }: EditEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && event) {
      setFormData({
        name: event.name,
        price: event.price.toString()
      });
      setErrors({});
    }
  }, [isOpen, event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updateData: UpdateEventData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price)
    };

    onSubmit(event.id, updateData);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-dash-white border-dash-gray/30">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-sans text-dash-navy tracking-wide">
            Edit Event
          </DialogTitle>
          <p className="text-sm text-dash-navy/60 font-sans">
            Update event details and pricing
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
              className={`font-sans ${errors.name ? 'border-destructive focus:border-destructive' : 'border-dash-gray/50 focus:border-dash-orange focus:ring-dash-orange/20'}`}
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
                className={`pl-8 font-sans ${errors.price ? 'border-destructive focus:border-destructive' : 'border-dash-gray/50 focus:border-dash-orange focus:ring-dash-orange/20'}`}
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
              className="font-sans border-dash-gray/50 text-dash-navy hover:bg-dash-gray/10 hover:border-dash-gray/70"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-dash-orange hover:bg-dash-orange/90 text-white font-sans font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
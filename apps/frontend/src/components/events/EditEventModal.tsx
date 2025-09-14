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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-normal tracking-wide">Edit Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dash-navy mb-2">
                Event Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sarah's Wedding"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dash-navy mb-2">
                Price (₱) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-dash-orange hover:bg-dash-orange/90 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
}
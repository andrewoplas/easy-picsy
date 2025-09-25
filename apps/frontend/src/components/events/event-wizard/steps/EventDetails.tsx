'use client';

import { Input } from '@/components/ui/input';
import { LockScreenUpload } from '../../lock-screen';
import type { FormData } from '..';

interface EventDetailsProps {
  formData: FormData;
  onChange: (data: FormData) => void;
  isEdit: boolean;
  errors: Record<string, string>;
}

export function EventDetails({ formData, onChange, isEdit, errors }: EventDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dash-navy font-sans">
          Event Name *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
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
            onChange={(e) => onChange({ ...formData, price: e.target.value })}
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

      <div className="space-y-2">
        <LockScreenUpload
          value={formData.lockScreenDesignUrl}
          onChange={(url) => onChange({ ...formData, lockScreenDesignUrl: url })}
          onError={(error) => onChange({ ...formData, lockScreenDesignUrl: null })}
          className="border-dash-gray/50"
          eventId={undefined}
          onFileChange={(file) => {
            onChange({ ...formData, pendingLockScreenFile: file });
          }}
        />
        {errors.lockScreenDesign && (
          <p className="text-destructive text-sm font-sans flex items-center gap-1">
            <span className="w-1 h-1 bg-destructive rounded-full"></span>
            {errors.lockScreenDesign}
          </p>
        )}
      </div>
    </div>
  );
}
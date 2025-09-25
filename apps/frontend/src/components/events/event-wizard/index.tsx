'use client';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';
import type { Event } from '@/lib/api/events';
import { ROUTES, navigation } from '@/lib/routes';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PreviewPanel } from './PreviewPanel';
import { EventDetails } from './steps/EventDetails';

interface EventWizardProps {
  event?: Event;
}

export interface FormData {
  id?: string;
  name: string;
  price: string;
  lockScreenDesignUrl: string | null;
  pendingLockScreenFile: File | null;
}

export function EventWizard({ event }: EventWizardProps) {
  const router = useRouter();
  const { createEvent, updateEvent, uploadLockScreen } = useEvents();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    id: event?.id,
    name: event?.name || '',
    price: event?.price?.toString() || '',
    lockScreenDesignUrl: event?.lockScreenDesignUrl || null,
    pendingLockScreenFile: null,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.price || parseFloat(formData.price) < 20) {
      newErrors.price = 'Price must be ₱20 or more';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      if (event) {
        // Update existing event
        await updateEvent({
          id: event.id,
          data: {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
          },
        });

        // Upload new lock screen if provided
        if (formData.pendingLockScreenFile) {
          setErrors({ submit: 'Uploading lock screen design...' });
          await uploadLockScreen({
            eventId: event.id,
            file: formData.pendingLockScreenFile,
            onProgress: (progress) => {
              setErrors({ submit: `Uploading lock screen design... ${Math.round(progress)}%` });
            },
          });
        }
      } else {
        // Create new event
        const createdEvent = await createEvent.mutateAsync({
          name: formData.name.trim(),
          price: parseFloat(formData.price),
        });

        // Upload lock screen if provided
        if (formData.pendingLockScreenFile && createdEvent) {
          setErrors({ submit: 'Uploading lock screen design...' });
          await uploadLockScreen({
            eventId: createdEvent.id,
            file: formData.pendingLockScreenFile,
            onProgress: (progress) => {
              setErrors({ submit: `Uploading lock screen design... ${Math.round(progress)}%` });
            },
          });
        }
      }

      router.push(ROUTES.ADMIN.EVENTS.LIST);
    } catch (error) {
      console.error('Failed to save event:', error);
      setErrors({
        submit: 'Failed to save event. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.ADMIN.EVENTS.LIST);
  };

  return (
    <div className="bg-gray-50">
      <div className="flex-1">
        <div className="mx-auto">
          <Breadcrumb items={[navigation.breadcrumbs.events, { label: event ? 'Edit Event' : 'Create Event' }]} />

          <div className="flex h-full gap-8">
            {/* Form Area */}
            <div className="flex-1">
              <EventDetails formData={formData} onChange={setFormData} isEdit={!!event} errors={errors} />

              {errors.submit && (
                <div className="mt-4">
                  {errors.submit.includes('Uploading') ? (
                    <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">{errors.submit.split('...')[0]}...</span>
                        </div>
                        {errors.submit.includes('%') && (
                          <span className="text-sm font-semibold text-blue-700">
                            {errors.submit.match(/\d+%/)?.[0]}
                          </span>
                        )}
                      </div>
                      {errors.submit.includes('%') && (
                        <div className="relative">
                          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                              style={{
                                width: `${errors.submit.match(/\d+/)?.[0] || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-blue-600">
                        <span>Processing your image...</span>
                        <span>{errors.submit.includes('100%') ? 'Almost done!' : 'Please wait'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-destructive text-sm font-sans flex items-center gap-1">
                      <span className="w-1 h-1 bg-destructive rounded-full"></span>
                      {errors.submit}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handleCancel} className="space-x-2" disabled={isLoading}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading} variant="gradient" size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {event ? 'Saving...' : 'Creating...'}
                    </>
                  ) : event ? (
                    'Save Changes'
                  ) : (
                    'Create Event'
                  )}
                </Button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="w-[500px] bg-white p-6 border-l border-gray-200">
              <div className="sticky top-6">
                <PreviewPanel
                  key={`${formData.pendingLockScreenFile?.name}-${formData.pendingLockScreenFile?.size}-${formData.pendingLockScreenFile?.lastModified}`}
                  pendingLockScreenFile={formData.pendingLockScreenFile}
                  lockScreenDesignUrl={formData.lockScreenDesignUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

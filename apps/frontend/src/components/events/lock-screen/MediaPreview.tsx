'use client';

import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import Cropper from 'react-easy-crop';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MediaPreviewProps {
  src: string;
  type: string;
  onRemove: () => void;
  onCrop?: (croppedFile: File) => void;
  onRecrop?: () => void;
  className?: string;
  isCropped?: boolean;
  isNewUpload?: boolean; // Indicates if this is a newly uploaded image
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MediaPreviewRef {
  triggerCrop: () => void;
}

const MediaPreviewComponent = forwardRef<MediaPreviewRef, MediaPreviewProps>((props, ref) => {
  const { src, type, onCrop, className, isCropped = false } = props;
  // Component for previewing and cropping media files
  const isImage = type.startsWith('image/');
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  const onCropComplete = useCallback((croppedArea: CropArea, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = useCallback(async () => {
    if (isCropped) return;
    if (!isImage || !onCrop || !croppedAreaPixels) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = src;
      });

      // Set canvas dimensions to match the cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Draw the cropped portion of the image
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert canvas to blob and create File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.png', { type: 'image/png' });
          onCrop(file);
        }
      }, 'image/png', 0.9);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [src, isImage, onCrop, croppedAreaPixels]);

  useImperativeHandle(ref, () => ({
    triggerCrop: handleApplyCrop
  }));

  return (
    <Card className={cn("relative group", className)}>
      <CardContent className="p-0">
        <AspectRatio ratio={16/9} className="bg-muted">
          {isImage ? (
            <div className="relative h-full">
              {isCropped ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-100 relative">
                  <img
                    src={src}
                    alt="Cropped preview"
                    className="h-full w-full object-cover rounded"
                  />
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Cropped
                  </div>
                </div>
              ) : (
                <Cropper
                  image={src}
                  crop={crop}
                  zoom={zoom}
                  aspect={16/9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>
          ) : (
            <video
              src={src}
              controls
              className="h-full w-full object-cover"
            />
          )}
        </AspectRatio>
      </CardContent>
    </Card>
  );
});

MediaPreviewComponent.displayName = 'MediaPreview';

export const MediaPreview = MediaPreviewComponent;

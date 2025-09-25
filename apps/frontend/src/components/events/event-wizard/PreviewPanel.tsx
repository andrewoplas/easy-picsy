/* eslint-disable @next/next/no-img-element */
'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

interface PreviewPanelProps {
  pendingLockScreenFile: File | null;
  lockScreenDesignUrl: string | null;
}

export function PreviewPanel({ pendingLockScreenFile, lockScreenDesignUrl }: PreviewPanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileKeyRef = useRef<string | null>(null);

  // Create a stable key for the file to detect changes
  const fileKey = pendingLockScreenFile 
    ? `${pendingLockScreenFile.name}-${pendingLockScreenFile.size}-${pendingLockScreenFile.lastModified}`
    : null;

  // Reset state when file changes (force reset)
  useEffect(() => {
    if (fileKey !== fileKeyRef.current) {
      // Clean up previous URL
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      
      // Reset state
      setPreviewUrl(null);
      previewUrlRef.current = null;
      
      // Update file key reference
      fileKeyRef.current = fileKey;
    }
  }, [fileKey, pendingLockScreenFile?.name]);

  // Create preview URL for new files
  useEffect(() => {
    const file = pendingLockScreenFile;
    
    if (file && !previewUrl) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      previewUrlRef.current = url;
    } else if (!file && previewUrl) {
      // Clean up URL when file is removed
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      previewUrlRef.current = null;
    }
  }, [pendingLockScreenFile, previewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Preview</h3>
      </div>

      {/* Surface Pro aspect ratio (3:2) container */}
      <div className="relative w-full bg-white rounded-lg shadow-sm overflow-hidden">
        <AspectRatio ratio={3 / 2} className="bg-gray-100">
          {(() => {
            if (pendingLockScreenFile && previewUrl) {
              const file = pendingLockScreenFile;
              const url = previewUrl;
              
              if (file.type.startsWith('video/')) {
                return <video src={url} controls className="w-full h-full object-contain" />;
              } else {
                return (
                  <div className="relative w-full h-full">
                    {/* Use regular img tag for blob URLs since Next.js Image doesn't handle them well */}
                    <img 
                      src={url} 
                      alt="Lock screen preview" 
                      className="w-full h-full object-contain"
                    />
                    {/* Show cropping indicator if this is a cropped image */}
                    {(file.name.includes('cropped') || file.name.startsWith('cropped-')) && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Cropped
                      </div>
                    )}
                  </div>
                );
              }
            }
            
            return null;
          })()}
          
          {!pendingLockScreenFile && lockScreenDesignUrl ? (
            lockScreenDesignUrl.match(/\.(mp4|webm)$/i) ? (
              <video src={lockScreenDesignUrl} controls className="w-full h-full object-contain" />
            ) : (
              <div className="relative w-full h-full">
                <Image 
                  src={lockScreenDesignUrl} 
                  alt="Lock screen preview" 
                  fill 
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            )
          ) : !pendingLockScreenFile && !lockScreenDesignUrl ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              No preview available
            </div>
          ) : null}
          
          {/* QR Code overlay - always visible */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <div className="w-[100px] h-[100px] bg-white rounded-lg shadow-lg border-2 border-gray-200 flex items-center justify-center p-2">
              <Image src="/qr-code.png" alt="QR Code" width={84} height={84} className="rounded" />
            </div>
          </div>
        </AspectRatio>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">Surface Pro (3:2)</div>
    </div>
  );
}

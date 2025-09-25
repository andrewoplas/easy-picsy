'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Crop, Trash2 } from 'lucide-react';
import { DropZone } from './DropZone';
import { MediaPreview } from './MediaPreview';
import { cn } from '@/lib/utils';

export interface LockScreenUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  onError?: (error: Error) => void;
  className?: string;
  eventId?: string; // Required for upload operations
  onFileChange?: (file: File | null) => void; // For create flow - store file instead of uploading
}

export interface UploadState {
  file: File | null;
  originalFile: File | null; // Keep track of original file for recropping
  preview: string | null;
  progress: number;
  error: string | null;
  isUploading: boolean;
  needsCrop: boolean; // Track if file needs to be cropped
  isCropped: boolean; // Track if file has been cropped
}

export function LockScreenUpload({
  value,
  onChange,
  onError,
  className,
  eventId,
  onFileChange
}: LockScreenUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    originalFile: null,
    preview: null,
    progress: 0,
    error: null,
    isUploading: false,
    needsCrop: false,
    isCropped: false
  });

  const mediaPreviewRef = useRef<{ triggerCrop: () => void }>(null);

  // Handle external value changes (e.g., when loading existing event)
  useEffect(() => {
    setUploadState(prev => ({
      ...prev,
      preview: value || null,
      file: null, // Reset file when value changes externally
      originalFile: null,
      needsCrop: false,
      isCropped: false
    }));
  }, [value]);

  const handleFileSelect = async (file: File) => {
    try {
      // Clean up old preview URL if it's a local URL
      if (uploadState.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(uploadState.preview);
      }

      // Create new preview
      const preview = URL.createObjectURL(file);
      
      setUploadState({
        file,
        originalFile: file, // Store original file for recropping
        preview,
        error: null,
        progress: 0,
        isUploading: false,
        needsCrop: true, // Mark that this file needs to be cropped
        isCropped: false
      });

      // Immediately pass the file to parent component for upload on Save Changes
      onFileChange?.(file);

    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process file',
        isUploading: false
      }));
      onError?.(error instanceof Error ? error : new Error('Failed to process file'));
    }
  };

  const handleCrop = async (croppedFile: File) => {
    try {
      // Clean up old preview URL if it's a local URL
      if (uploadState.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(uploadState.preview);
      }

      // Create new preview
      const preview = URL.createObjectURL(croppedFile);
      
      setUploadState({
        file: croppedFile,
        originalFile: uploadState.originalFile, // Keep original file
        preview,
        isUploading: false,
        progress: 0,
        error: null,
        needsCrop: false, // File has been cropped
        isCropped: true
      });
      
      // Create a completely new File object to ensure React detects the change
      const newFile = new File([croppedFile], croppedFile.name, {
        type: croppedFile.type,
        lastModified: Date.now() // Force a new timestamp
      });
      
      // Update the parent component with the new file object
      onFileChange?.(newFile);
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process cropped file',
        isUploading: false
      }));
      onError?.(error instanceof Error ? error : new Error('Failed to process cropped file'));
    }
  };

  const handleRecrop = () => {
    if (!uploadState.originalFile) return;

    // Clean up current preview URL if it's a local URL
    if (uploadState.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(uploadState.preview);
    }

    // Create new preview from original file
    const preview = URL.createObjectURL(uploadState.originalFile);

    setUploadState({
      file: uploadState.originalFile,
      originalFile: uploadState.originalFile,
      preview,
      error: null,
      progress: 0,
      isUploading: false,
      needsCrop: true,
      isCropped: false
    });

    // Update parent with original file
    onFileChange?.(uploadState.originalFile);
  };

  const handleRemove = () => {
    // Clean up local preview URL
    if (uploadState.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(uploadState.preview);
    }

    setUploadState({
      file: null,
      originalFile: null,
      preview: null,
      progress: 0,
      error: null,
      isUploading: false,
      needsCrop: false,
      isCropped: false
    });

    onFileChange?.(null);
    onChange(null);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Lock Screen Design</CardTitle>
          {uploadState.preview && (
            <div className="flex gap-2">
              {uploadState.file?.type?.startsWith('image/') && !uploadState.isCropped && uploadState.file && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => mediaPreviewRef.current?.triggerCrop()}
                  className="flex items-center gap-2"
                >
                  <Crop className="h-4 w-4" />
                  <span>Crop & Apply</span>
                </Button>
              )}
              {uploadState.file?.type?.startsWith('image/') && handleRecrop && uploadState.isCropped && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRecrop}
                  className="flex items-center gap-2"
                >
                  <Crop className="h-4 w-4" />
                  <span>Recrop</span>
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove</span>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadState.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadState.error}</AlertDescription>
          </Alert>
        )}

        {uploadState.needsCrop && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please click &quot;Crop & Apply&quot; to confirm your image selection</AlertDescription>
          </Alert>
        )}

        {uploadState.preview ? (
          <div className="space-y-4">
            <MediaPreview
              ref={mediaPreviewRef}
              key={`${uploadState.isCropped}-${uploadState.preview}`}
              src={uploadState.preview}
              onRemove={handleRemove}
              onCrop={handleCrop}
              onRecrop={handleRecrop}
              type={uploadState.file?.type || 'image/jpeg'}
              isCropped={uploadState.isCropped}
              isNewUpload={!!uploadState.file}
            />
            {uploadState.isUploading && (
              <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Uploading lock screen design
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">
                    {Math.round(uploadState.progress)}%
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={uploadState.progress} 
                    className="h-3 bg-blue-100"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                    style={{ 
                      width: `${uploadState.progress}%`,
                      transform: 'translateX(0)'
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-blue-600">
                  <span>Processing your image...</span>
                  <span>{uploadState.progress < 100 ? 'Please wait' : 'Almost done!'}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <DropZone
            onFileSelect={handleFileSelect}
            disabled={uploadState.isUploading}
          />
        )}

        {uploadState.isUploading && (
          <Button disabled className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading lock screen design...
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

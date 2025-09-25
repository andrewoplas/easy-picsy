'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export function DropZone({ onFileSelect, disabled, className }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    maxSize: MAX_FILE_SIZE,
    disabled,
    multiple: false,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          'rounded-lg border-2 border-dashed',
          'hover:border-primary/50 transition-colors',
          'flex flex-col items-center justify-center p-6',
          'bg-muted/5 cursor-pointer',
          {
            'border-primary': isDragActive,
            'border-muted': !isDragActive && fileRejections.length === 0,
            'border-destructive': fileRejections.length > 0,
            'opacity-50 cursor-not-allowed': disabled,
          },
          className,
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop the file here' : 'Drag & drop your lock screen design here'}
          </p>
          <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP, MP4, WebM (max 10MB)</p>
        </div>
      </div>
      {fileRejections.length > 0 && (
        <div className="text-sm text-destructive">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="space-y-1">
              <p className="font-medium">{file.name} ({formatFileSize(file.size)})</p>
              {errors.map(error => (
                <p key={error.code} className="text-xs">
                  {error.code === 'file-too-large' 
                    ? `File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`
                    : error.message}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

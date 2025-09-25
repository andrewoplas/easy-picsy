export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'] as const;
export type AllowedFileType = typeof ALLOWED_FILE_TYPES[number];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FILE_UPLOAD_ERRORS = {
  NO_FILE: 'No file was uploaded',
  INVALID_TYPE: 'Invalid file type. Allowed: JPG, PNG, WebP, MP4, WebM',
  FILE_TOO_LARGE: 'File size exceeds 10MB limit',
  UPLOAD_FAILED: 'Failed to upload file to storage',
  NOT_FOUND: 'No lock screen design found for this event',
} as const;

export function validateFile(file: Express.Multer.File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: FILE_UPLOAD_ERRORS.NO_FILE };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.mimetype as AllowedFileType)) {
    return { isValid: false, error: FILE_UPLOAD_ERRORS.INVALID_TYPE };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: FILE_UPLOAD_ERRORS.FILE_TOO_LARGE };
  }

  return { isValid: true };
}

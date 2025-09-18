/**
 * Represents the possible types of booth events in the system
 * @description These events track the lifecycle of a photo booth session
 */
export enum BoothEventType {
  SESSION_START = 'session_start',
  COUNTDOWN_START = 'countdown_start',
  COUNTDOWN = 'countdown',
  CAPTURE_START = 'capture_start',
  FILE_DOWNLOAD = 'file_download',
  PROCESSING_START = 'processing_start',
  SHARING_SCREEN = 'sharing_screen',
  PRINTING = 'printing',
  FILE_UPLOAD = 'file_upload',
  SESSION_END = 'session_end',
}

/**
 * Represents the possible status values for booth events
 * @description Used to track the success/failure state of booth operations
 */
export enum BoothStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

/**
 * Represents the data structure for booth events
 * @description Core event data sent from the booth client
 */
export interface BoothEventData {
  event_type: BoothEventType;
  param1?: string;
  param2?: string;
  param3?: string;
  param4?: string;
  timestamp: string; // Format: "16:20:7.287"
}

/**
 * Represents a booth log entry in the database
 * @description Complete log entry including all metadata
 */
export interface BoothLog {
  id: string;
  sessionId: string;
  boothEventType: BoothEventType;
  timestamp: string;
  param1?: string | null;
  param2?: string | null;
  param3?: string | null;
  param4?: string | null;
  eventId?: string | null;
  qrCodeId?: string | null;
  boothIdentifier?: string | null;
  status: BoothStatus;
  message?: string | null;
  errorDetails?: string | null;
  createdAt: string;
}

/**
 * Represents a simplified booth activity for the frontend
 * @description Used in activity timelines and logs
 */
export interface BoothActivity {
  id: string;
  sessionId: string;
  timestamp: string;
  type: BoothEventType;
  description: string;
  status: BoothStatus;
}

/**
 * Represents a grouped session with its events
 * @description Used for session-based views and analytics
 */
export interface GroupedSession {
  sessionId: string;
  startTime: string;
  endTime: string | null;
  boothMode: string | null;
  boothIdentifier: string | null;
  status: 'complete' | 'incomplete';
  eventCount: number;
  events: BoothLog[];
  qrCodeId: string | null;
  eventId: string | null;
}

import { Configuration, BoothLogsApi } from '@org/api-lib';
import axiosInstance from './client';
import { BoothActivity, BoothEventType, BoothLog } from '@org/commons';

const config = new Configuration();
const boothLoggingApiInstance = new BoothLogsApi(config, undefined, axiosInstance);

const getActivityDescription = (log: BoothLog): string => {
  switch (log.boothEventType) {
    case BoothEventType.SESSION_START:
      return `Booth session started with mode: ${log.param1 || 'Unknown'}`;
    case BoothEventType.COUNTDOWN_START:
      return `Countdown started: ${log.param1 || '0'} seconds`;
    case BoothEventType.COUNTDOWN:
      return `Countdown progress: ${log.param1 || '0'}% complete`;
    case BoothEventType.CAPTURE_START:
      return 'Camera capture initiated';
    case BoothEventType.FILE_DOWNLOAD:
      return `Photo downloaded from camera: ${log.param1 || 'Unknown file'}`;
    case BoothEventType.PROCESSING_START:
      return 'Photo processing started';
    case BoothEventType.SHARING_SCREEN:
      return 'Sharing screen displayed';
    case BoothEventType.PRINTING:
      return `Printing ${log.param2 || '1'} copies of ${log.param1 || 'file'} on ${log.param3 || 'printer'}`;
    case BoothEventType.FILE_UPLOAD:
      return `File uploaded: ${log.param1 || 'file'} to ${log.param2 || 'cloud'} as ${log.param3 || 'unknown type'}`;
    case BoothEventType.SESSION_END:
      return 'Booth session completed';
    default:
      return log.message || 'Booth activity';
  }
};

export const activityApi = {
  async getBoothLogs(eventId: string): Promise<BoothActivity[]> {
    const response = await boothLoggingApiInstance.boothLoggingControllerGetBoothEvents(eventId);
    const logs = response.data as BoothLog[];

    return logs.map(log => ({
      id: log.id,
      sessionId: log.sessionId,
      timestamp: log.timestamp,
      type: log.boothEventType,
      description: getActivityDescription(log),
      status: log.status,
    }));
  },
};
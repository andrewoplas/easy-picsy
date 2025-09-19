import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getHealth(): { 
    status: string; 
    timestamp: string; 
    uptime: number; 
    environment: string;
    version: string;
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.nodeEnv,
      version: '1.0.0',
    };
  }
}

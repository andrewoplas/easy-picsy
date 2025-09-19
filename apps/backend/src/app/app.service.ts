import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getHealth(): { 
    status: string; 
    timestamp: string; 
    uptime: number; 
    environment: string;
    version: string;
    database: {
      connected: boolean;
      status: string;
    };
  } {
    const dbConnected = this.databaseService.isConnected();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.nodeEnv,
      version: '1.0.0',
      database: {
        connected: dbConnected,
        status: dbConnected ? 'connected' : 'disconnected',
      },
    };
  }
}

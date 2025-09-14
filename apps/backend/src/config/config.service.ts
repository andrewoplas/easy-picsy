import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Database configuration
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') ?? '';
  }

  get databaseConfig() {
    return {
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      user: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
    };
  }

  // Supabase configuration
  get supabaseUrl(): string {
    return this.configService.get<string>('SUPABASE_URL') ?? '';
  }

  get supabaseAnonKey(): string {
    return this.configService.get<string>('SUPABASE_ANON_KEY') ?? '';
  }

  get supabaseServiceKey(): string {
    return this.configService.get<string>('SUPABASE_SERVICE_KEY') ?? '';
  }

  // JWT configuration
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') ?? '';
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION', '7d');
  }

  // Paymongo configuration (for future use)
  get paymongoSecretKey(): string | undefined {
    return this.configService.get<string>('PAYMONGO_SECRET_KEY') ?? '';
  }

  get paymongoPublicKey(): string | undefined {
    return this.configService.get<string>('PAYMONGO_PUBLIC_KEY') ?? '';
  }

  // CORS configuration
  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN', 'http://localhost:4200');
  }

  // API configuration
  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX', 'api');
  }

  get apiVersion(): string {
    return this.configService.get<string>('API_VERSION', 'v1');
  }

  get fullApiPrefix(): string {
    return `${this.apiPrefix}/${this.apiVersion}`;
  }
}
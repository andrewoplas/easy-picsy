import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);


  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    const startTime = Date.now();
    const { method, url, headers, body } = request;
    
    // Extract user ID if available (from authenticated request)
    const userId = (request as Request & { user?: { id: string } }).user?.id;
    
    // Get the controller and method name for endpoint pattern
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    const endpoint = `${controller}.${handler}`;

    // Log incoming request with details
    this.logger.log(`📥 ${method} ${url} - ${endpoint}${userId ? ` (User: ${userId})` : ''}`);
    this.logger.debug(`Request Headers: ${JSON.stringify(this.sanitizeHeaders(headers), null, 2)}`);
    if (body && Object.keys(body).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(this.sanitizeBody(body), null, 2)}`);
    }

    return next.handle().pipe(
      tap((responseData) => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;
        
        // Log successful response
        this.logger.log(`📤 ${method} ${url} - ${statusCode} (${responseTime}ms)`);
        this.logger.debug(`Response Body: ${JSON.stringify(this.sanitizeBody(responseData), null, 2)}`);
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = error.status || 500;
        
        // Log error response
        this.logger.error(`❌ ${method} ${url} - ${statusCode} (${responseTime}ms) - ${error.message}`);
        this.logger.error(`Error Stack: ${error.stack}`);
        this.logger.debug(`Request Headers: ${JSON.stringify(this.sanitizeHeaders(headers), null, 2)}`);
        if (body && Object.keys(body).length > 0) {
          this.logger.debug(`Request Body: ${JSON.stringify(this.sanitizeBody(body), null, 2)}`);
        }

        throw error;
      }),
    );
  }


  private sanitizeHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string | string[] | undefined> {
    const sanitized = { ...headers };
    
    // Remove sensitive headers
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-api-key',
      'x-auth-token',
      'x-access-token',
    ];
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body) return body;
    
    // Create a deep copy to avoid modifying original
    const sanitized = JSON.parse(JSON.stringify(body));
    
    // List of sensitive fields to redact
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'auth',
      'credential',
      'private',
      'ssn',
      'socialSecurityNumber',
      'creditCard',
      'cardNumber',
      'cvv',
      'pin',
    ];
    
    this.redactSensitiveFields(sanitized, sensitiveFields);
    
    return sanitized;
  }

  private redactSensitiveFields(obj: unknown, sensitiveFields: string[]): void {
    if (typeof obj !== 'object' || obj === null) return;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => this.redactSensitiveFields(item, sensitiveFields));
      return;
    }
    
    const objRecord = obj as Record<string, unknown>;
    Object.keys(objRecord).forEach(key => {
      const lowerKey = key.toLowerCase();
      
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        objRecord[key] = '[REDACTED]';
      } else if (typeof objRecord[key] === 'object') {
        this.redactSensitiveFields(objRecord[key], sensitiveFields);
      }
    });
  }
}

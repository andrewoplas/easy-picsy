/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ConfigService } from './config/config.service';
import fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.port;

  // Graceful shutdown handling
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  // Enable CORS
  app.enableCors({
    origin: configService.corsOrigin,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global API prefix
  const globalPrefix = configService.apiPrefix;
  app.setGlobalPrefix(globalPrefix);

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Easy Picsy - Photobooth Payment API')
    .setDescription(
      `
      A comprehensive API for managing photobooth events, QR code payments, and real-time communication.
      
      ## Features
      - 🎫 Event Management (CRUD operations)
      - 💳 PayMongo Payment Integration  
      - 🔄 Dynamic QR Code Generation (30-min expiry)
      - ⚡ Real-time WebSocket Updates
      - 🔐 Supabase Authentication
      - 📊 Payment Analytics
      
      ## Authentication
      Most endpoints require a Bearer token from Supabase authentication.
      Add your token to the "Authorize" button above to test endpoints.
      
      ## WebSocket Real-time Communication
      
      **Connection URL:** \`ws://localhost:${port}/events\`
      
      **Authentication:** Include JWT token in one of these ways:
      - \`auth.token\` in connection options
      - \`Authorization: Bearer <token>\` header
      - \`token\` query parameter
      
      **Available Events:**
      
      ### Client → Server
      - \`joinEvent\` - Join event room for updates
        \`\`\`json
        { "eventId": "uuid" }
        \`\`\`
      - \`leaveEvent\` - Leave event room
        \`\`\`json
        { "eventId": "uuid" }
        \`\`\`
      
      ### Server → Client
      - \`qrStatusUpdate\` - QR code status changed
      - \`paymentReceived\` - Payment completed
      - \`qrCodeGenerated\` - New QR code created
      - \`qrExpiryWarning\` - QR code expires soon
      - \`connectionStatus\` - Connection status updates
      
      **Room-based Broadcasting:** Events are sent only to clients in specific event rooms.
    `,
    )
    .setVersion('1.0')
    .setContact('Easy Picsy', 'https://github.com/your-org/easy-picsy', 'support@easypicsy.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your Supabase JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Events', 'Event management operations')
    .addTag('QR Codes', 'QR code generation and lifecycle management')
    .addTag('Payments', 'PayMongo payment integration')
    .addTag('Users', 'User profile management')
    .addTag('WebSocket', 'Real-time communication')
    .addServer(`http://localhost:${port}`, 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    customSiteTitle: 'Easy Picsy API Documentation',
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
  });

  // Create shared directory one level up from workspace root
  const sharedDir = path.join(process.cwd(), '../shared');
  if (!fs.existsSync(sharedDir)) {
    fs.mkdirSync(sharedDir, { recursive: true });
  }
  
  const outputPath = path.join(process.cwd(), '../shared/api-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  await app.listen(port);
  
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 API Documentation: http://localhost:${port}/${globalPrefix}/docs`);
  Logger.log(`📝 Environment: ${configService.nodeEnv}`);
  Logger.log(`📄 API Spec saved to: ${outputPath}`);
}

bootstrap();

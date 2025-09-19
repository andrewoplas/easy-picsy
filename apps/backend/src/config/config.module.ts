import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import * as Joi from 'joi';

const isOpenAPIGen = process.env.GENERATING_OPENAPI === 'true';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: isOpenAPIGen
        ? null
        : Joi.object({
            NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
            PORT: Joi.number().default(3000),

            // Database
            DATABASE_URL: Joi.string().allow('').optional(),
            DATABASE_HOST: Joi.string().allow('').optional(),
            DATABASE_PORT: Joi.number().optional(),
            DATABASE_USER: Joi.string().allow('').optional(),
            DATABASE_PASSWORD: Joi.string().allow('').optional(),
            DATABASE_NAME: Joi.string().allow('').optional(),

            // Supabase
            SUPABASE_URL: Joi.string().uri().allow('').optional(),
            SUPABASE_ANON_KEY: Joi.string().allow('').optional(),
            SUPABASE_SERVICE_KEY: Joi.string().allow('').optional(),

            // JWT
            JWT_SECRET: Joi.string().allow('').optional(),
            JWT_EXPIRATION: Joi.string().default('7d'),

            // Paymongo (optional for now)
            PAYMONGO_SECRET_KEY: Joi.string().allow('').optional(),
            PAYMONGO_PUBLIC_KEY: Joi.string().allow('').optional(),

            // CORS
            CORS_ORIGIN: Joi.string().default('http://localhost:4200'),

            // API
            API_PREFIX: Joi.string().default('api'),
            API_VERSION: Joi.string().default('v1'),
          }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

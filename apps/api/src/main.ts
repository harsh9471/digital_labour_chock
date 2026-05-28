import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3001);
  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  const nodeEnv = configService.get<string>('nodeEnv', 'development');

  // Parse allowed origins (split comma-separated string defensively)
  const rawOrigins = configService.get<string | string[]>('cors.origins', 'http://localhost:3000');
  const allowedOrigins: string[] = Array.isArray(rawOrigins)
    ? rawOrigins
    : String(rawOrigins).split(',').map((o) => o.trim()).filter(Boolean);

  // ============================================================
  // CORS — must come FIRST, before any other middleware
  // ============================================================
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-side)
      if (!origin) return callback(null, true);
      // In development allow any localhost origin regardless of port
      if (nodeEnv !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      logger.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Device-ID', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });

  // ============================================================
  // Security Middleware (after CORS)
  // ============================================================
  app.use(helmet({
    contentSecurityPolicy: nodeEnv === 'production',
    crossOriginEmbedderPolicy: nodeEnv === 'production',
  }));
  app.use(compression());

  // ============================================================
  // Global Prefix & Versioning
  // ============================================================
  app.setGlobalPrefix(apiPrefix);

  // ============================================================
  // Global Pipes
  // ============================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: nodeEnv === 'production',
    }),
  );

  // ============================================================
  // Swagger Documentation
  // ============================================================
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Digital Labour Chowk API')
      .setDescription(
        'Production-grade Labour Marketplace Platform API\n\n' +
        '## Authentication\n' +
        'Use Bearer token from login/OTP verify endpoints\n\n' +
        '## Default Credentials (Dev)\n' +
        '- Admin: superadmin@digitallabourchowk.com / Password@123\n' +
        '- Workers use OTP login via phone',
      )
      .setVersion('1.0.0')
      .setContact('Digital Labour Chowk', 'https://digitallabourchowk.com', 'support@digitallabourchowk.com')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'JWT',
      )
      .addTag('Authentication', 'Registration, Login, OTP, Token management')
      .addTag('Users', 'User management, Workers, Contractors')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
    logger.log(`Swagger docs: http://localhost:${port}/${apiPrefix}/docs`);
  }

  // ============================================================
  // Health Check Route
  // ============================================================
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get(`/${apiPrefix}/health`, (_req: unknown, res: { json: (data: unknown) => void }) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: nodeEnv,
      version: '1.0.0',
    });
  });

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 API Server running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', err);
  process.exit(1);
});

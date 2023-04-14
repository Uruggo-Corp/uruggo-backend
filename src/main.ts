import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ServiceAccount } from 'firebase-admin';
import { AppModule } from './app.module';

import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = await app.get<ConfigService>(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://uruggo.com',
      'https://www.uruggo.com',
    ],
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  // Setup Firebase Admin
  const adminConfig: ServiceAccount = {
    projectId: configService.getOrThrow<string>('FIREBASE_PROJECT_ID'),
    clientEmail: configService.getOrThrow<string>('FIREBASE_CLIENT_EMAIL'),
    privateKey: configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    storageBucket: configService.getOrThrow<string>('FIREBASE_STORAGE_BUCKET'),
  });

  // Enable swagger
  const options = new DocumentBuilder()
    .setTitle('Uruggo API')
    .setDescription('Uruggo API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // Start the server
  const PORT: number = configService.get<number>('PORT') || 8000;
  await app.listen(PORT, '0.0.0.0', () => {
    logger.log(`Server running on port ${PORT}`);
  });
}
bootstrap();

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = await app.get<ConfigService>(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
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

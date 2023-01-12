import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = await app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://uruggo.com',
      'https://www.uruggo.com',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const PORT: number = configService.get<number>('PORT') || 8000;
  await app.listen(PORT, '0.0.0.0', () => {
    logger.log(`Server running on port ${PORT}`);
  });
}
bootstrap();

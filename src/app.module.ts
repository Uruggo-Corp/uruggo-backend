import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { HelpersModule } from './shared/libs/helpers/helpers.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
        dbName: configService.getOrThrow<string>('MONGO_DB_NAME'),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8000),
        MONGO_URI: Joi.string().required(),
        MONGO_DB_NAME: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
      }),
    }),
    UsersModule,
    HelpersModule,
    AuthModule,
    ListingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

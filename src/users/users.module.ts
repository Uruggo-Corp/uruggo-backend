import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpersModule } from '../shared/libs/helpers/helpers.module';
import {
  AgentProfile,
  AgentProfileSchema,
  User,
  UserSchema,
} from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AgentProfile.name, schema: AgentProfileSchema },
    ]),
    HelpersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

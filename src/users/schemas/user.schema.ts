import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type AgentProfileDocument = HydratedDocument<AgentProfile>;

export enum Role {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}
export type IdType = 'passport' | 'drivers-license' | 'national-id';
export class IdImages {
  idFront: string;
  idBack: string;
}

export enum IdTypeEnum {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers-license',
  NATIONAL_ID = 'national-id',
}

@Schema({ timestamps: true })
export class AgentProfile {
  _id: string;

  // User
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  })
  userId: string;

  // Agent Profile
  @Prop({ required: true })
  agency: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, unique: true })
  idNumber: string;

  @Prop({
    type: String,
    required: true,
    enum: IdTypeEnum,
  })
  idType: IdTypeEnum;

  @Prop(
    raw({
      idFront: { type: String, required: true },
      idBack: { type: String, required: true },
    }),
  )
  idImages: IdType;

  @Prop({ default: false })
  idVerified: boolean;
}

@Schema({ timestamps: true })
export class User {
  _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: false })
  profilePicture: string;

  @Prop({
    type: String,
    required: true,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgentProfile',
  })
  agentProfile: AgentProfile;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: false, default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const AgentProfileSchema = SchemaFactory.createForClass(AgentProfile);

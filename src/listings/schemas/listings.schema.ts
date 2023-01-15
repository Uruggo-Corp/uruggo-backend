import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ListingDocument = HydratedDocument<Listing>;

export enum LeaseTerm {
  monthly = 'monthly',
  quarterly = 'quarterly',
  yearly = 'yearly',
}

export enum ListingStatus {
  pending = 'pending',
  active = 'active',
  expired = 'expired',
  rented = 'rented',
}

export class Location {
  @ApiProperty({
    description: 'The street address of the listing',
    example: '123 Main St',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  address: string;

  @ApiProperty({
    description: 'The city of the listing',
    example: 'Ikeja',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  city: string;

  @ApiProperty({
    description: 'The state of the listing',
    example: 'Lagos',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  state: string;

  @ApiProperty({
    description: 'The country of the listing',
    example: 'Nigeria',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  country: string;

  @ApiProperty({
    description: 'The zip code of the listing',
    example: '104101',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop({ required: false })
  zipCode: string;
}

@Schema({ timestamps: true })
export class Listing {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, type: Location })
  location: Location;

  @Prop({ required: true })
  bedrooms: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ required: true, type: String, enum: LeaseTerm })
  leaseTerm: LeaseTerm;

  @Prop({ required: true })
  availableFrom: Date;

  @Prop({ required: true, type: String, enum: ListingStatus })
  status: ListingStatus;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  agent: User;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);

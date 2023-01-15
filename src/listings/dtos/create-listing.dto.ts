import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LeaseTerm, Location } from '../schemas/listings.schema';

export class CreateListingDto {
  @ApiProperty({
    description: 'The title of the listing',
    example: '2 bedroom apartment',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'The description of the listing',
    example: 'A nice apartment with a nice view',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'The price of the listing',
    example: 1000,
    required: true,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The location of the listing',
    required: true,
    type: Location,
  })
  @IsNotEmpty({ message: 'Location is required' })
  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @ApiProperty({
    description: 'The number of bedrooms in the listing',
    example: 2,
    required: true,
  })
  @IsNotEmpty({ message: 'Bedrooms is required' })
  @IsNumber()
  bedrooms: number;

  @ApiProperty({
    description: 'The number of bathrooms in the listing',
    example: 2,
    required: true,
  })
  @IsNotEmpty({ message: 'Bathrooms is required' })
  @IsNumber()
  bathrooms: number;

  @ApiProperty({
    description: 'The lease term of the listing',
    example: LeaseTerm.monthly,
    required: true,
    enum: LeaseTerm,
  })
  @IsNotEmpty({ message: 'Lease term is required' })
  @IsEnum(LeaseTerm)
  leaseTerm: LeaseTerm;

  @ApiProperty({
    description: 'The date the listing is available from',
    example: new Date(),
    required: true,
  })
  @IsNotEmpty({ message: 'Available from is required' })
  @IsDateString()
  availableFrom: Date;
}

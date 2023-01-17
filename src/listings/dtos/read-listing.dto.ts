import { ApiProperty } from '@nestjs/swagger';
import { ReadUserWithAgentProfileDto } from '../../users/dtos/read-user.dto';
import { LeaseTerm, Location } from '../schemas/listings.schema';

export class ReadListingDto {
  @ApiProperty({
    description: 'The generated id of the listing',
    example: '5f9f1b9b9c9d4b2b8c8b9c9d',
    required: true,
  })
  _id: string;

  @ApiProperty({
    description: 'The version of the listing',
    example: 0,
    required: true,
  })
  __v: number;

  @ApiProperty({
    description: 'The title of the listing',
    example: '2 bedroom apartment',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'The slug of the listing',
    example: '2-bedroom-apartment',
    required: true,
  })
  slug: string;

  @ApiProperty({
    description: 'The description of the listing',
    example: 'A nice apartment with a nice view',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'The price of the listing',
    example: 1000,
    required: true,
  })
  price: number;

  @ApiProperty({
    description: 'The location of the listing',
    required: true,
    type: Location,
  })
  location: Location;

  @ApiProperty({
    description: 'The number of bedrooms in the listing',
    example: 2,
    required: true,
  })
  bedrooms: number;

  @ApiProperty({
    description: 'The number of bathrooms in the listing',
    example: 2,
    required: true,
  })
  bathrooms: number;

  @ApiProperty({
    description: 'The lease term of the listing',
    example: LeaseTerm.monthly,
    required: true,
    enum: LeaseTerm,
  })
  leaseTerm: LeaseTerm;

  @ApiProperty({
    description: 'The date the listing is available from',
    example: new Date(),
    required: true,
  })
  availableFrom: Date;

  @ApiProperty({
    description: 'The date the listing was created',
    example: '2020-10-30T20:00:00.000Z',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the listing was last updated',
    example: '2020-10-30T20:00:00.000Z',
    required: true,
  })
  updatedAt: Date;
}

export class ReadListingWithAgentDto extends ReadListingDto {
  @ApiProperty({
    description: 'The agent that created the listing',
    required: true,
    type: ReadUserWithAgentProfileDto,
  })
  agent: ReadUserWithAgentProfileDto;
}

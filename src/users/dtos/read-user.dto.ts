import { ApiProperty } from '@nestjs/swagger';
import { IdImages, IdTypeEnum } from '../schemas/user.schema';

export class ReadAgentProfileDto {
  @ApiProperty({
    description: "The agent's agency",
    example: 'Agency',
    required: true,
  })
  agency: string;

  @ApiProperty({
    description: "The agent's address",
    example: 'Address',
    required: true,
  })
  address: string;

  @ApiProperty({
    description: "The agent's ID number",
    example: 'ID Number',
    required: true,
  })
  idNumber: string;

  @ApiProperty({
    description: "The agent's ID type",
    example: IdTypeEnum.PASSPORT,
    required: true,
    enum: IdTypeEnum,
  })
  idType: string;

  @ApiProperty({
    description: "The agent's ID images",
    example: { idFront: 'ID Front', idBack: 'ID Back' },
    required: true,
    type: IdImages,
  })
  idImages: IdImages;

  @ApiProperty({
    description: 'Is the agent id verified?',
    example: true,
    required: true,
  })
  idVerified: boolean;

  @ApiProperty({
    description: 'The date the agent was created',
    example: '2020-10-10T10:10:10.000Z',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the agent was last updated',
    example: '2020-10-10T10:10:10.000Z',
    required: true,
  })
  updatedAt: Date;
}

export class ReadUserDto {
  @ApiProperty({
    description: "The user's generated ID",
    example: '5f7f9c9c9c9c9c9c9c9c9c9c',
    required: true,
  })
  _id: string;

  @ApiProperty({
    name: '__v',
    description: "The user's version number",
    example: 0,
    required: true,
  })
  __v: number;

  @ApiProperty({
    description: "The user's first name",
    example: 'John',
    required: true,
  })
  firstName: string;

  @ApiProperty({
    description: "The user's last name",
    example: 'Doe',
    required: true,
  })
  lastName: string;

  @ApiProperty({
    description: "The user's email",
    example: 'johndoe@company.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: "The user's phone number",
    example: '+2347000000000',
    required: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: "The user's profile picture",
    example: 'https://picsum.photos/200',
    required: true,
  })
  profilePicture: string;

  @ApiProperty({
    description: "The user's role",
    example: 'admin',
    required: true,
  })
  role: string;

  @ApiProperty({
    description: 'Is the user active?',
    example: true,
    required: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Is the user email verified?',
    example: true,
    required: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'The date the user was created',
    example: '2020-10-10T10:10:10.000Z',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the user was last updated',
    example: '2020-10-10T10:10:10.000Z',
    required: true,
  })
  updatedAt: Date;
}

export class ReadUserWithAgentProfileDto extends ReadUserDto {
  @ApiProperty({
    description: "The user's agent profile",

    required: true,
    type: ReadAgentProfileDto,
  })
  agentProfile: ReadAgentProfileDto;
}

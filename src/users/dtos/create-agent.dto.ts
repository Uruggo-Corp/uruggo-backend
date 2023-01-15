import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IdImages, IdTypeEnum } from '../schemas/user.schema';
import { CreateUserDto } from './create-user.dto';

export class CreateAgentDto extends CreateUserDto {
  @ApiProperty({
    description: "The agent's agency",
    example: 'Agency',
    required: true,
  })
  @IsNotEmpty({ message: 'Agency is required' })
  @IsString()
  agency: string;

  @ApiProperty({
    description: "The agent's address",
    example: 'Address',
    required: true,
  })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  address: string;

  @ApiProperty({
    description: "The agent's ID number",
    example: 'ID Number',
    required: true,
  })
  @IsNotEmpty({ message: 'ID Number is required' })
  @IsString()
  idNumber: string;

  @ApiProperty({
    description: "The agent's ID type",
    example: IdTypeEnum.PASSPORT,
    required: true,
    enum: IdTypeEnum,
  })
  @IsNotEmpty({ message: 'ID Type is required' })
  @IsEnum(IdTypeEnum)
  idType: IdTypeEnum;

  @ApiProperty({
    description: "The agent's ID images",
    example: { idFront: 'ID Front', idBack: 'ID Back' },
    required: true,
    type: IdImages,
  })
  @IsNotEmpty({ message: 'ID Images are required' })
  idImages: IdImages;
}

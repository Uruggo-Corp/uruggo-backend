import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "The user's first name",
    example: 'John',
    required: true,
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: "The user's last name",
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "The user's email address",
    example: 'johndoe@company.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The user's phone number",
    example: '+2348170933598',
    required: true,
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: "The user's profile picture",
    example: 'https://example.com/profile-picture.jpg',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_trailing_dot: false,
    allow_underscores: true,
    require_host: true,
  })
  profilePicture: string;

  @ApiProperty({
    description: "The user's password",
    example: 'password',
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, and 1 number',
    },
  )
  password: string;
}

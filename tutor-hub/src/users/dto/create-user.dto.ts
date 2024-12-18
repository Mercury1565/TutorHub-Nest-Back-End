import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the student' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the student' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Username of the student' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ description: 'Email address of the student' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the student', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  password: string;

  @ApiProperty({ description: 'Image URL of the student', required: false })
  @IsOptional()
  imageUrl: string;
}

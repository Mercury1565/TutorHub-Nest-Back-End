import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
} from 'class-validator';

export class LogInDto {
  @ApiProperty({ description: 'Email of the student', example: 'hermon@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the student', example: 'herget123', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  password: string;
}

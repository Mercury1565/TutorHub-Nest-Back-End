import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginTutorDto {
  @ApiProperty({ description: 'Email of the tutor' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the tutor' })
  @IsString()
  password: string;
}

export class LoginTutorGoogleDto {
  @ApiProperty({ description: 'Email of the tutor' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Google ID of the tutor' })
  @IsString()
  googleId: string;
}

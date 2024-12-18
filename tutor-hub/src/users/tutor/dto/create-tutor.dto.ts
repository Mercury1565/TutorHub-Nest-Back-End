import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutorDto {
  @ApiProperty({ description: 'First name of the tutor' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the tutor' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Username of the tutor' })
  @IsString()
  userName: string;

  @ApiProperty({ description: 'Email address of the tutor' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the tutor' })
  @IsString()
  password: string;
}

export class createTutorGoogleDto {
  @ApiProperty({ description: 'Google ID of the tutor' })
  @IsString()
  googleId: string;

  @ApiProperty({ description: 'First name of the tutor' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the tutor' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Username of the tutor' })
  @IsString()
  userName: string;

  @ApiProperty({ description: 'Email address of the tutor' })
  @IsEmail()
  email: string;
}

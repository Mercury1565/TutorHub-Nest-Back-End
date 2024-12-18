import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { SocialMedia } from 'src/schemas/socialMedial.schema';

export class UpdateStudentDto {
  @ApiProperty({ description: 'First name of the student', required: false })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ description: 'Last name of the student', required: false })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ description: 'Age of the student', required: false })
  @IsNumber()
  @IsOptional()
  age: number;
}

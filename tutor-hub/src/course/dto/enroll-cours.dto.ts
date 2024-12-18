import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class EnrollCourseDto {
  @IsOptional()
  @IsString()
  googleUrl: string;

  @IsNotEmpty()
  @IsString()
  studentId: string;
}

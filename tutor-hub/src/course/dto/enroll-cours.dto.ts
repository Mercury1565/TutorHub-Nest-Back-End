import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollCourseDto {
  @ApiProperty({ description: 'The ID of the student' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'The ID of the course' })
  @IsNotEmpty()
  @IsString()
  courseId: string;
}

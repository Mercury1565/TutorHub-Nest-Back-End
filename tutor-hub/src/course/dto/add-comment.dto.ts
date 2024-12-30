import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddReviewDto {
  @ApiProperty({ description: 'ID of the student' })
  @IsNotEmpty()
  @IsString()
  studentId?: string;

  @ApiProperty({ description: 'ID of the course' })
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'Text of the Review' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ description: 'Rating of the course', minimum: 0, maximum: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}

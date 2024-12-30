import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateAssessmentDto {
  @ApiProperty({
    description: 'The type of the assessment (e.g., quiz, assignment)',
    example: 'assignment',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'The URL of the assessment resource',
    example: 'https://example.com/assessments/quiz1',
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'The ID of the tutor who created the assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  tutorId: string;

  @ApiProperty({
    description: 'The ID of the course to which the assessment belongs',
    example: '987e6543-e21c-12a3-b456-426614174999',
  })
  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @ApiProperty({
    description: 'The title of the assessment',
    example: 'Algebra Quiz 1',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The due date of the assessment',
    example: '2023-12-31T23:59:59Z',
  })
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;
}

export class ExamResultDto {
  @IsString()
  studentId: string;

  @IsString()
  examId: string;

  @IsString()
  examTitle: string;

  @IsString()
  course: string;

  @IsNumber()
  score: number;

  @IsNumber()
  total: number;
}

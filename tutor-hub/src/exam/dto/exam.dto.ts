import { IsNumber, IsString } from 'class-validator';

export class ExamDto {
  @IsString()
  link: string;

  @IsString()
  examTitle: string;

  @IsString()
  examDate: Date;

  @IsString()
  courseId: string;

  @IsString()
  students: string[];
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

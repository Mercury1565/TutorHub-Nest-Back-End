import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  tutorId: string;

  @IsNotEmpty()
  @IsNumber()
  grade?: number;

  @IsOptional()
  @IsNumber()
  durationPerDay?: number;

  @IsNotEmpty()
  @IsBoolean()
  evaluation: boolean;

  @IsNotEmpty()
  @IsNumber()
  seatsRemaining: number;

  @IsOptional()
  resource?: {
    video?: string[];
    book?: string[];
  };
}

import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterCourseDto {
  @ApiPropertyOptional({ description: 'ID of the tutor' })
  @IsOptional()
  @IsString()
  tutorId?: string;

  @ApiPropertyOptional({ description: 'Title of the course' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Subject of the course' })
  @IsOptional()
  @IsString()
  subject: string;

  @ApiPropertyOptional({ description: 'Grade level of the course' })
  @IsOptional()
  @IsNumber()
  grade?: number;

  @ApiPropertyOptional({ description: 'Whether the course includes evaluation' })
  @IsOptional()
  @IsBoolean()
  evaluation?: boolean;

  @ApiPropertyOptional({ description: 'Duration per day of the course in hours' })
  @IsOptional()
  @IsNumber()
  durationPerDay?: number;

  @ApiPropertyOptional({ description: 'Rate of the course' })
  @IsOptional()
  @IsNumber()
  rate?: number;
}

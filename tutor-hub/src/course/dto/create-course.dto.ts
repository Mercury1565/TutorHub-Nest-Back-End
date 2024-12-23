import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { PaymentMethod } from 'src/schemas/payment_method.schema';

export class CreateCourseDto {
  @ApiProperty({ description: 'Title of the course' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description of the course' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID of the tutor' })
  @IsNotEmpty()
  @IsString()
  tutorId: string;

  // @ApiProperty({ description: 'Name of the tutor' })
  // @IsNotEmpty()
  // @IsString()
  // tutorName: string;

  @ApiPropertyOptional({ description: 'Grade level of the course' })
  @IsNotEmpty()
  @IsNumber()
  grade?: number;

  @ApiProperty({ description: 'Fee for the course' })
  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @ApiProperty({ description: 'Subject of the course' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiPropertyOptional({ description: 'Duration per day in hours' })
  @IsOptional()
  @IsNumber()
  durationPerDay?: number;

  @ApiProperty({ description: 'Number of seats remaining' })
  @IsNotEmpty()
  @IsNumber()
  seatsRemaining: number;

  @ApiPropertyOptional({ description: 'Image URL of the course' })
  @IsOptional()
  @IsString()
  image: string;

  @ApiPropertyOptional({ description: 'payment' })
  @IsOptional()
  paymentMethods: PaymentMethod[];
}

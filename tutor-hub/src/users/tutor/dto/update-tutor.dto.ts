import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SocialMedia } from 'src/schemas/socialMedial.schema';
import { Review } from 'src/schemas/Review.schema';

export class UpdateTutorDto {
  @ApiProperty({ description: 'Phone number of the tutor', required: false })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ description: 'Short description of the tutor', required: false })
  @IsString()
  @IsOptional()
  shortDescription: string;

  @ApiProperty({ description: 'Social media links of the tutor', required: false, type: () => SocialMedia })
  @ValidateNested()
  @Type(() => SocialMedia)
  @IsOptional()
  socialMedia: SocialMedia;

  @ApiProperty({ description: 'Bio of the tutor', required: false })
  @IsString()
  @IsOptional()
  bio: string;

  @ApiProperty({ description: 'Skills of the tutor', required: false, type: [String] })
  @IsString()
  @IsOptional()
  skills: string[];

  @ApiProperty({ description: 'Feedback for the tutor', required: false, type: [Review] })
  @IsOptional()
  feedback: Review[];
}

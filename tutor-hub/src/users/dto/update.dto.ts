import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SocialMedia } from 'src/schemas/socialMedial.schema';
// import { SocialMedia } from 'src/schemas/socialMedial.schema';

export class UpdateUserDto {
  @ApiProperty({ description: 'First name of the student', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'Last name of the student', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'Phone number of the student', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Image URL of the student', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Short description of the student', required: false })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ description: 'Skills of the student', required: false, type: [String] })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ description: 'Social media links of the student', required: false, type: [String] })
  @IsOptional()
  socialMedia?: SocialMedia;
}

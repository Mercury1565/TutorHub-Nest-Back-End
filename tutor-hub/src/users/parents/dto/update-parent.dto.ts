import { IsString, IsOptional, IsNumber } from 'class-validator';
import { SocialMedia } from 'src/schemas/socialMedial.schema';

export class UpdateParentDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}

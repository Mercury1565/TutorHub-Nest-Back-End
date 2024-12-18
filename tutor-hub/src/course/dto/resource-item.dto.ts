import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResourceItemDto {
  @ApiProperty({ description: 'The title of the resource item' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The URL of the resource item' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: 'The type of the resource item' })
  @IsNotEmpty()
  @IsString()
  type: string;
}

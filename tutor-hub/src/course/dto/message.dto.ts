import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
    @ApiProperty({ description: 'The content of the message' })
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiProperty({ description: 'The ID of the course' })
    @IsNotEmpty()
    @IsString()
    courseId: string;

    @ApiProperty({ description: 'The ID of the sender' })
    @IsNotEmpty()
    @IsString()
    senderId: string;
}

export class ReplyDto {
    @ApiProperty({ description: 'The content of the reply' })
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiProperty({ description: 'The ID of the sender' })
    @IsNotEmpty()
    @IsString()
    senderId: string;

    @ApiProperty({ description: 'The ID of the parent message' })
    @IsNotEmpty()
    @IsString()
    parentId: string;
}

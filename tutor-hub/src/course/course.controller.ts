import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { Course } from 'src/schemas/course.schema';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ResourceItemDto } from './dto/resource-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curret.user.decorator';
import { EnrollCourseDto } from './dto/enroll-cours.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import path from 'path';
import { AddReviewDto } from './dto/add-comment.dto';
import { MessageDto, ReplyDto } from './dto/message.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    createCourseDto.tutorId = userId;
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    const tutorId = userId
    return this.courseService.findAll(tutorId);
  }

  @Get('filter')
  async filterCourses(
    @Query() filterCourseDto: FilterCourseDto,
  ): Promise<Course[]> {
    return this.courseService.filterCourses(filterCourseDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Get('/students/:id')
  getStudents(@Param('id') id: string) {
    return this.courseService.getStudents(id);
  }

  @Get(':id/resources')
  getResources(@Param('id') id: string) {
    return this.courseService.getResources(id);
  }

  @Post(':id/resources')
  addResource(
    @Param('id') id: string,
    @Body() resourceItemDto: ResourceItemDto,
  ) {
    return this.courseService.addResource(id, resourceItemDto);
  }

  @Post('/handle_payment')
  @UseInterceptors(FileInterceptor('receiptFile'))
  handlePayment(@CurrentUser('userId') userId: string, @Body() enrollCourseDto: EnrollCourseDto, @UploadedFile() receiptFile: Express.Multer.File) {
    enrollCourseDto.studentId = userId
    return this.courseService.handlePayment(enrollCourseDto, receiptFile);
  }

  @Get('/pending_enrollment_request/:courseId')
  async getPendingRequests(@Param('courseId') courseId: string) {
    return await this.courseService.getPendingRequests(courseId);
  }

  @Get('get_receipt/:courseId/:studentId')
  async getFile(@Param('courseId') courseId: string, @Param('studentId') studentId: string, @Res() res: Response) {
    const filePath = await this.courseService.getReceiptFilePath(courseId, studentId);
    res.sendFile(filePath);
  };

  @Post('/approve_enrollment_request/:courseId/:studentId')
  async approveEnrollmentRequest(@Param('courseId') courseId: string, @Param('studentId') studentId: string) {
    return await this.courseService.approveEnrollmentRequest(courseId, studentId);
  }

  @Post('/reject_enrollment_request/:courseId/:studentId')
  async rejectEnrollmentRequest(@Param('courseId') courseId: string, @Param('studentId') studentId: string) {
    return await this.courseService.rejectEnrollmentRequest(courseId, studentId);
  }

  @Post('/add_Review')
  async addReview(@CurrentUser('userId') userId: string, @Body() addReviewDto: AddReviewDto) {
    addReviewDto.studentId = userId;
    return this.courseService.addReview(addReviewDto);
  }

  @Get('/get_Review/:courseId')
  async getReview(@Param('courseId') courseId: string) {
    return this.courseService.getReviews(courseId);
  }

  @Post('/send_message')
  async sendMessage(@CurrentUser('userId') userId: string, @Body() messageDto: MessageDto) {
    messageDto.senderId = userId;
    return this.courseService.sendMessage(messageDto);
  }

  @Post('/send_reply')
  async sendReply(@CurrentUser('userId') userId: string, @Body() replyDto: ReplyDto) {
    replyDto.senderId = userId;
    return this.courseService.sendReply(replyDto);
  }

  @Get('/get_messages/:courseId')
  async getMessages(@Param('courseId') courseId: string) {
    return this.courseService.getMessages(courseId);
  }

  @Get('/get_student_messages/:courseId')
  async getStudentMessages(@CurrentUser('userId') userId: string, @Param('courseId') courseId: string) {
    return this.courseService.getStudentMessages(courseId, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}

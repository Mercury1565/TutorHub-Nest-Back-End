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

  // @Delete(':id/dropout/:studentId')
  // async dropOut(
  //   @Param('id') id: string,
  //   @Param('studentId') studentId: string,
  // ): Promise<Course> {
  //   return this.courseService.dropOut(id, studentId);
  // }

  // @Post(':courseId/comment')
  // @UseGuards(JwtAuthGuard)
  // async addComment(
  //   @Request() req,
  //   @Param('courseId') courseId: string,
  //   @Body()
  //   addCommentDto: AddCommentDto,
  // ) {
  //   addCommentDto.studentId = req.user.sub;
  //   return this.courseService.addComment(courseId, addCommentDto);
  // }

  // @Get(':courseId/comments')
  // async getComments(@Param('courseId') courseId: string) {
  //   return this.courseService.getComments(courseId);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}

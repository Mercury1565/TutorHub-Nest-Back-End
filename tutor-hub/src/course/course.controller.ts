import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { EnrollCourseDto } from './dto/enroll-cours.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { Course } from 'src/schemas/course.schema';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ResourceItemDto } from './dto/resource-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curret.user.decorator';

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
  @Post(':id/resources')
  addResource(
    @Param('id') id: string,
    @Body() resourceItemDto: ResourceItemDto,
  ) {
    return this.courseService.addResource(id, resourceItemDto);
  }

  @Post(':id/enroll')
  enroll(@Param('id') id: string, @Body() enrollCourseDto: EnrollCourseDto) {
    return this.courseService.enroll(id, enrollCourseDto);
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

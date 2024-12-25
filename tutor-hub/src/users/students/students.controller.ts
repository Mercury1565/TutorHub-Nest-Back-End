import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curret.user.decorator';

@ApiBearerAuth()
@Controller('student')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  // @Get()
  // findAll() {
  //   return this.studentsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.studentsService.findOne(id);
  // }

  // @Patch('/update-profile')
  // update(@Request() req, @Body() updateStudentDto: UpdateStudentDto) {
  //   const id = req.user.sub;
  //   return this.studentsService.update(id, updateStudentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.studentsService.remove(id);
  // }
  
  @Get('course')
  async getEnrolledCourses(@CurrentUser('userId') userId: string) {
    return await this.studentsService.getEnrolledCourses(userId);
  }
}

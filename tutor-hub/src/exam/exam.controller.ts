import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateAssessmentDto, ExamResultDto } from './dto/exam.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curret.user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assessment')
export class ExamController {
  constructor(private examService: ExamService) {}

  // Create an exam
  @Post()
  async createExam(@CurrentUser('userId') userId: string , @Body() createAssessmentDto: CreateAssessmentDto) {
    createAssessmentDto.tutorId = userId;
    return this.examService.create(createAssessmentDto);
  }

  // admit students to an exam
  // @Patch('/admit/:examId')
  // @UseGuards(JwtAuthGuard)
  // async admitStudents(@Request() req, @Param('examId') examId, @Body() body) {
  //   return this.examService.addStudentsToExam(
  //     req.user.sub,
  //     examId,
  //     body.students,
  //   );
  // }

  @Get('/:course_id')
  async getExams(@Param('course_id') courseId: string) {
    const exams = await this.examService.getExams(courseId);
    const assignments = await this.examService.getAssignments(courseId);
    const classes = await this.examService.getClasses(courseId);

    return { "exams": exams, "assignments": assignments, "classes": classes}
  }

  @Get('/all/:course_id')
  async getAll(@Param('course_id') courseId: string) {
    return await this.examService.getAllAssessmentsSortedByTime(courseId)
  }



  // get all exams of a student
  // @Get('/student')
  // @UseGuards(JwtAuthGuard)
  // async getStudentExams(@Request() req) {
  //   return this.examService.getStudentExams(req.user.sub);
  // }

  @Post('/result')
  async addResult(@Request() req, @Body() ExamResult: ExamResultDto) {
    return this.examService.addResult(req.user.sub, ExamResult);
  }

  @Get('/students/result')
  async getStudentResults(@Request() req) {
    return this.examService.getStudentResults(req.user.sub);
  }
}

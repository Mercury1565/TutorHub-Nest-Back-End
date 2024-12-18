import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamDto, ExamResultDto } from './dto/exam.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('exam')
export class ExamController {
  constructor(private examService: ExamService) {}

  // Create an exam
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createExam(@Request() req, @Body() examDto: ExamDto) {
    return this.examService.create(req.user.sub, examDto);
  }

  // admit students to an exam
  @Patch('/admit/:examId')
  @UseGuards(JwtAuthGuard)
  async admitStudents(@Request() req, @Param('examId') examId, @Body() body) {
    return this.examService.addStudentsToExam(
      req.user.sub,
      examId,
      body.students,
    );
  }

  // get all exams of a tutor
  @Get()
  @UseGuards(JwtAuthGuard)
  async getExams(@Request() req) {
    return this.examService.getExams(req.user.sub);
  }

  // get all exams of a student
  @Get('/student')
  @UseGuards(JwtAuthGuard)
  async getStudentExams(@Request() req) {
    return this.examService.getStudentExams(req.user.sub);
  }

  @Post('/result')
  @UseGuards(JwtAuthGuard)
  async addResult(@Request() req, @Body() ExamResult: ExamResultDto) {
    return this.examService.addResult(req.user.sub, ExamResult);
  }

  @Get('/students/result')
  @UseGuards(JwtAuthGuard)
  async getStudentResults(@Request() req) {
    return this.examService.getStudentResults(req.user.sub);
  }
}

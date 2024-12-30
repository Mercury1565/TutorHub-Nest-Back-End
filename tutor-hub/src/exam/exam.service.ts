import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import { ExamResult } from 'src/schemas/examResut.schema';
import { User } from 'src/schemas/user.schema';
import { Assessment } from 'src/schemas/assessment.schema';
import { CreateAssessmentDto, ExamResultDto } from './dto/exam.dto';
import { Course } from 'src/schemas/course.schema';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ExamResult)
    private readonly examResultRepository: Repository<ExamResult>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto) {
    const { courseId, ...assessmentData } = createAssessmentDto;

    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const newAssessment = this.assessmentRepository.create({
      ...assessmentData,
      course,
    });

    return this.assessmentRepository.save(newAssessment);
  }

  async getExams(courseId: string) {
    return await this.assessmentRepository.find({
      where: { 
      type: 'exam',
      course: { id: courseId },
      },
    });
  };

  async getAssignments(courseId: string) {
    return await this.assessmentRepository.find({
      where: { 
      type: 'assignment',
      course: { id: courseId },
      },
    });
  }

  async getClasses(courseId: string) {
    return await this.assessmentRepository.find({
      where: { 
      type: 'class',
      course: { id: courseId },
      },
    });
  };

  async getAllAssessmentsSortedByTime(course_id: string) {
    return await this.assessmentRepository.find({
      where: {
        course: { id: course_id },
      },
      order: {
        dueDate: 'ASC',
      },
    });
  }

  // async getStudentExams(studentId: string) {
  //   return await this.assessmentRepository.find({ where: { students: studentId } });
  // }

  async addResult(tutorId: string, examResultDto: ExamResultDto) {
    const tutorFound = await this.userRepo.findOneBy({ id: tutorId });
    if (!tutorFound) {
      throw new Error('User not found');
    }

    const examFound = await this.assessmentRepository.findOneBy({
      id: examResultDto.examId,
    });
    if (!examFound) {
      throw new Error('Assessment not found');
    }

    const examResult = this.examResultRepository.create({
      studentId: examResultDto.studentId,
      examId: examResultDto.examId,
      course: examResultDto.course,
      score: examResultDto.score,
    });
    return await this.examResultRepository.save(examResult);
  }

  async getStudentResults(studentId: string) {
    return await this.examResultRepository.find({ where: { studentId } });
  }
}

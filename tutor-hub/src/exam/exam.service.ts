import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import { ExamDto, ExamResultDto } from './dto/exam.dto';
import { Exam } from 'src/schemas/exam.schema';
import { ExamResult } from 'src/schemas/examResut.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ExamService {
  private calendar;
  constructor(
    @InjectRepository(Exam) 
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(User) 
    private readonly userRepo: Repository<User>,
    @InjectRepository(ExamResult) 
    private readonly examResultRepository: Repository<ExamResult>,
  ) {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'src/service.json',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async addEvent(
    email: string,
    examDate: Date,
    examLink: string,
  ): Promise<void> {
    const event = {
      summary: 'Exam',
      description: `Your exam is scheduled. Please complete it using this link: ${examLink}`,
      start: {
        dateTime: examDate,
        timeZone: 'Africa/Addis_Ababa',
      },
      end: {
        dateTime: examDate, // Set appropriate end time
        timeZone: 'Africa/Addis_Ababa',
      },
      attendees: [{ email }],
    };

    await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
  }

  async create(tutorId: string, examDto: ExamDto) {
    const tutorFound = await this.userRepo.findOneBy({id: tutorId});
    if (!tutorFound) {
      throw new Error('User not found');
    }

    const exam = this.examRepository.create(examDto);
    exam.tutorId = tutorId;

    return await this.examRepository.save(exam);
  }

  async addStudentsToExam(tutorId: string, examId: string, students: string[]) {
    const tutorFound = await this.userRepo.findOneBy({id: tutorId});
    if (!tutorFound) {
      throw new Error('User not found');
    }

    const examFound = await this.examRepository.findOneBy({id: examId});
    if (!examFound) {
      throw new Error('Exam not found');
    }

    if (!Array.isArray(students)) {
      throw new TypeError('students must be an array');
    }

    examFound.students = [...examFound.students, ...students];
    return await this.examRepository.save(examFound);
  }

  async getExams(tutorId: string) {
    const tutorFound = await this.userRepo.findOneBy({id: tutorId});
    if (!tutorFound) {
      throw new Error('User not found');
    }

    return await this.examRepository.find({ where: { tutorId } });
  }

  async getStudentExams(studentId: string) {
    return await this.examRepository.find({ where: { students: studentId } });
  }

  async addResult(tutorId: string, examResultDto: ExamResultDto) {
    const tutorFound = await this.userRepo.findOneBy({id: tutorId});
    if (!tutorFound) {
      throw new Error('User not found');
    }

    const examFound = await this.examRepository.findOneBy({id: examResultDto.examId});
    if (!examFound) {
      throw new Error('Exam not found');
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

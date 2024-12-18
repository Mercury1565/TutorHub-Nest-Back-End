import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { ExamResult } from 'src/schemas/examResut.schema';
import { User } from 'src/schemas/user.schema';
import { Assessment } from 'src/schemas/assessment.schema';
import { Course } from 'src/schemas/course.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, User, Course, ExamResult])],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}

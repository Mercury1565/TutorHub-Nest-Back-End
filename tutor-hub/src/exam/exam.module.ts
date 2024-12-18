import { Module } from '@nestjs/common';
import { Exam } from 'src/schemas/exam.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { ExamResult } from 'src/schemas/examResut.schema';
import { User } from 'src/schemas/user.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, User, ExamResult]),],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
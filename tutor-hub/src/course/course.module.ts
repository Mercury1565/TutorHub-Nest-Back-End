// course.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from 'src/schemas/course.schema';
import { User } from 'src/schemas/user.schema';
import { PendingEnrollment } from 'src/schemas/pendingEnrollment.schema';
import { Review } from 'src/schemas/Review.schema';
import { Message } from 'src/schemas/message.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User, PendingEnrollment, Review, Message])],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
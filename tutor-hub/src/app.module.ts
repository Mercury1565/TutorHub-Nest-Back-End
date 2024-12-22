import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExamModule } from './exam/exam.module';
import { CourseModule } from './course/course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './schemas/course.schema';
import { ExamResult } from './schemas/examResut.schema';
import { Feedback } from './schemas/feedback.schema';
import { Message } from './schemas/message.schema';
import { Parent } from './schemas/parent.schema';
import { SocialMedia } from './schemas/socialMedial.schema';
import { StudentsModule } from './users/students/students.module';
import { Comment } from './schemas/comment.schema';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { User } from './schemas/user.schema';
import { TutorModule } from './users/tutor/tutor.module';
import { Assessment } from './schemas/assessment.schema';
import { PendingEnrollment } from './schemas/pendingEnrollment.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: true,
        entities: [
          Course,
          Assessment,
          ExamResult,
          Feedback,
          Message,
          Parent,
          SocialMedia,
          Comment,
          User,
          PendingEnrollment
        ],
      }),
    }),
    AuthModule,
    ExamModule,
    CourseModule,
    UserModule,
    StudentsModule,
    TutorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

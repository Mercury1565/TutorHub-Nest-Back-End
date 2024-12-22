import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { ResourceItemDto } from './dto/resource-item.dto';
import { Course } from 'src/schemas/course.schema';
import { Comment } from 'src/schemas/comment.schema';
import { User } from 'src/schemas/user.schema';
import { EnrollCourseDto } from './dto/enroll-cours.dto';
import { PendingEnrollment } from 'src/schemas/pendingEnrollment.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    // @InjectRepository(Comment)
    // private readonly commentRep: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PendingEnrollment)
    private readonly pendingEnrollmentRepo: Repository<PendingEnrollment>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const {
      title,
      description,
      tutorId,
      grade,
      fee,
      subject,
      durationPerDay,
      seatsRemaining,
      image,
    } = createCourseDto;
    const tutor = await this.userRepo.findOneBy({ id: tutorId });
    if (!tutor) {
      throw new Error('Tutor not found');
    }

    const existingCourse = await this.courseRepo.findOne({
      where: { tutorId, title },
    });
    if (existingCourse) {
      throw new Error('Course already exists');
    }

    const { firstName } = await this.userRepo.findOneBy({
      id: tutorId,
    });

    const createdCourse = this.courseRepo.create({
      title,
      description,
      tutorId,
      tutorName: firstName,
      grade,
      fee,
      subject,
      durationPerDay,
      seatsRemaining,
      image,
    });

    return await this.courseRepo.save(createdCourse);
  }

  async findAll(tutorId: string) {
    const courses = await this.courseRepo.findBy({ tutorId });
    if (!courses) {
      throw new Error('No courses found');
    }
    return courses;
  }

  async filterCourses(filterCourseDto: FilterCourseDto) {
    const { grade, durationPerDay, rate, title } =
      filterCourseDto;

    const queryBuilder = this.courseRepo.createQueryBuilder('course');

    if (title) {
      queryBuilder.andWhere('course.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    if (grade) {
      queryBuilder.andWhere('course.grade = :grade', { grade: +grade });
    }

    if (durationPerDay !== undefined) {
      queryBuilder.andWhere('course.durationPerDay <= :durationPerDay', {
        durationPerDay,
      });
    }

    if (rate !== undefined) {
      queryBuilder.andWhere('course.rate = :rate', { rate });
    }

    queryBuilder.orderBy('course.rate', 'DESC');
    return await queryBuilder.getMany();
  }

  async findOne(id: string) {
    const foundCourse = await this.courseRepo.findOneBy({ id });
    if (!foundCourse) {
      throw new Error('Course not found');
    }
    return foundCourse;
  }

  async addResource(id: string, resourceItemDto: ResourceItemDto) {
    const foundCourse = await this.courseRepo.findOneBy({ id });
    if (!foundCourse) {
      throw new Error('Course not found');
    }
    const { type, title, url } = resourceItemDto;
    if (!type || !title || !url) {
      throw new Error('Invalid resource item');
    }
    const resource = { title, url };

    if (type === 'video') {
      foundCourse.resources.video.push(resource);
    } else if (type === 'book') {
      foundCourse.resources.book.push(resource);
    } else if (type === 'sample_exam') {
      foundCourse.resources.sampleExam.push(resource);
    } else {
      throw new Error('Invalid resource type');
    }
    return await this.courseRepo.save(foundCourse);
  }

  async getResources(id: string) {
    const foundCourse = await this.courseRepo.findOneBy({ id });
    if (!foundCourse) {
      throw new Error('Course not found');
    }
    return foundCourse.resources;
  }

  async handlePayment(enrollCourseDto: EnrollCourseDto, receiptFile: Express.Multer.File) {  
    const foundCourse = await this.courseRepo.findOneBy({ id: enrollCourseDto.courseId });
    if (!foundCourse) {
      throw new Error('Course not found');
    }
    if (foundCourse.seatsRemaining === 0) {
      throw new Error('No seats available');
    }
  
    const student = await this.userRepo.findOne({
      where: { id: enrollCourseDto.studentId },
    });
  
    if (!student) {
      throw new Error('Student not found');
    }

    const requestFound = await this.pendingEnrollmentRepo.findOne(
      {
        where: {
          studentId: enrollCourseDto.studentId,
          courseId: enrollCourseDto.courseId,
        }
      }
    );

    if (requestFound) {
      throw new BadRequestException('Enrollment request already made for this course');
    };
  
    // Ensure the uploads directory exists
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'receipts');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  
    // Define the path to save the file
    const receiptFileName = `${enrollCourseDto.studentId}_${enrollCourseDto.courseId}_${Date.now()}_${receiptFile.originalname}`;
    const receiptFilePath = path.join(uploadsDir, receiptFileName);
  
    // Write the file to the specified location
    fs.writeFileSync(receiptFilePath, receiptFile.buffer);
  
    // Create a pending enrollment entry
    const pendingEnrollment = this.pendingEnrollmentRepo.create({
      studentId: student.id,
      courseId: foundCourse.id,
      receiptFile: receiptFilePath,
    });
  
    await this.pendingEnrollmentRepo.save(pendingEnrollment);
  
    return pendingEnrollment;
  }

  // async addComment(courseId: string, addCommentDto: AddCommentDto) {
  //   const { studentId, text, rating } = addCommentDto;
  //   const course = await this.courseRepo.findOneBy({ id: courseId });
  //   if (!course) {
  //     throw new Error('Course not found');
  //   }
  //   const student = await this.userRepo.findOneBy({ id: studentId });
  //   if (!student) {
  //     throw new Error('User not found');
  //   }
  //   const studentName = student.firstName + ' ' + student.lastName;
  //   course.comments = course.comments.filter(
  //     (comment) => comment.studentId !== studentId,
  //   );
  //   const comment = this.commentRep.create({
  //     studentId,
  //     studentName,
  //     text,
  //     rating,
  //   });
  //   course.comments.push(comment);

  //   await this.courseRepo.save(course);

  //   return comment;
  // }

  // async getComments(courseId: string) {
  //   const course = await this.courseRepo.findOne(
  //   {
  //     where: {
  //       id: courseId
  //     },
  //     relations: ['comments'],
  //   });
  //   if (!course) {
  //     throw new Error('Course not found');
  //   }

  //   return course.comments;
  // }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}

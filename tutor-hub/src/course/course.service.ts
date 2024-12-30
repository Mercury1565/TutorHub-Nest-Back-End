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
import { ResourceItemDto } from './dto/resource-item.dto';
import { Course } from 'src/schemas/course.schema';
import { User } from 'src/schemas/user.schema';
import { EnrollCourseDto } from './dto/enroll-cours.dto';
import { PendingEnrollment } from 'src/schemas/pendingEnrollment.schema';
import * as fs from 'fs';
import * as path from 'path';
import { AddReviewDto } from './dto/add-comment.dto';
import { Review } from 'src/schemas/Review.schema';
import { Message } from 'src/schemas/message.schema';
import { MessageDto, ReplyDto } from './dto/message.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

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
      paymentMethods
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
      paymentMethods
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
    const { grade, durationPerDay, rate, title } = filterCourseDto;

    const queryBuilder = this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.paymentMethods', 'paymentMethods');

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

  async getStudents(id: string) {
    const foundCourse = await this.courseRepo.findOne({
      where: {
        id
      },
      relations: ['students']
    });
    if (!foundCourse) {
      throw new Error('Course not found');
    }
    return foundCourse.students;
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
    const foundCourse = await this.courseRepo.findOne({
      where: {
        id: enrollCourseDto.courseId
      },
      relations: ['students']
      });

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

    if (foundCourse.students.some(student => student.id === enrollCourseDto.studentId)) {
      throw new Error('Student is already enrolled in this course');
    };

    const requestFound = await this.pendingEnrollmentRepo.findOne(
      {
        where: {
          user: {
            id: enrollCourseDto.studentId
          },
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
      user: {
        id: student.id
      },
      courseId: foundCourse.id,
      receiptFile: receiptFilePath,
    });
  
    await this.pendingEnrollmentRepo.save(pendingEnrollment);
  
    return pendingEnrollment;
  }

  async getPendingRequests(courseId: string) {
    const pendingRequests = await this.pendingEnrollmentRepo.find({
      where: { courseId },
      relations: {
        user: true
      }
    });

    if (!pendingRequests.length) {
      throw new NotFoundException('No pending requests found for this course');
    }

    return pendingRequests;
  }

  async getReceiptFilePath(courseId: string, studentId: string) {
    const pendingEnrollment = await this.pendingEnrollmentRepo.findOne({
      where: {
        user: {
          id: studentId
        },
        courseId,
      }
    })

    if (!pendingEnrollment) {
      throw new NotFoundException('pending request not found')
    }

    return pendingEnrollment.receiptFile;
  };

  async approveEnrollmentRequest(courseId: string, studentId: string) {
    const course = await this.courseRepo.findOne({
      where: {
        id: courseId
      },
      relations: ['students']
      });
    const student = await this.userRepo.findOneBy({ id: studentId });

    if (!course) {
      throw new Error('Course not found');
    }

    if (!student) {
      throw new Error('Student not found');
    }

    course.students.push(student);
    await this.courseRepo.save(course);

    await this.pendingEnrollmentRepo.delete({
      user: {
      id: studentId,
      },
      courseId,
    });

    return course;
  }

  async rejectEnrollmentRequest(courseId: string, studentId: string) {
  
  }

  async addReview(review: AddReviewDto) {
    const { courseId, studentId, text, rating } = review;

    const course = await this.courseRepo.findOne({
      where: {
        id: courseId
      },
      relations: ['reviews']
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const student = await this.userRepo.findOneBy({ id: studentId });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const alreadyReviewed = await this.reviewRepo.existsBy({student: {
      id: studentId
    }});
    
    if (alreadyReviewed) {
      throw new BadRequestException('Student has already reviewed this course');
    }

    course.rate = parseFloat(((course.rate * course.reviews.length + rating) / (course.reviews.length + 1)).toFixed(1));

    const newReview = this.reviewRepo.create({
      text,
      rating,
      student,
      course,
    });

    course.reviews.push(newReview);
    await this.courseRepo.save(course);

    return newReview;
  };

  async getReviews(courseId: string) {
    const reviews = await this.reviewRepo.find({
      where: {
        course: {
          id: courseId
        }
      },
      relations: ['student']
    })

    return reviews;
  };

  async sendMessage(messageDto: MessageDto) {
    const { courseId, senderId, message } = messageDto;

    const course = await this.courseRepo.findOne({
      where: {
        id: courseId
      }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const sender = await this.userRepo.findOneBy({ id: senderId });
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const receiver = await this.userRepo.findOneBy({ id: course.tutorId });

    const newMessage = this.messageRepo.create({
      message,
      course,
      sender,
      receiver,
    });

    return await this.messageRepo.save(newMessage);
  };

  async sendReply(replyDto: ReplyDto) {
    const { parentId, senderId, message } = replyDto;

    const parentMessage = await this.messageRepo.findOne({
      where: {
        id: parentId
      },
      relations: ['sender']
    });

    if (!parentMessage) {
      throw new NotFoundException('Parent message not found');
    }

    const sender = await this.userRepo.findOneBy({ id: senderId });
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const receiver = await this.userRepo.findOneBy({ id: parentMessage.sender.id });

    const newMessage = this.messageRepo.create({
      message,
      parentMessage,
      sender,
      receiver,
    });

    return await this.messageRepo.save(newMessage);
  }

  async getStudentMessages(courseId: string, studentId: string) {
    const course = await this.courseRepo.findOne({
      where: {
        id: courseId
      }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const messages = await this.messageRepo.find({
      where: {
        course: {
          id: courseId
        },
        sender: {
          id: studentId
        }
      },
      relations: ['sender', 'receiver', 'replies']
    });

    return messages;
  }

  async getMessages(courseId: string) {
    const course = await this.courseRepo.findOne({
      where: {
        id: courseId
      }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const messages = await this.messageRepo.find({
      where: {
        course: {
          id: courseId
        }
      },
      relations: ['sender', 'receiver', 'replies']
    });

    return messages;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}

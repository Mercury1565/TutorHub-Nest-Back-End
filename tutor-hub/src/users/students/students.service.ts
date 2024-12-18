import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateStudentDto } from './dto/update-student.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    const studentFound = await this.userRepo.findOne({ where: { email } });

    if (!studentFound) {
      throw new NotFoundException('User not found');
    }

    return studentFound;
  }

  // async logInWithGoogle(tutor: LoginTutorGoogleDto) {
  //   const tutorFound = await this.findByEmail(tutor.email);
  //   const logTutor = new AuthDto(
  //     tutorFound.id.toString(),
  //     tutorFound.userName,
  //     tutorFound.email,
  //   );

  //   return await this.authService.generateToken(logTutor);
  // }

  async findAll() {
    const studentsFound = await this.userRepo.find();
    if (!studentsFound.length) {
      throw new NotFoundException('No students found');
    }
    return studentsFound;
  }

  async findOne(id: string) {
    const studentFound = await this.userRepo.findOneBy({ id });

    if (!studentFound) {
      throw new NotFoundException('User not found');
    }

    return studentFound;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const studentFound = await this.findOne(id);
    if (!studentFound) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.update(id, updateStudentDto);
    return this.findOne(id);
  }

  async ensureUniqueUsername(username: string): Promise<string> {
    let uniqueUsername = username;
    let count = 0;

    while (
      await this.userRepo.findOne({ where: { userName: uniqueUsername } })
    ) {
      count++;
      uniqueUsername = `${username}${count}`;
    }

    return uniqueUsername;
  }

  async remove(id: string) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return `This action removes a #${id} student`;
  }
}

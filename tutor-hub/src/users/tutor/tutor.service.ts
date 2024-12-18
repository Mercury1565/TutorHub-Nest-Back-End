import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    const tutorFound = await this.userRepo.findOne({
      where: { email: email },
    });

    if (!tutorFound) {
      throw new NotFoundException('User not found');
    }

    return tutorFound;
  }

  async findAll() {
    const tutorsFound = await this.userRepo.find();
    if (!tutorsFound) {
      throw new NotFoundException('No tutors found');
    }
    return tutorsFound;
  }

  async findOne(id: string) {
    const tutorFound = await this.userRepo.findOne({
      where: { id: id },
    });

    if (!tutorFound) {
      throw new NotFoundException('User not found');
    }

    return tutorFound;
  }

  async AddImagePath(id: string, filename: string) {
    if (!id) {
      return 'No tutor Id provided';
    }

    const tutor = await this.findOne(id);
    tutor.imageUrl = `src/images/tutorProfiles/${filename}`;

    return await this.userRepo.save(tutor);
  }

  async update(id: string, updateTutorDto: UpdateTutorDto) {
    const tutorFound = await this.findOne(id);
    if (!tutorFound) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.update(id, updateTutorDto);
    return await this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} tutor`;
  }

  async ensureUniqueUsername(username: string): Promise<string> {
    let uniqueUsername = username;
    let count = 0;

    while (await this.userRepo.findOne({ where: { userName: uniqueUsername } })) {
      count++;
      uniqueUsername = `${username}${count}`;
    }

    return uniqueUsername;
  }

  // async addFeedback(studentId: string, tutorId: string, feedback: Feedback) {
  //   const tutorFound = await this.findOne(tutorId);
  //   if (!tutorFound) {
  //     throw new NotFoundException('User not found');
  //   }

  //   tutorFound.feedback = [...tutorFound.feedback, feedback];
  //   return await this.userRepo.save(tutorFound);
  // }
}
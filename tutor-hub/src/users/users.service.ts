import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginTutorGoogleDto } from './tutor/dto/login-tutor.dto';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dtos/auth.dto';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.dto';
import { SocialMedia } from 'src/schemas/socialMedial.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private authService: AuthService,
  ) {}

  async createUser(createStudentDto: CreateUserDto) {
    const { firstName, lastName, email, userName, password, imageUrl } =
      createStudentDto;
    const hashedPassword = await this.authService.hashPassword(password);
    const createdUser = this.userRepo.create({
      firstName,
      lastName,
      userName,
      password: hashedPassword,
      email,
      imageUrl,
    });
    return await this.userRepo.save(createdUser);
  }

  async logIn(logInStudentDto: LogInDto) {
    const { email, password } = logInStudentDto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    const match = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!match) {
      throw new BadRequestException('Incorrect password');
    }

    const token = this.authService.generateToken(
      new AuthDto(user.id.toString(), user.userName, user.email),
    );
    return token;
  }

  async findByEmail(email: string) {
    const userFound = await this.userRepo.findOne({ where: { email } });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    return userFound;
  }

  async logInWithGoogle(tutor: LoginTutorGoogleDto) {
    const userFound = await this.findByEmail(tutor.email);
    const logTutor = new AuthDto(
      userFound.id.toString(),
      userFound.userName,
      userFound.email,
    );

    return await this.authService.generateToken(logTutor);
  }

  async findAll() {
    const usersFound = await this.userRepo.find();
    if (!usersFound.length) {
      throw new NotFoundException('No students found');
    }
    return usersFound;
  }

  async findOne(id: string) {
    const userFound = await this.userRepo.findOneBy({ id });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    return userFound;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    const userFound = await this.findOne(id);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.update({id}, updateUserDto);
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
    return `This action removes a #${id} user`;
  }
}

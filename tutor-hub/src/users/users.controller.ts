import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly studentsService: UserService) {}

  @Post('/create-Account')
  createStudent(@Body() createStudentDto: CreateUserDto) {
    return this.studentsService.createUser(createStudentDto);
  }

  @Post('login')
  logIn(@Body() logInStudentDto: LogInDto) {
    return this.studentsService.logIn(logInStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Body() updateStudentDto: UpdateUserDto) {
    const id = req.user.sub;
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}

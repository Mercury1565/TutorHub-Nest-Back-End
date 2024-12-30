import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Put,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/curret.user.decorator';
import { UpdateUserDto } from './dto/update.dto';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-Account')
  createStudent(@Body() createStudentDto: CreateUserDto) {
    return this.userService.createUser(createStudentDto);
  }

  @Post('login')
  logIn(@Body() logInStudentDto: LogInDto) {
    return this.userService.logIn(logInStudentDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  findOne(@CurrentUser('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Put('/update-profile')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(id);
  // }
}

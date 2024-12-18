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
import { TutorService } from './tutor.service';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tutor')
@UseGuards(JwtAuthGuard)
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Get()
  findAll() {
    return this.tutorService.findAll();
  }

  @Get()
  findOne(@Request() req) {
    const id = req.user.sub;
    return this.tutorService.findOne(id);
  }

  @Get('/:id')
  findWithId(@Param('id') id: string) {
    return this.tutorService.findOne(id);
  }

  @Patch('/update-profile')
  update(@Request() req, @Body() updateTutorDto: UpdateTutorDto) {
    const id = req.user.sub;
    return this.tutorService.update(id, updateTutorDto);
  }

  @Patch('/update-bio')
  updateBio(@Request() req, @Body() bio: UpdateTutorDto) {
    const id = req.user.sub;
    return this.tutorService.update(id, bio);
  }

  @Patch('/update-skills') 
  updateSkills(@Request() req, @Body() skills: UpdateTutorDto) {
    const id = req.user.sub;
    return this.tutorService.update(id, skills);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorService.remove(+id);
  }

  // @Patch('/feedback/:tutorId')
  // @UseGuards(AuthGuard)
  // async addFeedback(
  //   @Request() req,
  //   @Param('tutorId') tutorId: string,
  //   @Body() feedback: Feedback,
  // ) {
  //   return this.tutorService.addFeedback(req.user.sub, tutorId, feedback);
  // }

  // @Post('/message/send')
  // @UseGuards(StudentJwtAuthGuard)
  // async sendMessage(@Request() req, @Body() message: SendMessageDto) {
  //   const sender = req.user.sub;
  //   const messageDto = { sender, ...message };

  //   return this.messageService.create(messageDto);
  // }
}

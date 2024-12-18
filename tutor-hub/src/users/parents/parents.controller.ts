// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Request,
//   UseInterceptors,
//   UseGuards,
//   UploadedFile,
// } from '@nestjs/common';
// import { ParentsService } from './parents.service';
// import { CreateParentDto } from './dto/create-parent.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { UpdateParentDto } from './dto/update-parent.dto';
// import { LogInParentDto } from './dto/login-parent.dto';
// import { v4 as uuidv4 } from 'uuid';
// import { ParentJwtAuthGuard } from 'src/auth/parent-auth/guards/jwt-parentAuth.guard';
// import { diskStorage } from 'multer';

// @Controller('parents')
// export class ParentsController {
//   constructor(private readonly parentsService: ParentsService) {}

//   @Post('/create-Account')
//   createParent(@Body() createParentDto: CreateParentDto) {
//     return this.parentsService.createParent(createParentDto);
//   }
//   @Post('login')
//   logIn(@Body() logInParentDto: LogInParentDto) {
//     return this.parentsService.logIn(logInParentDto);
//   }
//   @Post('/image')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: 'src/images/parentProfiles',
//         filename: (req, file, callback) => {
//           // Generate a unique filename
//           const fileExtension = file.originalname.split('.').pop();
//           const filename = `${uuidv4()}.${fileExtension}`;
//           callback(null, filename);
//           return filename;
//         },
//       }),
//     }),
//   )
//   @UseGuards(ParentJwtAuthGuard)
//   async uploadImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
//     return this.parentsService.AddImagePath(req.user.sub, file.filename);
//   }
//   @Get()
//   findAll() {
//     return this.parentsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.parentsService.findOne(id);
//   }
//   @Patch('/update-profile')
//   @UseGuards(ParentJwtAuthGuard)
//   update(@Request() req, @Body() updateParentDto: UpdateParentDto) {
//     const id = req.user.sub;
//     return this.parentsService.update(id, updateParentDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.parentsService.remove(+id);
//   }
// }

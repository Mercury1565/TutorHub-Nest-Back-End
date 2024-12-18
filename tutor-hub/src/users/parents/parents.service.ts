// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { CreateParentDto } from './dto/create-parent.dto';
// import { UpdateParentDto } from './dto/update-parent.dto';
// import { Parent } from 'src/schemas/parent.schema';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { ParentAuthService } from 'src/auth/parent-auth/parent-auth.service';
// import { LogInParentDto } from './dto/login-parent.dto';
// import { ParentAuth } from 'src/auth/parent-auth/dtos/parentAuth.dto';

// @Injectable()
// export class ParentsService {
//   constructor(
//     @InjectModel(Parent.name) private ParentModel: Model<Parent>,
//     private authService: ParentAuthService,
//   ) {}

//   async createParent(createParentDto: CreateParentDto) {
//     const { firstName, lastName, email, userName, password } = createParentDto;
//     const hashedPassword = await this.authService.hashPassword(password);
//     const createdParent = new this.ParentModel({
//       firstName,
//       lastName,
//       email,
//       userName,
//       password: hashedPassword,
//     });
//     return createdParent.save();
//   }
//   async logIn(logInParentDto: LogInParentDto) {
//     const { email, password } = logInParentDto;
//     const Parent = await this.ParentModel.findOne({
//       email,
//     });
//     if (!Parent) {
//       throw new BadRequestException('user not found');
//     }
//     const match = await this.authService.comparePassword(
//       password,
//       Parent.password,
//     );
//     if (!match) {
//       throw new BadRequestException('Incorrect password');
//     }

//     const token = this.authService.generateToken(
//       new ParentAuth(Parent._id.toString(), Parent.userName, Parent.email),
//     );
//     return token;
//   }

//   async findAll() {
//     const parentsFound = await this.ParentModel.find();
//     if (!parentsFound) {
//       throw new NotFoundException('No tutors found');
//     }
//     return parentsFound;
//   }
//   async findOne(id: string) {
//     const parentFound = await this.ParentModel.findOne({
//       $or: [{ _id: id }],
//     });

//     if (!parentFound) {
//       throw new NotFoundException('Tutor not found');
//     }

//     return parentFound;
//   }

//   async AddImagePath(id: string, filename: string) {
//     if (!id) {
//       return 'No image Id provided';
//     }

//     const parent = await this.ParentModel.findOne({ _id: id });
//     parent.imageUrl = `src/images/tutorProfiles/${filename}`;

//     return await parent.save();
//   }
//   async update(id: string, updateParentDto: UpdateParentDto) {
//     const parentFound = await this.findOne(id);
//     if (!parentFound) {
//       throw new NotFoundException('Tutor not found');
//     }

//     return await this.ParentModel.findByIdAndUpdate(id, updateParentDto, {
//       new: true,
//     });
//   }

//   remove(id: number) {
//     return `This action removes a #${id} parent`;
//   }
// }

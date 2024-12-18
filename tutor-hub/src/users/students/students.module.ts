import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { User } from 'src/schemas/user.schema';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/schemas/user.schema';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TutorController],
  providers: [TutorService],
})
export class TutorModule {}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.schema';
import { Course } from './course.schema';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @ManyToOne(() => User, (user) => user.Reviews)
  student: User;

  @ManyToOne(() => Course, (course) => course.reviews)
  course: Course;
}
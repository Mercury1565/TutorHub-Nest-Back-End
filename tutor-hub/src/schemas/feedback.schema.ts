import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { SocialMedia } from './socialMedial.schema';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column()
  studentName: string;

  @Column()
  rating: number;

  @Column()
  comment: string;

  // @ManyToOne(() => Tutor, tutor => tutor.feedback)
  // tutor: Tutor;
}
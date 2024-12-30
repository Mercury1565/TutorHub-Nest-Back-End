import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from './user.schema';
import { Assessment } from './assessment.schema';
import { PaymentMethod } from './payment_method.schema';
import { Review } from './Review.schema';
import { Message } from './message.schema';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: false })
  tutorId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  tutorName: string;

  @ManyToMany(() => User, (user) => user.courses)
  students: User[];

  @Column({ type: 'int', nullable: false })
  grade: number;

  @Column({ type: 'decimal', nullable: false })
  fee: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  subject: string;

  @Column({ type: 'int', nullable: false })
  durationPerDay: number;

  @Column({ type: 'int', nullable: false })
  seatsRemaining: number;

  @Column({ type: 'decimal', nullable: true, default: 0 })
  rate: number;

  @Column({ type: 'varchar', nullable: true, default: '' })
  image: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: { video: [], book: [], sampleExam: [] },
  })
  resources: {
    video?: { title: string; url: string }[];
    book?: { title: string; url: string }[];
    sampleExam?: { title: string; url: string }[];
  };

  @OneToMany(() => Assessment, (assessment) => assessment.course, {
    cascade: true,
  })
  assessments: Assessment[];

  @OneToMany(() => PaymentMethod, (payment) => payment.course, {
    cascade: true,
  })
  paymentMethods: PaymentMethod[];

  @OneToMany(() => Review, (review) => review.course, {
    cascade: true,
  })
  reviews?: Review[];

  @OneToMany(() => Message, (message) => message.course, {
    cascade: true,
  })
  messages: Message[];
}

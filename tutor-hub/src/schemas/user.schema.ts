// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.schema';
import { SocialMedia } from './socialMedial.schema';
import { PendingEnrollment } from './pendingEnrollment.schema';
import { Review } from './Review.schema';
import { Message } from './message.schema';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  userName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  googleId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  // student only properties
  @ManyToMany(() => Course, (course) => course.students)
  @JoinTable() // Only on one side of the relation
  courses: Course[];

  // tutor only properties
  @Column({ nullable: true })
  shortDescription?: string;

  @Column({ type: 'jsonb', nullable: true })
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    telegram?: string;
    facebook?: string;
    instagram?: string;
  };

  @Column({ nullable: true })
  bio?: string;

  @Column('simple-array', { nullable: true })
  skills?: string[];

  @OneToMany(() => PendingEnrollment, (pendingEnrollment: PendingEnrollment) => pendingEnrollment.user)
  pendingEnrollments?: PendingEnrollment[];

  @OneToMany(() => Review, (Review) => Review.student)
  Reviews?: Review[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages?: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages?: Message[];
}
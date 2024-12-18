// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Course } from './course.schema';
import { SocialMedia } from './socialMedial.schema';

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

  @ManyToOne(() => SocialMedia, { nullable: true })
  socialMedia?: SocialMedia;

  @Column({ nullable: true })
  bio?: string;

  @Column('simple-array', { nullable: true })
  skills?: string[];
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.schema';
import { Course } from './course.schema';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Course, course => course.messages)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @ManyToOne(() => Message, message => message.replies, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parentMessage: Message;

  @OneToMany(() => Message, message => message.parentMessage)
  replies: Message[];
}

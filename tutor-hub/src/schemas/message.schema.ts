import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  senderName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  recipientName: string;

  @Column({ type: 'uuid', nullable: false })
  senderId: string;

  @Column({ type: 'uuid', nullable: false })
  recipientId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  senderRole: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  recipientRole: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => Message, message => message.replies)
  @JoinColumn({ name: 'replyTo' })
  replyTo?: Message;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Message, message => message.replyTo)
  replies: Message[];
}

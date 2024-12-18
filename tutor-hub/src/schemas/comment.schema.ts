import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ type: 'uuid', nullable: false })
  studentId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  studentName: string;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ type: 'int', nullable: false })
  rating: number; 

  @Column({type: 'int', nullable: false})
  courseId: number;
}
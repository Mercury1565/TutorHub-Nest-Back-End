import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  link: string;

  @Column({ type: 'uuid', nullable: false })
  tutorId: string;

  @Column({ type: 'uuid', nullable: false })
  courseId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  examTitle: string;

  @Column({ type: 'timestamp', nullable: false })
  examDate: Date;

  @Column({ type: 'text', array: true, nullable: true })
  students: string[];
}

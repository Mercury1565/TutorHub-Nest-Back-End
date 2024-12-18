import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExamResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  studentId: string;

  @Column({ type: 'uuid', nullable: false })
  examId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  course: string;

  @Column({ type: 'int', nullable: false })
  score: number;
}

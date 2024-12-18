import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { Course } from './course.schema';

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  url: string;

  @Column({ type: 'uuid', nullable: false })
  tutorId: string;

  @ManyToOne(() => Course, (course) => course.assessments, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  date: Date;
}

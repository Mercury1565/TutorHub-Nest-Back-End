import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './course.schema';

@Entity()
export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    method: string;

    @Column()
    number: string;

    @ManyToOne(() => Course, course => course.paymentMethods)
    course: Course;
}
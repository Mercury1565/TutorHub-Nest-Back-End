import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class PendingEnrollment {
    @PrimaryGeneratedColumn()
    id: string;
    
    @Column()
    studentId: string;

    @Column()
    courseId: string;

    @Column()
    receiptFile: string;
}
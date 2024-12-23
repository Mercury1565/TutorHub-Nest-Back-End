import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.schema";

@Entity() 
export class PendingEnrollment {
    @PrimaryGeneratedColumn()
    id: string;
    
    @ManyToOne(() => User, user => user.pendingEnrollments)
    @JoinColumn({ name: "studentId" })
    user: User;

    @Column()
    courseId: string;

    @Column()
    receiptFile: string;
}
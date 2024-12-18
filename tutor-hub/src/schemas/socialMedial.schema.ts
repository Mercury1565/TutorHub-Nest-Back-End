import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocialMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  twitter?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  telegram?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  instagram?: string;
}

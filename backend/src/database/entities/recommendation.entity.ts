import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { User } from './user.entity';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({
    name: 'source_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  sourceType: 'assessment' | 'system' | 'manual';

  @Column({ name: 'source_id', type: 'uuid', nullable: true })
  sourceId: string;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  createdByUserId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @Column({ name: 'recommendation_text', type: 'text' })
  recommendationText: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'medium',
  })
  priority: 'high' | 'medium' | 'low';

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
  })
  status: 'active' | 'implemented' | 'dismissed';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


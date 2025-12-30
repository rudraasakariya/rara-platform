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
import { Session } from './session.entity';
import { User } from './user.entity';

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  sessionId: string;

  @ManyToOne(() => Session, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({
    name: 'assessment_type',
    type: 'varchar',
    length: 50,
  })
  assessmentType: 'session_metric' | 'overall_performance';

  @Column({ name: 'assessment_date', type: 'date' })
  assessmentDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  scores: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  areas: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  createdByUserId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


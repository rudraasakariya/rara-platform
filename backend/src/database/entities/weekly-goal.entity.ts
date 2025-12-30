import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Student } from './student.entity';

@Entity('weekly_goals')
@Unique(['studentId', 'year', 'weekNumber'])
export class WeeklyGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  year: number;

  @Column({ name: 'week_number' })
  weekNumber: number;

  @Column({ name: 'goal_description', type: 'text' })
  goalDescription: string;

  @Column({ name: 'target_value', type: 'numeric', nullable: true })
  targetValue: number;

  @Column({ name: 'current_value', type: 'numeric', nullable: true })
  currentValue: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
  })
  status: 'active' | 'completed' | 'missed';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


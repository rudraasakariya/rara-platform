import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { Student } from './student.entity';

@Entity('session_students')
export class SessionStudent {
  @PrimaryColumn({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => Session, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @PrimaryColumn({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({
    name: 'attendance_status',
    type: 'varchar',
    length: 50,
    default: 'present',
  })
  attendanceStatus: 'present' | 'absent' | 'excused' | 'late';

  @Column({ name: 'minutes_attended', nullable: true })
  minutesAttended: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


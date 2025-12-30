import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Parent } from './parent.entity';

@Entity('student_parents')
export class StudentParent {
  @PrimaryColumn({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @PrimaryColumn({ name: 'parent_id', type: 'uuid' })
  parentId: string;

  @ManyToOne(() => Parent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column({
    name: 'relationship_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  relationshipType: 'mother' | 'father' | 'guardian' | 'other';

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


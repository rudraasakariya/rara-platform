import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CurriculumGrade } from './curriculum-grade.entity';
import { CurriculumCluster } from './curriculum-cluster.entity';

@Entity('curriculum_domains')
export class CurriculumDomain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'grade_id', type: 'uuid' })
  gradeId: string;

  @ManyToOne(() => CurriculumGrade, (grade) => grade.domains, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'grade_id' })
  grade: CurriculumGrade;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 255 })
  label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => CurriculumCluster, (cluster) => cluster.domain)
  clusters: CurriculumCluster[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

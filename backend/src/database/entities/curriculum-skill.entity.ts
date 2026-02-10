import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CurriculumCluster } from './curriculum-cluster.entity';

@Entity('curriculum_skills')
export class CurriculumSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cluster_id', type: 'uuid' })
  clusterId: string;

  @ManyToOne(() => CurriculumCluster, (cluster) => cluster.skills, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cluster_id' })
  cluster: CurriculumCluster;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 500 })
  label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

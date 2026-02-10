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
import { CurriculumDomain } from './curriculum-domain.entity';
import { CurriculumSkill } from './curriculum-skill.entity';

@Entity('curriculum_clusters')
export class CurriculumCluster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'domain_id', type: 'uuid' })
  domainId: string;

  @ManyToOne(() => CurriculumDomain, (domain) => domain.clusters, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'domain_id' })
  domain: CurriculumDomain;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 255 })
  label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => CurriculumSkill, (skill) => skill.cluster)
  skills: CurriculumSkill[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

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
import { Service } from './service.entity';
import { CurriculumDomain } from './curriculum-domain.entity';

@Entity('curriculum_grades')
export class CurriculumGrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 100 })
  label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => CurriculumDomain, (domain) => domain.grade)
  domains: CurriculumDomain[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tutor } from './tutor.entity';
import { Site } from './site.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tutor_id', type: 'uuid' })
  tutorId: string;

  @ManyToOne(() => Tutor, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @Column({ name: 'site_id', type: 'uuid' })
  siteId: string;

  @ManyToOne(() => Site, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'session_date', type: 'date' })
  sessionDate: Date;

  @Column({ name: 'scheduled_start_time', type: 'time', nullable: true })
  scheduledStartTime: string;

  @Column({ name: 'actual_start_time', type: 'time', nullable: true })
  actualStartTime: string;

  @Column({ name: 'actual_end_time', type: 'time', nullable: true })
  actualEndTime: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'scheduled',
  })
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

  @Column({ nullable: true })
  minutes: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


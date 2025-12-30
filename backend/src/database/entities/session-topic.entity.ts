import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { TopicTag } from './topic-tag.entity';

@Entity('session_topics')
export class SessionTopic {
  @PrimaryColumn({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => Session, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @PrimaryColumn({ name: 'topic_tag_id', type: 'uuid' })
  topicTagId: string;

  @ManyToOne(() => TopicTag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_tag_id' })
  topicTag: TopicTag;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


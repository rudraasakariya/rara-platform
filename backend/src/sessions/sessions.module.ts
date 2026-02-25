import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Session } from '../database/entities/session.entity';
import { SessionStudent } from '../database/entities/session-student.entity';
import { Tutor } from '../database/entities/tutor.entity';
import { Site } from '../database/entities/site.entity';
import { Student } from '../database/entities/student.entity';
import { StudentTutorAssignment } from '../database/entities/student-tutor-assignment.entity';
import { CurriculumCluster } from '../database/entities/curriculum-cluster.entity';
import { CurriculumSkill } from '../database/entities/curriculum-skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
      SessionStudent,
      Tutor,
      Site,
      Student,
      StudentTutorAssignment,
      CurriculumCluster,
      CurriculumSkill,
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}

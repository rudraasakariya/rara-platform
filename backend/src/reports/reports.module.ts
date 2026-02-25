import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../database/entities/session.entity';
import { CurriculumSkill } from '../database/entities/curriculum-skill.entity';
import { CurriculumCluster } from '../database/entities/curriculum-cluster.entity';
import { CurriculumDomain } from '../database/entities/curriculum-domain.entity';
import { CurriculumGrade } from '../database/entities/curriculum-grade.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
      CurriculumSkill,
      CurriculumCluster,
      CurriculumDomain,
      CurriculumGrade,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

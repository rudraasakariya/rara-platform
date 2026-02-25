import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Service,
  CurriculumGrade,
  CurriculumDomain,
  CurriculumCluster,
  CurriculumSkill,
} from '../database/entities';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      CurriculumGrade,
      CurriculumDomain,
      CurriculumCluster,
      CurriculumSkill,
    ]),
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService],
  exports: [CurriculumService],
})
export class CurriculumModule {}

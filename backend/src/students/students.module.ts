import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../database/entities/student.entity';
import { Site } from '../database/entities/site.entity';
import { StudentTutorAssignment } from '../database/entities/student-tutor-assignment.entity';
import { Tutor } from '../database/entities/tutor.entity';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Site, StudentTutorAssignment, Tutor])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
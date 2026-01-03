import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from '../database/entities/tutor.entity';
import { User } from '../database/entities/user.entity';
import { StudentTutorAssignment } from '../database/entities/student-tutor-assignment.entity';
import { TutorsService } from './tutors.service';
import { TutorsController } from './tutors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor, User, StudentTutorAssignment])],
  controllers: [TutorsController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}


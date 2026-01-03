import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Tutor } from '../database/entities/tutor.entity';
import { User } from '../database/entities/user.entity';
import { StudentTutorAssignment } from '../database/entities/student-tutor-assignment.entity';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { TutorResponseDto } from './dto/tutor-response.dto';
import { SearchTutorsQueryDto } from './dto/search-tutors-query.dto';
import { MessageCode, Messages } from '../common/messages';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(StudentTutorAssignment)
    private studentTutorAssignmentRepository: Repository<StudentTutorAssignment>,
  ) {}

  async createTutor(createTutorDto: CreateTutorDto): Promise<TutorResponseDto> {
    // Validate that the user exists
    const user = await this.userRepository.findOne({ where: { id: createTutorDto.userId } });
    if (!user) {
      throw new NotFoundException(Messages[MessageCode.USER_NOT_FOUND]);
    }

    // Check if user is already a tutor
    const existingTutor = await this.tutorRepository.findOne({ where: { userId: createTutorDto.userId } });
    if (existingTutor) {
      throw new ConflictException(Messages[MessageCode.USER_ALREADY_TUTOR]);
    }

    // Create tutor record
    const tutor = this.tutorRepository.create({
      userId: createTutorDto.userId,
      maxLoad: createTutorDto.maxLoad ?? 10,
      hireDate: createTutorDto.hireDate ? new Date(createTutorDto.hireDate) : undefined,
    });

    const savedTutor = await this.tutorRepository.save(tutor);
    
    // Load user relationship
    const tutorWithUser = await this.tutorRepository.findOne({
      where: { userId: savedTutor.userId },
      relations: ['user'],
    });

    if (!tutorWithUser) {
      throw new NotFoundException(Messages[MessageCode.TUTOR_NOT_FOUND]);
    }

    return plainToInstance(TutorResponseDto, tutorWithUser, {
      excludeExtraneousValues: true,
    });
  }

  async getTutorById(userId: string): Promise<TutorResponseDto> {
    const tutor = await this.tutorRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!tutor) {
      throw new NotFoundException(Messages[MessageCode.TUTOR_NOT_FOUND]);
    }

    return plainToInstance(TutorResponseDto, tutor, {
      excludeExtraneousValues: true,
    });
  }

  async getTutors(query?: SearchTutorsQueryDto): Promise<TutorResponseDto[]> {
    const queryBuilder = this.tutorRepository
      .createQueryBuilder('tutor')
      .leftJoinAndSelect('tutor.user', 'user');

    if (query?.status) {
      queryBuilder.andWhere('tutor.status = :status', { status: query.status });
    }

    const tutors = await queryBuilder.getMany();
    return tutors.map(tutor =>
      plainToInstance(TutorResponseDto, tutor, {
        excludeExtraneousValues: true,
      })
    );
  }

  async updateTutor(userId: string, updateTutorDto: UpdateTutorDto): Promise<TutorResponseDto> {
    const tutor = await this.tutorRepository.findOne({ where: { userId } });
    if (!tutor) {
      throw new NotFoundException(Messages[MessageCode.TUTOR_NOT_FOUND]);
    }

    // Update tutor
    if (updateTutorDto.maxLoad !== undefined) {
      tutor.maxLoad = updateTutorDto.maxLoad;
    }
    if (updateTutorDto.hireDate !== undefined) {
      tutor.hireDate = updateTutorDto.hireDate ? new Date(updateTutorDto.hireDate) : null;
    }
    if (updateTutorDto.status !== undefined) {
      tutor.status = updateTutorDto.status;
    }

    await this.tutorRepository.save(tutor);

    // Load updated tutor with user relationship
    const updatedTutor = await this.tutorRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!updatedTutor) {
      throw new NotFoundException(Messages[MessageCode.TUTOR_NOT_FOUND]);
    }

    return plainToInstance(TutorResponseDto, updatedTutor, {
      excludeExtraneousValues: true,
    });
  }

  async deleteTutor(userId: string): Promise<void> {
    const tutor = await this.tutorRepository.findOne({ where: { userId } });
    if (!tutor) {
      throw new NotFoundException(Messages[MessageCode.TUTOR_NOT_FOUND]);
    }
    await this.tutorRepository.delete(userId);
  }

  async getTutorStudents(userId: string): Promise<any[]> {
    const tutor = await this.tutorRepository.findOne({ where: { userId } });
    if (!tutor) {
      throw new NotFoundException(Messages[MessageCode.TUTOR_NOT_FOUND]);
    }

    const assignments = await this.studentTutorAssignmentRepository.find({
      where: { tutorId: userId, status: 'active' },
      relations: ['student', 'student.site'],
    });

    return assignments.map(assignment => ({
      assignmentId: assignment.id,
      student: {
        id: assignment.student.id,
        firstName: assignment.student.firstName,
        lastName: assignment.student.lastName,
        siteId: assignment.student.siteId,
        site: assignment.student.site,
        status: assignment.student.status,
      },
      assignedDate: assignment.assignedDate,
      isPrimary: assignment.isPrimary,
      status: assignment.status,
    }));
  }
}


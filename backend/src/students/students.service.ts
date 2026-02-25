import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Student } from '../database/entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { SearchStudentsQueryDto } from './dto/search-students-query.dto';
import { Site } from '../database/entities/site.entity';
import { User } from '../database/entities/user.entity';
import { MessageCode, Messages } from '../common/messages';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}


  async createStudent(createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    // Validate that the site exists
    const site = await this.siteRepository.findOne({ where: { id: createStudentDto.siteId } });
    if (!site) {
      throw new NotFoundException(Messages[MessageCode.SITE_NOT_FOUND]);
    }

    const student = this.studentRepository.create(createStudentDto);
    const savedStudent = await this.studentRepository.save(student);
    return plainToInstance(StudentResponseDto, savedStudent, {
      excludeExtraneousValues: true,
    });
  }

  async getStudentById(id: string, currentUser?: User): Promise<StudentResponseDto> {
    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .where('student.id = :id', { id });

    // If user is a tutor, join with assignments to verify access
    if (currentUser?.role === 'tutor') {
      queryBuilder.innerJoin(
        'student.tutorAssignments',
        'assignment',
        'assignment.tutorId = :tutorId AND assignment.status = :assignmentStatus',
        { tutorId: currentUser.id, assignmentStatus: 'active' }
      );
    }

    const student = await queryBuilder.getOne();
    if (!student) {
      throw new NotFoundException(Messages[MessageCode.STUDENT_NOT_FOUND]);
    }

    return plainToInstance(StudentResponseDto, student, {
      excludeExtraneousValues: true,
    });
  }
  async updateStudent(id: string, updateStudentDto: UpdateStudentDto, currentUser?: User): Promise<StudentResponseDto> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(Messages[MessageCode.STUDENT_NOT_FOUND]);
    }

    if (updateStudentDto.caseStatus === 'needsAD' && currentUser?.role !== 'super_admin') {
      throw new ForbiddenException('Only super admins can set caseStatus to needsAD');
    }

    // Validate that the site exists if siteId is being updated
    if (updateStudentDto.siteId) {
      const site = await this.siteRepository.findOne({ where: { id: updateStudentDto.siteId } });
      if (!site) {
        throw new NotFoundException(Messages[MessageCode.SITE_NOT_FOUND]);
      }
    }

    await this.studentRepository.update(id, updateStudentDto);
    const updatedStudent = await this.studentRepository.findOne({ where: { id } });
    return plainToInstance(StudentResponseDto, updatedStudent, {
      excludeExtraneousValues: true,
    });
  }
  async deleteStudent(id: string): Promise<void> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(Messages[MessageCode.STUDENT_NOT_FOUND]);
    }
    await this.studentRepository.delete(id);
  }
  
  async getStudents(query?: SearchStudentsQueryDto, currentUser?: User): Promise<StudentResponseDto[]> {
    const queryBuilder = this.studentRepository.createQueryBuilder('student');

    // If user is a tutor, join with assignments using entity relationship
    if (currentUser?.role === 'tutor') {
      queryBuilder.innerJoin(
        'student.tutorAssignments',
        'assignment',
        'assignment.tutorId = :tutorId AND assignment.status = :assignmentStatus',
        { tutorId: currentUser.id, assignmentStatus: 'active' }
      );
    }

    // Filter by siteId (using entity property name)
    if (query?.siteId) {
      queryBuilder.andWhere('student.siteId = :siteId', { siteId: query.siteId });
    }

    // Filter by status (using entity property name)
    if (query?.status) {
      queryBuilder.andWhere('student.status = :status', { status: query.status });
    }

    if (query?.caseStatus) {
      queryBuilder.andWhere('student.caseStatus = :caseStatus', { caseStatus: query.caseStatus });
    }

    const students = await queryBuilder.getMany();
    return students.map(student => 
      plainToInstance(StudentResponseDto, student, {
        excludeExtraneousValues: true,
      })
    );
  }

  async getStudentsBySiteId(siteId: string, currentUser?: User): Promise<StudentResponseDto[]> {
    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .where('student.siteId = :siteId', { siteId });

    // If user is a tutor, join with assignments using entity relationship
    if (currentUser?.role === 'tutor') {
      queryBuilder.innerJoin(
        'student.tutorAssignments',
        'assignment',
        'assignment.tutorId = :tutorId AND assignment.status = :assignmentStatus',
        { tutorId: currentUser.id, assignmentStatus: 'active' }
      );
    }

    const students = await queryBuilder.getMany();
    return students.map(student => 
      plainToInstance(StudentResponseDto, student, {
        excludeExtraneousValues: true,
      })
    );
  }

  async getStudentBySiteIdAndStudentId(siteId: string, studentId: string, currentUser?: User): Promise<StudentResponseDto> {
    const queryBuilder = this.studentRepository
      .createQueryBuilder('student')
      .where('student.id = :studentId', { studentId })
      .andWhere('student.siteId = :siteId', { siteId });

    // If user is a tutor, join with assignments using entity relationship
    if (currentUser?.role === 'tutor') {
      queryBuilder.innerJoin(
        'student.tutorAssignments',
        'assignment',
        'assignment.tutorId = :tutorId AND assignment.status = :assignmentStatus',
        { tutorId: currentUser.id, assignmentStatus: 'active' }
      );
    }

    const student = await queryBuilder.getOne();
    if (!student) {
      throw new NotFoundException(Messages[MessageCode.STUDENT_NOT_FOUND]);
    }

    return plainToInstance(StudentResponseDto, student, {
      excludeExtraneousValues: true,
    });
  }

}

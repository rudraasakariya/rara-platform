import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Session } from '../database/entities/session.entity';
import { SessionStudent } from '../database/entities/session-student.entity';
import { Tutor } from '../database/entities/tutor.entity';
import { Site } from '../database/entities/site.entity';
import { Student } from '../database/entities/student.entity';
import { StudentTutorAssignment } from '../database/entities/student-tutor-assignment.entity';
import { CurriculumCluster } from '../database/entities/curriculum-cluster.entity';
import { CurriculumSkill } from '../database/entities/curriculum-skill.entity';
import { User } from '../database/entities/user.entity';
import { Role } from '../common/roles/roles.enum';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SearchSessionsQueryDto } from './dto/search-sessions-query.dto';
import { SessionResponseDto } from './dto/session-response.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(SessionStudent)
    private readonly sessionStudentRepository: Repository<SessionStudent>,
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentTutorAssignment)
    private readonly studentTutorAssignmentRepository: Repository<StudentTutorAssignment>,
    @InjectRepository(CurriculumCluster)
    private readonly clusterRepository: Repository<CurriculumCluster>,
    @InjectRepository(CurriculumSkill)
    private readonly skillRepository: Repository<CurriculumSkill>,
  ) {}

  async createSession(createSessionDto: CreateSessionDto, currentUser: User): Promise<SessionResponseDto> {
    const tutorId = await this.resolveCreateTutorId(createSessionDto.tutorId, currentUser);

    await this.ensureSiteExists(createSessionDto.siteId);
    await this.validateStudents(createSessionDto.studentIds, tutorId);

    const taxonomy = await this.resolveTaxonomy({
      clusterId: createSessionDto.clusterId,
      skillId: createSessionDto.skillId,
    });

    const session = this.sessionRepository.create({
      tutorId,
      siteId: createSessionDto.siteId,
      clusterId: taxonomy.clusterId,
      skillId: taxonomy.skillId,
      sessionDate: new Date(createSessionDto.sessionDate),
      scheduledStartTime: createSessionDto.scheduledStartTime,
      actualStartTime: createSessionDto.actualStartTime,
      actualEndTime: createSessionDto.actualEndTime,
      status: createSessionDto.status ?? 'scheduled',
      minutes: createSessionDto.minutes,
      notes: createSessionDto.notes,
    });

    const savedSession = await this.sessionRepository.save(session);

    await this.sessionStudentRepository.save(
      createSessionDto.studentIds.map((studentId) =>
        this.sessionStudentRepository.create({
          sessionId: savedSession.id,
          studentId,
        }),
      ),
    );

    return this.getSessionById(savedSession.id, currentUser);
  }

  async getSessions(query: SearchSessionsQueryDto, currentUser: User): Promise<SessionResponseDto[]> {
    const queryBuilder = this.createSessionsQueryBuilder(currentUser);

    if (currentUser.role !== Role.TUTOR && query?.tutorId) {
      queryBuilder.andWhere('session.tutorId = :tutorId', { tutorId: query.tutorId });
    }

    if (query?.siteId) {
      queryBuilder.andWhere('session.siteId = :siteId', { siteId: query.siteId });
    }

    if (query?.status) {
      queryBuilder.andWhere('session.status = :status', { status: query.status });
    }

    if (query?.startDate) {
      queryBuilder.andWhere('session.sessionDate >= :startDate', { startDate: query.startDate });
    }

    if (query?.endDate) {
      queryBuilder.andWhere('session.sessionDate <= :endDate', { endDate: query.endDate });
    }

    if (query?.gradeId) {
      queryBuilder.andWhere('grade.id = :gradeId', { gradeId: query.gradeId });
    }

    if (query?.clusterId) {
      queryBuilder.andWhere('session.clusterId = :clusterId', { clusterId: query.clusterId });
    }

    if (query?.skillId) {
      queryBuilder.andWhere('session.skillId = :skillId', { skillId: query.skillId });
    }

    queryBuilder
      .orderBy('session.sessionDate', 'DESC')
      .addOrderBy('session.createdAt', 'DESC');

    const sessions = await queryBuilder.getMany();
    const studentIdsBySession = await this.getStudentIdsBySessionIds(sessions.map((session) => session.id));

    return sessions.map((session) =>
      this.mapSessionToResponse(session, studentIdsBySession.get(session.id) ?? []),
    );
  }

  async getSessionById(id: string, currentUser: User): Promise<SessionResponseDto> {
    const queryBuilder = this.createSessionsQueryBuilder(currentUser).where('session.id = :id', { id });
    const session = await queryBuilder.getOne();

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const studentIds = await this.getStudentIdsBySessionId(id);
    return this.mapSessionToResponse(session, studentIds);
  }

  async updateSession(id: string, updateSessionDto: UpdateSessionDto, currentUser: User): Promise<SessionResponseDto> {
    const session = await this.getSessionForAccess(id, currentUser);

    const tutorId = await this.resolveUpdateTutorId(updateSessionDto.tutorId, currentUser, session.tutorId);

    if (updateSessionDto.siteId !== undefined) {
      await this.ensureSiteExists(updateSessionDto.siteId);
      session.siteId = updateSessionDto.siteId;
    }

    if (updateSessionDto.clusterId !== undefined || updateSessionDto.skillId !== undefined) {
      const taxonomy = await this.resolveTaxonomy({
        clusterId: updateSessionDto.clusterId,
        skillId: updateSessionDto.skillId,
      });
      session.clusterId = taxonomy.clusterId;
      session.skillId = taxonomy.skillId;
    }

    session.tutorId = tutorId;

    if (updateSessionDto.sessionDate !== undefined) {
      session.sessionDate = new Date(updateSessionDto.sessionDate);
    }

    if (updateSessionDto.scheduledStartTime !== undefined) {
      session.scheduledStartTime = updateSessionDto.scheduledStartTime;
    }

    if (updateSessionDto.actualStartTime !== undefined) {
      session.actualStartTime = updateSessionDto.actualStartTime;
    }

    if (updateSessionDto.actualEndTime !== undefined) {
      session.actualEndTime = updateSessionDto.actualEndTime;
    }

    if (updateSessionDto.status !== undefined) {
      session.status = updateSessionDto.status;
    }

    if (updateSessionDto.minutes !== undefined) {
      session.minutes = updateSessionDto.minutes;
    }

    if (updateSessionDto.notes !== undefined) {
      session.notes = updateSessionDto.notes;
    }

    await this.sessionRepository.save(session);

    if (updateSessionDto.studentIds !== undefined) {
      await this.validateStudents(updateSessionDto.studentIds, tutorId);
      await this.sessionStudentRepository.delete({ sessionId: id });

      await this.sessionStudentRepository.save(
        updateSessionDto.studentIds.map((studentId) =>
          this.sessionStudentRepository.create({
            sessionId: id,
            studentId,
          }),
        ),
      );
    }

    return this.getSessionById(id, currentUser);
  }

  async deleteSession(id: string, currentUser: User): Promise<void> {
    await this.getSessionForAccess(id, currentUser);
    await this.sessionRepository.delete(id);
  }

  async getSessionStudents(sessionId: string, currentUser: User) {
    await this.getSessionForAccess(sessionId, currentUser);

    const sessionStudents = await this.sessionStudentRepository.find({
      where: { sessionId },
      relations: ['student'],
    });

    return sessionStudents.map((sessionStudent) => ({
      studentId: sessionStudent.studentId,
      attendanceStatus: sessionStudent.attendanceStatus,
      minutesAttended: sessionStudent.minutesAttended,
      notes: sessionStudent.notes,
      student: sessionStudent.student
        ? {
            id: sessionStudent.student.id,
            firstName: sessionStudent.student.firstName,
            lastName: sessionStudent.student.lastName,
            gradeLevel: sessionStudent.student.gradeLevel,
            status: sessionStudent.student.status,
          }
        : null,
    }));
  }

  async addStudentToSession(sessionId: string, studentId: string, currentUser: User) {
    const session = await this.getSessionForAccess(sessionId, currentUser);
    await this.validateStudents([studentId], session.tutorId);

    const existingSessionStudent = await this.sessionStudentRepository.findOne({
      where: { sessionId, studentId },
    });

    if (!existingSessionStudent) {
      await this.sessionStudentRepository.save(
        this.sessionStudentRepository.create({
          sessionId,
          studentId,
        }),
      );
    }

    return this.getSessionStudents(sessionId, currentUser);
  }

  async removeStudentFromSession(sessionId: string, studentId: string, currentUser: User) {
    await this.getSessionForAccess(sessionId, currentUser);

    const result = await this.sessionStudentRepository.delete({ sessionId, studentId });
    if (!result.affected) {
      throw new NotFoundException('Student is not assigned to this session');
    }

    return this.getSessionStudents(sessionId, currentUser);
  }

  private createSessionsQueryBuilder(currentUser: User) {
    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.cluster', 'cluster')
      .leftJoinAndSelect('cluster.domain', 'domain')
      .leftJoinAndSelect('domain.grade', 'grade')
      .leftJoinAndSelect('session.skill', 'skill');

    if (currentUser.role === Role.TUTOR) {
      queryBuilder.andWhere('session.tutorId = :currentTutorId', {
        currentTutorId: currentUser.id,
      });
    }

    return queryBuilder;
  }

  private mapSessionToResponse(session: Session, studentIds: string[]): SessionResponseDto {
    const cluster = session.cluster ?? null;
    const grade = cluster?.domain?.grade ?? null;
    const skill = session.skill ?? null;

    return {
      id: session.id,
      tutorId: session.tutorId,
      siteId: session.siteId,
      gradeId: grade?.id ?? null,
      gradeCode: grade?.code ?? null,
      gradeLabel: grade?.label ?? null,
      clusterId: session.clusterId,
      clusterCode: cluster?.code ?? null,
      clusterLabel: cluster?.label ?? null,
      skillId: session.skillId,
      skillCode: skill?.code ?? null,
      skillLabel: skill?.label ?? null,
      sessionDate: session.sessionDate,
      scheduledStartTime: session.scheduledStartTime ?? null,
      actualStartTime: session.actualStartTime ?? null,
      actualEndTime: session.actualEndTime ?? null,
      status: session.status,
      minutes: session.minutes ?? null,
      notes: session.notes ?? null,
      studentIds,
      studentCount: studentIds.length,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  private async getSessionForAccess(id: string, currentUser: User): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (currentUser.role === Role.TUTOR && session.tutorId !== currentUser.id) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  private async ensureSiteExists(siteId: string): Promise<void> {
    const site = await this.siteRepository.findOne({ where: { id: siteId } });
    if (!site) {
      throw new NotFoundException('Site not found');
    }
  }

  private async ensureTutorExists(tutorId: string): Promise<void> {
    const tutor = await this.tutorRepository.findOne({ where: { userId: tutorId } });
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }
  }

  private async resolveCreateTutorId(tutorId: string | undefined, currentUser: User): Promise<string> {
    if (currentUser.role === Role.TUTOR) {
      if (tutorId && tutorId !== currentUser.id) {
        throw new BadRequestException('Tutors can only create sessions for themselves');
      }

      await this.ensureTutorExists(currentUser.id);
      return currentUser.id;
    }

    if (!tutorId) {
      throw new BadRequestException('tutorId is required for admin and super_admin users');
    }

    await this.ensureTutorExists(tutorId);
    return tutorId;
  }

  private async resolveUpdateTutorId(
    tutorId: string | undefined,
    currentUser: User,
    existingTutorId: string,
  ): Promise<string> {
    if (currentUser.role === Role.TUTOR) {
      if (tutorId && tutorId !== currentUser.id) {
        throw new BadRequestException('Tutors can only update sessions for themselves');
      }

      return currentUser.id;
    }

    if (!tutorId) {
      return existingTutorId;
    }

    await this.ensureTutorExists(tutorId);
    return tutorId;
  }

  private async resolveTaxonomy(input: {
    clusterId?: string;
    skillId?: string;
  }): Promise<{ clusterId: string; skillId: string | null }> {
    const { clusterId, skillId } = input;

    if (!clusterId && !skillId) {
      throw new BadRequestException('Either clusterId or skillId is required');
    }

    let resolvedCluster: CurriculumCluster | null = null;
    let resolvedSkill: CurriculumSkill | null = null;

    if (skillId) {
      resolvedSkill = await this.skillRepository.findOne({
        where: { id: skillId },
        relations: ['cluster'],
      });

      if (!resolvedSkill) {
        throw new NotFoundException('Skill not found');
      }

      resolvedCluster = resolvedSkill.cluster;
    }

    if (clusterId) {
      const cluster = await this.clusterRepository.findOne({ where: { id: clusterId } });
      if (!cluster) {
        throw new NotFoundException('Cluster not found');
      }

      if (resolvedCluster && resolvedCluster.id !== cluster.id) {
        throw new BadRequestException('skillId must belong to clusterId');
      }

      resolvedCluster = cluster;
    }

    if (!resolvedCluster) {
      throw new BadRequestException('Either clusterId or skillId is required');
    }

    return {
      clusterId: resolvedCluster.id,
      skillId: resolvedSkill?.id ?? null,
    };
  }

  private async validateStudents(studentIds: string[], tutorId: string): Promise<void> {
    if (studentIds.length === 0) {
      throw new BadRequestException('At least one student is required');
    }

    const uniqueStudentIds = [...new Set(studentIds)];
    if (uniqueStudentIds.length !== studentIds.length) {
      throw new BadRequestException('studentIds must contain unique values');
    }

    const studentsCount = await this.studentRepository.count({
      where: { id: In(uniqueStudentIds) },
    });

    if (studentsCount !== uniqueStudentIds.length) {
      throw new NotFoundException('One or more students were not found');
    }

    const assignedStudentsCount = await this.studentTutorAssignmentRepository.count({
      where: {
        tutorId,
        status: 'active',
        studentId: In(uniqueStudentIds),
      },
    });

    if (assignedStudentsCount !== uniqueStudentIds.length) {
      throw new BadRequestException('All students must be actively assigned to the selected tutor');
    }
  }

  private async getStudentIdsBySessionIds(sessionIds: string[]): Promise<Map<string, string[]>> {
    const result = new Map<string, string[]>();

    if (sessionIds.length === 0) {
      return result;
    }

    const sessionStudents = await this.sessionStudentRepository.find({
      where: { sessionId: In(sessionIds) },
      select: ['sessionId', 'studentId'],
    });

    for (const sessionStudent of sessionStudents) {
      const current = result.get(sessionStudent.sessionId) ?? [];
      current.push(sessionStudent.studentId);
      result.set(sessionStudent.sessionId, current);
    }

    return result;
  }

  private async getStudentIdsBySessionId(sessionId: string): Promise<string[]> {
    const sessionStudents = await this.sessionStudentRepository.find({
      where: { sessionId },
      select: ['studentId'],
    });

    return sessionStudents.map((sessionStudent) => sessionStudent.studentId);
  }
}

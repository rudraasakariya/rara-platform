import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Service,
  CurriculumGrade,
  CurriculumDomain,
  CurriculumCluster,
  CurriculumSkill,
} from '../database/entities';
import { MessageCode, Messages } from '../common/messages';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(CurriculumGrade)
    private readonly gradeRepository: Repository<CurriculumGrade>,
    @InjectRepository(CurriculumDomain)
    private readonly domainRepository: Repository<CurriculumDomain>,
    @InjectRepository(CurriculumCluster)
    private readonly clusterRepository: Repository<CurriculumCluster>,
    @InjectRepository(CurriculumSkill)
    private readonly skillRepository: Repository<CurriculumSkill>,
  ) {}

  /** GET curriculum/subjects – list subjects (services with curriculum). */
  async getSubjects(): Promise<Service[]> {
    return this.serviceRepository
      .createQueryBuilder('service')
      .innerJoin('curriculum_grades', 'grade', 'grade.service_id = service.id')
      .where('service.active = :active', { active: true })
      .orderBy('service.name', 'ASC')
      .distinct(true)
      .getMany();
  }

  /** GET curriculum/subjects/:subjectId/grades – grades for a subject (service). */
  async getGradesBySubjectId(subjectId: string): Promise<CurriculumGrade[]> {
    const service = await this.serviceRepository.findOne({
      where: { id: subjectId, active: true },
    });
    if (!service) {
      throw new NotFoundException(Messages[MessageCode.SUBJECT_NOT_FOUND]);
    }
    return this.gradeRepository.find({
      where: { serviceId: subjectId },
      relations: ['service'],
      order: { code: 'ASC' },
    });
  }

  /** GET curriculum/grades/:gradeId/domains – domains for a grade. */
  async getDomainsByGradeId(gradeId: string): Promise<CurriculumDomain[]> {
    const grade = await this.gradeRepository.findOne({
      where: { id: gradeId },
    });
    if (!grade) {
      throw new NotFoundException(Messages[MessageCode.GRADE_NOT_FOUND]);
    }
    return this.domainRepository.find({
      where: { gradeId },
      relations: ['grade'],
      order: { code: 'ASC' },
    });
  }

  /** GET curriculum/domains/:domainId/clusters – clusters for a domain. */
  async getClustersByDomainId(domainId: string): Promise<CurriculumCluster[]> {
    const domain = await this.domainRepository.findOne({
      where: { id: domainId },
    });
    if (!domain) {
      throw new NotFoundException(Messages[MessageCode.DOMAIN_NOT_FOUND]);
    }
    return this.clusterRepository.find({
      where: { domainId },
      relations: ['domain'],
      order: { code: 'ASC' },
    });
  }

  /** GET curriculum/clusters/:clusterId/skills – skills for a cluster. */
  async getSkillsByClusterId(clusterId: string): Promise<CurriculumSkill[]> {
    const cluster = await this.clusterRepository.findOne({
      where: { id: clusterId },
    });
    if (!cluster) {
      throw new NotFoundException(Messages[MessageCode.CLUSTER_NOT_FOUND]);
    }
    return this.skillRepository.find({
      where: { clusterId },
      relations: ['cluster'],
      order: { code: 'ASC' },
    });
  }

  /**
   * GET curriculum/subjects/:subjectId/grades/:gradeId/tree
   * Returns full tree: grade with domains, each domain with clusters, each cluster with skills.
   */
  async getTree(subjectId: string, gradeId: string) {
    const grade = await this.gradeRepository
      .createQueryBuilder('grade')
      .innerJoinAndSelect('grade.service', 'service', 'service.active = :active', {
        active: true,
      })
      .where('grade.id = :gradeId', { gradeId })
      .andWhere('grade.serviceId = :subjectId', { subjectId })
      .getOne();

    if (!grade) {
      const service = await this.serviceRepository.findOne({
        where: { id: subjectId, active: true },
      });
      if (!service) {
        throw new NotFoundException(Messages[MessageCode.SUBJECT_NOT_FOUND]);
      }
      throw new NotFoundException(Messages[MessageCode.GRADE_NOT_FOUND]);
    }
    const domains = await this.domainRepository.find({
      where: { gradeId },
      relations: ['clusters', 'clusters.skills'],
      order: { code: 'ASC' },
    });
    return {
      grade,
      domains,
    };
  }
}

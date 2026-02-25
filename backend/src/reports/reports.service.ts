import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../database/entities/session.entity';
import { CurriculumSkill } from '../database/entities/curriculum-skill.entity';
import { CurriculumCluster } from '../database/entities/curriculum-cluster.entity';
import { CurriculumDomain } from '../database/entities/curriculum-domain.entity';
import { CurriculumGrade } from '../database/entities/curriculum-grade.entity';
import { CoverageQueryDto } from './dto/coverage-query.dto';
import { CoverageResponseDto, SkillCoverageItemDto } from './dto/coverage-response.dto';
import { TrendQueryDto } from './dto/trend-query.dto';
import { TrendResponseDto, TrendPeriodDto } from './dto/trend-response.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(CurriculumSkill)
    private readonly skillRepository: Repository<CurriculumSkill>,
    @InjectRepository(CurriculumCluster)
    private readonly clusterRepository: Repository<CurriculumCluster>,
    @InjectRepository(CurriculumDomain)
    private readonly domainRepository: Repository<CurriculumDomain>,
    @InjectRepository(CurriculumGrade)
    private readonly gradeRepository: Repository<CurriculumGrade>,
  ) {}

  async getCoverage(query: CoverageQueryDto): Promise<CoverageResponseDto> {
    // Build the set of skills in scope based on taxonomy filters
    const skillsInScope = await this.getSkillsInScope(query);

    if (skillsInScope.length === 0) {
      return { totalSkills: 0, coveredSkills: 0, coveragePercent: 0, skills: [] };
    }

    const skillIds = skillsInScope.map((s) => s.id);

    // Count sessions per skill within the filters
    const sessionQb = this.sessionRepository
      .createQueryBuilder('session')
      .select('session.skillId', 'skillId')
      .addSelect('COUNT(session.id)', 'sessionCount')
      .where('session.skillId IN (:...skillIds)', { skillIds })
      .groupBy('session.skillId');

    this.applySessionFilters(sessionQb, query);

    const sessionRows: { skillId: string; sessionCount: string }[] = await sessionQb.getRawMany();

    const sessionCountBySkill = new Map(
      sessionRows.map((r) => [r.skillId, parseInt(r.sessionCount, 10)]),
    );

    const skills: SkillCoverageItemDto[] = skillsInScope.map((skill) => {
      const count = sessionCountBySkill.get(skill.id) ?? 0;
      return {
        skillId: skill.id,
        skillCode: skill.code,
        skillLabel: skill.label,
        clusterId: skill.cluster.id,
        clusterLabel: skill.cluster.label,
        domainId: skill.cluster.domain.id,
        domainLabel: skill.cluster.domain.label,
        covered: count > 0,
        sessionCount: count,
      };
    });

    const totalSkills = skills.length;
    const coveredSkills = skills.filter((s) => s.covered).length;
    const coveragePercent =
      totalSkills > 0 ? Math.round((coveredSkills / totalSkills) * 100 * 10) / 10 : 0;

    return { totalSkills, coveredSkills, coveragePercent, skills };
  }

  async getTrend(query: TrendQueryDto): Promise<TrendResponseDto> {
    const groupBy = query.groupBy ?? 'week';

    // Use PostgreSQL date_trunc to group sessions
    const trunc = groupBy === 'month' ? 'month' : 'week';

    const qb = this.sessionRepository
      .createQueryBuilder('session')
      .select(`DATE_TRUNC('${trunc}', session.sessionDate)`, 'periodStart')
      .addSelect('COUNT(DISTINCT session.id)', 'sessionCount')
      .addSelect('COUNT(DISTINCT session.skillId)', 'skillsCovered')
      .groupBy(`DATE_TRUNC('${trunc}', session.sessionDate)`)
      .orderBy(`DATE_TRUNC('${trunc}', session.sessionDate)`, 'ASC');

    this.applySessionFilters(qb, query);

    // Apply taxonomy filters if provided
    if (query.gradeId || query.domainId || query.subjectId) {
      qb.leftJoin('session.cluster', 'cluster')
        .leftJoin('cluster.domain', 'domain')
        .leftJoin('domain.grade', 'grade');

      if (query.domainId) {
        qb.andWhere('domain.id = :domainId', { domainId: query.domainId });
      } else if (query.gradeId) {
        qb.andWhere('grade.id = :gradeId', { gradeId: query.gradeId });
      } else if (query.subjectId) {
        qb.andWhere('grade.serviceId = :subjectId', { subjectId: query.subjectId });
      }
    }

    const rows: { periodStart: Date; sessionCount: string; skillsCovered: string }[] =
      await qb.getRawMany();

    const data: TrendPeriodDto[] = rows.map((r) => {
      const d = new Date(r.periodStart);
      const period =
        groupBy === 'month'
          ? `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
          : `${d.getUTCFullYear()}-W${String(getISOWeek(d)).padStart(2, '0')}`;

      return {
        period,
        periodStart: d.toISOString().split('T')[0],
        sessionCount: parseInt(r.sessionCount, 10),
        skillsCovered: parseInt(r.skillsCovered, 10),
      };
    });

    return { groupBy, data };
  }

  // ── private helpers ──────────────────────────────────────────────────────

  private async getSkillsInScope(
    query: Pick<CoverageQueryDto, 'subjectId' | 'gradeId' | 'domainId'>,
  ) {
    const qb = this.skillRepository
      .createQueryBuilder('skill')
      .innerJoinAndSelect('skill.cluster', 'cluster')
      .innerJoinAndSelect('cluster.domain', 'domain')
      .innerJoinAndSelect('domain.grade', 'grade');

    if (query.domainId) {
      qb.andWhere('domain.id = :domainId', { domainId: query.domainId });
    } else if (query.gradeId) {
      qb.andWhere('grade.id = :gradeId', { gradeId: query.gradeId });
    } else if (query.subjectId) {
      qb.andWhere('grade.serviceId = :subjectId', { subjectId: query.subjectId });
    }

    return qb.getMany();
  }

  private applySessionFilters(
    qb: ReturnType<typeof this.sessionRepository.createQueryBuilder>,
    query: Pick<CoverageQueryDto, 'tutorId' | 'siteId' | 'from' | 'to'>,
  ) {
    if (query.tutorId) {
      qb.andWhere('session.tutorId = :tutorId', { tutorId: query.tutorId });
    }

    if (query.siteId) {
      qb.andWhere('session.siteId = :siteId', { siteId: query.siteId });
    }

    if (query.from) {
      qb.andWhere('session.sessionDate >= :from', { from: query.from });
    }

    if (query.to) {
      qb.andWhere('session.sessionDate <= :to', { to: query.to });
    }
  }
}

/** ISO week number (1-53) for a given UTC date */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayOfWeek = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayOfWeek);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

import apiClient from '../api-client';

// ── Query types ──────────────────────────────────────────────────────────────

export interface CoverageQuery {
  tutorId?: string;
  siteId?: string;
  subjectId?: string;
  gradeId?: string;
  domainId?: string;
  from?: string;
  to?: string;
}

export interface TrendQuery extends CoverageQuery {
  groupBy?: 'week' | 'month';
}

// ── Response types ────────────────────────────────────────────────────────────

export interface SkillCoverageItem {
  skillId: string;
  skillCode: string;
  skillLabel: string;
  clusterId: string;
  clusterLabel: string;
  domainId: string;
  domainLabel: string;
  covered: boolean;
  sessionCount: number;
}

export interface CoverageReport {
  totalSkills: number;
  coveredSkills: number;
  coveragePercent: number;
  skills: SkillCoverageItem[];
}

export interface TrendPeriod {
  period: string;
  periodStart: string;
  sessionCount: number;
  skillsCovered: number;
}

export interface TrendReport {
  groupBy: 'week' | 'month';
  data: TrendPeriod[];
}

// ── API client ────────────────────────────────────────────────────────────────

export const reportsApi = {
  getCoverage: async (query?: CoverageQuery): Promise<CoverageReport> => {
    const response = await apiClient.get<CoverageReport>('/reports/coverage', {
      params: query,
    });
    return response.data;
  },

  getTrend: async (query?: TrendQuery): Promise<TrendReport> => {
    const response = await apiClient.get<TrendReport>('/reports/trend', { params: query });
    return response.data;
  },
};

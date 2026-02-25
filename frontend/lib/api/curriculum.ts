import apiClient from '../api-client';

export interface CurriculumSubject {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
}

export interface CurriculumGrade {
  id: string;
  code: string;
  label: string;
  description: string | null;
}

export interface CurriculumDomain {
  id: string;
  code: string;
  label: string;
  description: string | null;
}

export interface CurriculumCluster {
  id: string;
  code: string;
  label: string;
  description: string | null;
}

export interface CurriculumSkill {
  id: string;
  code: string;
  label: string;
  description: string | null;
}

export interface CurriculumClusterNode extends CurriculumCluster {
  skills: CurriculumSkill[];
}

export interface CurriculumDomainNode extends CurriculumDomain {
  clusters: CurriculumClusterNode[];
}

export interface CurriculumTree {
  grade: CurriculumGrade;
  domains: CurriculumDomainNode[];
}

export const curriculumApi = {
  getSubjects: async (): Promise<CurriculumSubject[]> => {
    const response = await apiClient.get<CurriculumSubject[]>('/curriculum/subjects');
    return response.data;
  },

  getGradesBySubjectId: async (subjectId: string): Promise<CurriculumGrade[]> => {
    const response = await apiClient.get<CurriculumGrade[]>(`/curriculum/subjects/${subjectId}/grades`);
    return response.data;
  },

  getTreeBySubjectAndGrade: async (
    subjectId: string,
    gradeId: string,
  ): Promise<CurriculumTree> => {
    const response = await apiClient.get<CurriculumTree>(
      `/curriculum/subjects/${subjectId}/grades/${gradeId}/tree`,
    );
    return response.data;
  },

  getDomainsByGradeId: async (gradeId: string): Promise<CurriculumDomain[]> => {
    const response = await apiClient.get<CurriculumDomain[]>(`/curriculum/grades/${gradeId}/domains`);
    return response.data;
  },
};

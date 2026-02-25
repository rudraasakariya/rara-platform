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

export interface CurriculumTree {
  grade: CurriculumGrade;
  domains: Array<
    CurriculumDomain & {
      clusters: Array<
        CurriculumCluster & {
          skills: CurriculumSkill[];
        }
      >;
    }
  >;
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
};

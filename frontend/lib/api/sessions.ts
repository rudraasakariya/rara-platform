import apiClient from '../api-client';

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Session {
  id: string;
  tutorId: string;
  siteId: string;
  gradeId: string | null;
  gradeCode: string | null;
  gradeLabel: string | null;
  clusterId: string | null;
  clusterCode: string | null;
  clusterLabel: string | null;
  skillId: string | null;
  skillCode: string | null;
  skillLabel: string | null;
  sessionDate: string;
  scheduledStartTime: string | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  status: SessionStatus;
  minutes: number | null;
  notes: string | null;
  studentIds: string[];
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchSessionsQuery {
  tutorId?: string;
  siteId?: string;
  status?: SessionStatus;
  startDate?: string;
  endDate?: string;
  gradeId?: string;
  clusterId?: string;
  skillId?: string;
  studentId?: string;
}

export interface CreateSessionDto {
  tutorId?: string;
  siteId: string;
  studentIds: string[];
  clusterId?: string;
  skillId?: string;
  sessionDate: string;
  scheduledStartTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status?: SessionStatus;
  minutes?: number;
  notes?: string;
}

export interface UpdateSessionDto extends Partial<CreateSessionDto> {}

export const sessionsApi = {
  getAll: async (query?: SearchSessionsQuery): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>('/sessions', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${id}`);
    return response.data;
  },

  create: async (data: CreateSessionDto): Promise<Session> => {
    const response = await apiClient.post<Session>('/sessions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSessionDto): Promise<Session> => {
    const response = await apiClient.patch<Session>(`/sessions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sessions/${id}`);
  },

  getSessionStudents: async (sessionId: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/sessions/${sessionId}/students`);
    return response.data;
  },

  addStudentToSession: async (sessionId: string, studentId: string): Promise<any[]> => {
    const response = await apiClient.post<any[]>(`/sessions/${sessionId}/students/${studentId}`);
    return response.data;
  },

  removeStudentFromSession: async (sessionId: string, studentId: string): Promise<any[]> => {
    const response = await apiClient.delete<any[]>(`/sessions/${sessionId}/students/${studentId}`);
    return response.data;
  },
};

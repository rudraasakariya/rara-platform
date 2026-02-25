import apiClient from '../api-client';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  status?: string;
  siteId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email?: string;
  status?: string;
  siteId?: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  siteId?: string;
}

export interface SearchStudentsQuery {
  siteId?: string;
  status?: string;
}

export const studentsApi = {
  getAll: async (query?: SearchStudentsQuery): Promise<Student[]> => {
    const response = await apiClient.get<Student[]>('/students', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await apiClient.get<Student>(`/students/${id}`);
    return response.data;
  },

  getBySiteId: async (siteId: string): Promise<Student[]> => {
    const response = await apiClient.get<Student[]>(`/students/site/${siteId}/students`);
    return response.data;
  },

  create: async (data: CreateStudentDto): Promise<Student> => {
    const response = await apiClient.post<Student>('/students', data);
    return response.data;
  },

  update: async (id: string, data: UpdateStudentDto): Promise<Student> => {
    const response = await apiClient.put<Student>(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};


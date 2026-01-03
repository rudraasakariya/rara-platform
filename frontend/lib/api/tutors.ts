import apiClient from '../api-client';

export interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  status?: string;
  siteId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTutorDto {
  firstName: string;
  lastName: string;
  email?: string;
  status?: string;
  siteId?: string;
}

export interface UpdateTutorDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  siteId?: string;
}

export interface SearchTutorsQuery {
  siteId?: string;
  status?: string;
}

export const tutorsApi = {
  getAll: async (query?: SearchTutorsQuery): Promise<Tutor[]> => {
    const response = await apiClient.get<Tutor[]>('/tutors', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Tutor> => {
    const response = await apiClient.get<Tutor>(`/tutors/${id}`);
    return response.data;
  },

  create: async (data: CreateTutorDto): Promise<Tutor> => {
    const response = await apiClient.post<Tutor>('/tutors', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTutorDto): Promise<Tutor> => {
    const response = await apiClient.put<Tutor>(`/tutors/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tutors/${id}`);
  },
};


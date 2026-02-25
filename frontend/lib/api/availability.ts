import apiClient from '../api-client';

export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: number | null;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate: string | null;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityDto {
  tutorId?: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  specificDate?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
}

export interface UpdateAvailabilityDto {
  tutorId?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isRecurring?: boolean;
  specificDate?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
}

export interface SearchAvailabilityQuery {
  tutorId?: string;
  dayOfWeek?: number;
  startDate?: string;
  endDate?: string;
}

export const availabilityApi = {
  getAll: async (query?: SearchAvailabilityQuery): Promise<Availability[]> => {
    const response = await apiClient.get<Availability[]>('/availability', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Availability> => {
    const response = await apiClient.get<Availability>(`/availability/${id}`);
    return response.data;
  },

  create: async (data: CreateAvailabilityDto): Promise<Availability> => {
    const response = await apiClient.post<Availability>('/availability', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAvailabilityDto): Promise<Availability> => {
    const response = await apiClient.patch<Availability>(`/availability/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/availability/${id}`);
  },
};

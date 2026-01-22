import apiClient from '../api-client';

export interface Site {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteDto {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  active?: boolean;
}

export interface UpdateSiteDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  active?: boolean;
}

export interface SearchSitesQuery {
  active?: boolean;
  city?: string;
  state?: string;
}

export const sitesApi = {
  getAll: async (query?: SearchSitesQuery): Promise<Site[]> => {
    const response = await apiClient.get<Site[]>('/sites', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Site> => {
    const response = await apiClient.get<Site>(`/sites/${id}`);
    return response.data;
  },

  create: async (data: CreateSiteDto): Promise<Site> => {
    const response = await apiClient.post<Site>('/sites', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSiteDto): Promise<Site> => {
    const response = await apiClient.put<Site>(`/sites/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sites/${id}`);
  },
};

import apiClient from '../api-client';

export type PartnerType = 'School' | 'Co' | 'Organization' | 'Other';

export interface Partner {
  id: string;
  name: string;
  type?: PartnerType | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerDto {
  name: string;
  type?: PartnerType;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  active?: boolean;
}

export interface UpdatePartnerDto {
  name?: string;
  type?: PartnerType;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  active?: boolean;
}

export interface SearchPartnersQuery {
  active?: boolean;
  type?: PartnerType;
}

export const partnersApi = {
  getAll: async (query?: SearchPartnersQuery): Promise<Partner[]> => {
    const response = await apiClient.get<Partner[]>('/partners', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Partner> => {
    const response = await apiClient.get<Partner>(`/partners/${id}`);
    return response.data;
  },

  create: async (data: CreatePartnerDto): Promise<Partner> => {
    const response = await apiClient.post<Partner>('/partners', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePartnerDto): Promise<Partner> => {
    const response = await apiClient.put<Partner>(`/partners/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/partners/${id}`);
  },
};

import { api } from '@/lib/api';
import type { Cotisation } from '@/types/cotisation';

export const cotisationsService = {
  getDisponibles: async (): Promise<Cotisation[]> => {
    const { data } = await api.get<{ success: boolean; data: Cotisation[] }>('/cotisations/disponibles');
    return data.data;
  },

  getById: async (id: number): Promise<Cotisation> => {
    const { data } = await api.get<{ success: boolean; data: Cotisation }>(`/cotisations/disponibles/${id}`);
    return data.data;
  },
};

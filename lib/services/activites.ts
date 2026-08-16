import { api } from '@/lib/api';
import type { Activite } from '@/types/activite';
import type { MaParticipation } from '@/types/participation';

export const activitesService = {
  getAll: async (): Promise<Activite[]> => {
    const { data } = await api.get<Activite[]>('/activites');
    return data;
  },

  getById: async (id: number): Promise<Activite> => {
    const { data } = await api.get<Activite>(`/activites/${id}`);
    return data;
  },
};

export const participationsService = {
  /** Liste des ids d'activités auxquelles le membre connecté participe déjà. */
  getMyParticipationIds: async (): Promise<number[]> => {
    const { data } = await api.get<number[]>('/participations/my-ids');
    return data;
  },

  getMyParticipations: async (limit = 100): Promise<MaParticipation[]> => {
    const { data } = await api.get<{ data: MaParticipation[] }>('/participations/me', {
      params: { limit },
    });
    return data.data;
  },

  participate: async (activiteId: number, payload?: { montant_declare?: number; contribution?: string }) => {
    const { data } = await api.post(`/participations/${activiteId}`, payload ?? {});
    return data;
  },

  cancel: async (activiteId: number) => {
    const { data } = await api.delete(`/participations/${activiteId}`);
    return data;
  },
};

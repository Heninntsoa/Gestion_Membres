import { api } from '@/lib/api';
import type { Commentaire } from '@/types/commentaire';
import type { PublicationsResponse } from '@/types/publication';

export const publicationsService = {
  getAll: async (page = 1, limit = 10): Promise<PublicationsResponse> => {
    const { data } = await api.get<PublicationsResponse>('/publications', {
      params: { page, limit },
    });
    return data;
  },

  /** Toggle like/unlike — l'API attend l'id du membre dans l'URL. */
  toggleLike: async (publicationId: number, membreId: number) => {
    const { data } = await api.post(`/publications/${publicationId}/like/${membreId}`);
    return data;
  },

  getComments: async (publicationId: number): Promise<Commentaire[]> => {
    const { data } = await api.get<{ success: boolean; data: Commentaire[] }>(
      `/publications/${publicationId}/commentaires`
    );
    return data.data;
  },

  addComment: async (publicationId: number, contenu: string): Promise<Commentaire> => {
    const { data } = await api.post<{ success: boolean; data: Commentaire }>(
      `/publications/${publicationId}/commentaires`,
      { contenu }
    );
    return data.data;
  },

  deleteComment: async (commentId: number) => {
    const { data } = await api.delete(`/commentaires/${commentId}`);
    return data;
  },
};

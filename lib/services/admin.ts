import { api } from '@/lib/api';
import type { Membre } from '@/types/membre';
import type { Activite } from '@/types/activite';
import type { Publication, PublicationsResponse } from '@/types/publication';
import type { Cotisation } from '@/types/cotisation';
import type { Paiement } from '@/types/paiement';
import type { MaParticipation } from '@/types/participation';
import type { Commentaire } from '@/types/commentaire';
import type { AppNotification } from '@/types/notification';

// ──────────────────────────────────────────────
// Types partagés
// ──────────────────────────────────────────────

export interface AdminMembreListItem {
  id: number;
  matricule: string;
  nom_complet: string;
  email: string;
  telephone: string | null;
  mention: string | null;
  parcours: string | null;
  niveau: string | null;
  date_naissance: string | null;
  photo_identite: string | null;
  sexe: string;
  cin: string | null;
  statut: string;
  is_active: number;
  active_par: number | null;
  active_par_nom: string | null;
  type_membre: string;
  role: string;
  categorie: string | null;
  date_adhesion: string | null;
  profession: string | null;
  adresse: string | null;
  created_at: string;
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AdminMembresResponse {
  data: AdminMembreListItem[];
  pagination: AdminPagination;
}

export interface AdminStats {
  total: number;
  actifs: number;
  en_attente: number;
  desactives: number;
  refuses: number;
  par_role: { role: string; count: number }[];
}

export type FilterStatus = '' | '0' | '1' | '2' | '3';

// ──────────────────────────────────────────────
// Types admin – Activités
// ──────────────────────────────────────────────

export interface AdminActiviteListItem {
  id: number;
  titre: string;
  description: string | null;
  image: string | null;
  date_debut: string;
  date_fin: string | null;
  lieu: string | null;
  type_activite: string;
  montant: string | null;
  statut: string | null;
  is_public: number | null;
  created_by: number;
  createur?: string;
  ordre_affichage: number;
  mise_en_avant: number;
}

export interface AdminActivitesResponse {
  data: AdminActiviteListItem[];
  pagination: AdminPagination;
}

export interface AdminActiviteFormPayload {
  titre: string;
  description?: string;
  date_debut: string;
  date_fin?: string;
  lieu?: string;
  type_activite?: string;
  montant?: string;
  statut?: string;
  is_public?: number;
  mise_en_avant?: number;
  image?: { uri: string; name: string; type: string } | null;
}

// ──────────────────────────────────────────────
// Types admin – Participations
// ──────────────────────────────────────────────

export interface AdminParticipant {
  id: number;
  statut: string;
  created_at: string;
  montant_declare: string | null;
  contribution: string | null;
  qr_token: string | null;
  qr_used: number;
  qr_scanned_at: string | null;
  membre_id: number;
  nom_complet: string;
  email: string | null;
  photo_identite: string | null;
  matricule: string | null;
  activite_id: number;
  titre: string;
}

// ──────────────────────────────────────────────
// Types admin – Paiements
// ──────────────────────────────────────────────

export interface AdminPaiementListItem {
  id: number;
  membre_id: number;
  nom_complet?: string;
  email?: string;
  cotisation_id: number;
  cotisation_nom?: string;
  mode_paiement_id: number;
  mode_nom?: string;
  montant_attendu: string;
  montant_paye: string;
  difference: string;
  reference_transfert: string;
  preuve_image: string | null;
  statut: string;
  commentaire_admin: string | null;
  date_validation: string | null;
  created_at: string;
}

export interface AdminPaiementsResponse {
  data: AdminPaiementListItem[];
  pagination: AdminPagination;
}

// ──────────────────────────────────────────────
// Service admin
// ──────────────────────────────────────────────

export const adminService = {
  // ── Membres ────────────────────────────────

  getMembres: async (params: {
    page?: number;
    limit?: number;
    recherche?: string;
    is_active?: FilterStatus;
  }): Promise<AdminMembresResponse> => {
    const { data } = await api.get<AdminMembresResponse>('/auth/admin', { params });
    return data;
  },

  activateMembre: async (membreId: number) => {
    const { data } = await api.post<{ success: boolean; data: { user: Membre } }>('/auth/active', { id: membreId });
    return data;
  },

  deactivateMembre: async (membreId: number) => {
    const { data } = await api.post<{ success: boolean; data: { user: Membre } }>('/auth/desactive', { id: membreId });
    return data;
  },

  refuseMembre: async (membreId: number) => {
    const { data } = await api.post<{ success: boolean; data: { user: Membre } }>('/auth/refuse', { id: membreId });
    return data;
  },

  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<{ success: boolean; data: AdminStats }>('/auth/stats');
    return data.data;
  },

  // ── Activités ──────────────────────────────

  getActivites: async (params: {
    page?: number;
    limit?: number;
    recherche?: string;
  }): Promise<AdminActivitesResponse> => {
    const { data } = await api.get<AdminActivitesResponse>('/activites/admin', { params });
    return data;
  },

  createActivite: async (payload: AdminActiviteFormPayload) => {
    const formData = new FormData();
    formData.append('titre', payload.titre);
    if (payload.description) formData.append('description', payload.description);
    formData.append('date_debut', payload.date_debut);
    if (payload.date_fin) formData.append('date_fin', payload.date_fin);
    if (payload.lieu) formData.append('lieu', payload.lieu);
    if (payload.type_activite) formData.append('type_activite', payload.type_activite);
    if (payload.montant) formData.append('montant', payload.montant);
    if (payload.statut) formData.append('statut', payload.statut);
    if (payload.is_public !== undefined) formData.append('is_public', String(payload.is_public));
    if (payload.mise_en_avant !== undefined) formData.append('mise_en_avant', String(payload.mise_en_avant));
    if (payload.image) {
      // @ts-expect-error — format attendu par React Native pour un fichier multipart
      formData.append('image', {
        uri: payload.image.uri,
        name: payload.image.name,
        type: payload.image.type,
      });
    }
    const { data } = await api.post('/activites', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateActivite: async (id: number, payload: AdminActiviteFormPayload) => {
    const formData = new FormData();
    formData.append('titre', payload.titre);
    if (payload.description) formData.append('description', payload.description);
    formData.append('date_debut', payload.date_debut);
    if (payload.date_fin) formData.append('date_fin', payload.date_fin);
    if (payload.lieu) formData.append('lieu', payload.lieu);
    if (payload.type_activite) formData.append('type_activite', payload.type_activite);
    if (payload.montant) formData.append('montant', payload.montant);
    if (payload.statut) formData.append('statut', payload.statut);
    if (payload.is_public !== undefined) formData.append('is_public', String(payload.is_public));
    if (payload.mise_en_avant !== undefined) formData.append('mise_en_avant', String(payload.mise_en_avant));
    if (payload.image) {
      // @ts-expect-error — format attendu par React Native pour un fichier multipart
      formData.append('image', {
        uri: payload.image.uri,
        name: payload.image.name,
        type: payload.image.type,
      });
    }
    const { data } = await api.put(`/activites/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteActivite: async (id: number) => {
    const { data } = await api.delete(`/activites/${id}`);
    return data;
  },

  // ── Participations ─────────────────────────

  getParticipantsByActivite: async (activiteId: number): Promise<AdminParticipant[]> => {
    const { data } = await api.get<{ data: AdminParticipant[] }>(`/participations/admin/${activiteId}`);
    return data.data;
  },

  validateParticipation: async (participationId: number, montantValide?: number) => {
    const { data } = await api.put(`/participations/${participationId}/valider`, {
      montant_valide: montantValide,
    });
    return data;
  },

  markPresent: async (participationId: number) => {
    const { data } = await api.put(`/participations/${participationId}/present`);
    return data;
  },

  markAbsent: async (participationId: number) => {
    const { data } = await api.put(`/participations/${participationId}/absent`);
    return data;
  },

  // ── Publications ───────────────────────────

  getPublications: async (params: {
    page?: number;
    limit?: number;
  }): Promise<PublicationsResponse> => {
    const { data } = await api.get<PublicationsResponse>('/publications/admin', { params });
    return data;
  },

  getPublicationById: async (id: number): Promise<Publication> => {
    const { data } = await api.get<Publication>(`/publications/${id}`);
    return data;
  },

  createPublication: async (payload: { contenu: string; image?: { uri: string; name: string; type: string } | null }) => {
    const formData = new FormData();
    formData.append('contenu', payload.contenu);
    if (payload.image) {
      // @ts-expect-error — format attendu par React Native pour un fichier multipart
      formData.append('image', {
        uri: payload.image.uri,
        name: payload.image.name,
        type: payload.image.type,
      });
    }
    const { data } = await api.post('/publications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updatePublication: async (id: number, payload: { contenu: string; image?: { uri: string; name: string; type: string } | null }) => {
    const formData = new FormData();
    formData.append('contenu', payload.contenu);
    if (payload.image) {
      // @ts-expect-error — format attendu par React Native pour un fichier multipart
      formData.append('image', {
        uri: payload.image.uri,
        name: payload.image.name,
        type: payload.image.type,
      });
    }
    const { data } = await api.put(`/publications/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deletePublication: async (id: number) => {
    const { data } = await api.delete(`/publications/${id}`);
    return data;
  },

  // ── Commentaires ───────────────────────────

  getCommentaires: async (publicationId: number): Promise<Commentaire[]> => {
    const { data } = await api.get<{ success: boolean; data: Commentaire[] }>(
      `/publications/${publicationId}/commentaires`
    );
    return data.data;
  },

  deleteCommentaire: async (commentId: number) => {
    const { data } = await api.delete(`/commentaires/${commentId}`);
    return data;
  },

  // ── Cotisations ────────────────────────────

  getCotisations: async (): Promise<Cotisation[]> => {
    const { data } = await api.get<{ success: boolean; data: Cotisation[] }>('/cotisations');
    return data.data;
  },

  createCotisation: async (payload: {
    titre: string;
    description?: string;
    montant: string;
    date_debut?: string;
    date_fin?: string;
    date_limite?: string;
    statut?: string;
    type_nom?: string;
    periodicite?: string;
  }) => {
    const { data } = await api.post('/cotisations', payload);
    return data;
  },

  updateCotisation: async (id: number, payload: {
    titre: string;
    description?: string;
    montant: string;
    date_debut?: string;
    date_fin?: string;
    date_limite?: string;
    statut?: string;
    type_nom?: string;
    periodicite?: string;
  }) => {
    const { data } = await api.put(`/cotisations/${id}`, payload);
    return data;
  },

  deleteCotisation: async (id: number) => {
    const { data } = await api.delete(`/cotisations/${id}`);
    return data;
  },

  // ── Paiements ──────────────────────────────

  getPaiements: async (params: {
    page?: number;
    limit?: number;
    recherche?: string;
    statut?: string;
    cotisation_id?: string;
  }): Promise<AdminPaiementsResponse> => {
    const { data } = await api.get<AdminPaiementsResponse>('/paiements', { params });
    return data;
  },

  getPaiementById: async (id: number): Promise<AdminPaiementListItem> => {
    const { data } = await api.get<{ data: AdminPaiementListItem }>(`/paiements/${id}`);
    return data.data;
  },

  validatePaiement: async (id: number) => {
    const { data } = await api.put(`/paiements/${id}/valider`);
    return data;
  },

  refusePaiement: async (id: number, commentaireAdmin: string) => {
    const { data } = await api.put(`/paiements/${id}/refuser`, {
      commentaire: { commentaire_admin: commentaireAdmin },
    });
    return data;
  },

  // ── Notifications ──────────────────────────

  getNotifications: async (): Promise<AppNotification[]> => {
    const { data } = await api.get<{ success: boolean; data: AppNotification[] }>('/notifications');
    return data.data;
  },
};

import { api } from '@/lib/api';
import type { Membre } from '@/types/membre';

export interface UpdateInfoPayload {
  id: number;
  nom_complet: string;
  email: string;
  telephone: string;
  mention: string | null;
  parcours: string | null;
  niveau: string | null;
  date_naissance: string | null;
  sexe: string;
  cin: string | null;
  type_membre: string;
  role: string;
  is_active: 0 | 1;
  date_adhesion: string | null;
  categorie: string | null;
  profession: string | null;
  photo_identite: string | null;
  /**
   * Le backend recalcule un hash à chaque appel même si le mot de passe
   * n'est pas réellement mis à jour côté membre — champ requis pour éviter
   * une erreur bcrypt côté serveur, mais jamais persisté.
   */
  password: string;
}

export const membreService = {
  updateInfo: async (payload: UpdateInfoPayload): Promise<Membre> => {
    const { data } = await api.put<{ success: boolean; data: Membre }>('/auth/update-info', payload);
    return data.data;
  },

  changePassword: async (membreId: number, motDePasse: string) => {
    const { data } = await api.put<{ success: boolean; data: { user: Membre } }>('/auth/password-update', {
      id: membreId,
      mot_de_passe: motDePasse,
    });
    return data;
  },

  updateProfilePhoto: async (membreId: number, photo: { uri: string; name: string; type: string }) => {
    const formData = new FormData();
    formData.append('id', String(membreId));
    // @ts-expect-error — format attendu par React Native pour un fichier multipart
    formData.append('photo_identite', {
      uri: photo.uri,
      name: photo.name,
      type: photo.type,
    });

    const { data } = await api.put('/auth/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

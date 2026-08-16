import { api } from '@/lib/api';
import type { ModePaiement, Paiement } from '@/types/paiement';

export const modesPaiementsService = {
  getAll: async (): Promise<ModePaiement[]> => {
    const { data } = await api.get<{ success: boolean; data: ModePaiement[] }>('/modes-paiements');
    return data.data;
  },
};

export interface DeclarerPaiementPayload {
  cotisation_id: number;
  mode_paiement_id: number;
  montant_paye: string;
  reference_transfert: string;
  preuve?: { uri: string; name: string; type: string } | null;
}

export const paiementsService = {
  getMyPayments: async (): Promise<Paiement[]> => {
    const { data } = await api.get<{ data: Paiement[] }>('/paiements/mes-paiements');
    return data.data;
  },

  declarer: async (payload: DeclarerPaiementPayload) => {
    const formData = new FormData();
    formData.append('cotisation_id', String(payload.cotisation_id));
    formData.append('mode_paiement_id', String(payload.mode_paiement_id));
    formData.append('montant_paye', payload.montant_paye);
    formData.append('reference_transfert', payload.reference_transfert);

    if (payload.preuve) {
      // @ts-expect-error — format attendu par React Native pour un fichier multipart
      formData.append('preuve', {
        uri: payload.preuve.uri,
        name: payload.preuve.name,
        type: payload.preuve.type,
      });
    }

    const { data } = await api.post('/paiements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

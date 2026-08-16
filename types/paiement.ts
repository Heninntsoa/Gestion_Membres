export interface ModePaiement {
  id: number;
  nom: string;
  description: string | null;
  numero_compte: string;
  titulaire: string;
  actif: number;
}

export type StatutPaiement = 'en_attente' | 'valide' | 'refuse';

export interface Paiement {
  id: number;
  membre_id: number;
  cotisation_id: number;
  mode_paiement_id: number;
  montant_attendu: string;
  montant_paye: string;
  difference: string;
  reference_transfert: string;
  preuve_image: string | null;
  statut: StatutPaiement;
  commentaire_admin: string | null;
  date_validation: string | null;
  created_at: string;
  // champs enrichis retournés par GET /paiements/mes-paiements (jointures)
  cotisation_nom?: string;
  periodicite?: string;
  mode_id?: number;
  mode_nom?: string;
}

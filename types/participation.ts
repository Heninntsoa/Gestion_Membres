export type StatutParticipation = 'inscrit' | 'present' | 'absent' | 'en_attente' | 'valide' | 'annule';

export interface MaParticipation {
  id: number;
  statut: StatutParticipation;
  created_at: string;
  montant_declare: string | null;
  contribution: string | null;
  qr_token: string | null;
  qr_used: number;
  qr_scanned_at: string | null;
  activitie_id: number;
  titre: string;
  description: string | null;
  image: string | null;
  lieu: string | null;
  date_debut: string;
  date_fin: string | null;
  type_activite: string;
  montant: string | null;
}

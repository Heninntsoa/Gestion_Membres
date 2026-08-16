export type TypeActivite = 'gratuit' | 'payant' | 'prise_en_charge';
export type StatutActivite = 'planifiee' | 'terminee' | 'annulee' | null;

export interface Activite {
  id: number;
  titre: string;
  description: string | null;
  image: string | null;
  date_debut: string;
  date_fin: string | null;
  lieu: string | null;
  type_activite: TypeActivite;
  montant: string | null;
  statut: StatutActivite;
  is_public: number | null;
  created_by: number;
  createur?: string;
  ordre_affichage: number;
  mise_en_avant: number;
}

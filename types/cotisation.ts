export type StatutCotisation = 'ouverte' | 'cloturee' | 'archivee';
export type Periodicite = 'mensuelle' | 'annuelle' | 'unique';

export interface Cotisation {
  id: number;
  titre: string;
  description: string | null;
  montant: string;
  date_debut: string | null;
  date_fin: string | null;
  date_limite: string | null;
  statut: StatutCotisation;
  type_nom: string;
  periodicite: Periodicite;
}

export interface CotisationType {
  id: number;
  nom: string;
  description: string | null;
  periodicite: Periodicite;
  obligatoire: boolean;
  actif: boolean;
}

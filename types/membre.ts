// Types basés sur la table `membres` du backend yalim-api

export type Role = 'membre' | 'admin' | 'communication' | 'tresor';
export type Sexe = 'Masculin' | 'Féminin';
export type TypeMembre = 'nouveau' | 'ancien';
export type StatutMembre = 'actif' | 'inactif' | 'suspendu' | '';

export interface Membre {
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
  sexe: Sexe;
  cin: string | null;
  statut: StatutMembre;
  type_membre: TypeMembre;
  role: Role;
  is_active: 0 | 1;
  date_adhesion: string | null;
  categorie: string | null;
  profession: string | null;
}

export interface LoginResponse {
  token: string;
  user: Membre;
}

export interface RegisterPayload {
  nom_complet: string;
  email: string;
  telephone: string;
  mention?: string;
  parcours?: string;
  niveau?: string;
  date_naissance: string; // format YYYY-MM-DD
  sexe: Sexe;
  cin: string;
  password: string;
  type_membre: TypeMembre;
}

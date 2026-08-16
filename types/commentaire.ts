export interface Commentaire {
  id: number;
  contenu: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

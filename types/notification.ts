export interface AppNotification {
  id: number;
  membre_id: number;
  titre: string;
  message: string;
  type: string;
  reference_id: number | null;
  lien: string | null;
  is_read: number;
  created_at: string;
}

import type { Href } from 'expo-router';

/**
 * Résout la route interne de l'app à partir du `lien` renvoyé par le backend
 * dans les notifications (ex: /espace-membre/admin/membres, /espace-membre/activites).
 * Renvoie null si aucun écran ne correspond.
 */
export function resolveNotificationRoute(
  lien?: string | null,
  referenceId?: number | string | null
): Href | null {
  if (!lien) return null;

  // Routes admin
  if (lien.includes('/admin/membres')) return '/admin';
  if (lien.includes('/admin/paiements')) return '/admin/paiements';
  if (lien.includes('/admin/cotisations')) return '/admin/cotisations';
  if (lien.includes('/admin/publications')) return '/admin/publications';
  if (lien.includes('/admin/activites')) return '/admin/activites';
  if (lien.includes('/admin/notifications')) return '/admin/notifications';

  // Routes membres (tabs)
  if (lien.includes('/activites')) {
    return referenceId ? `/activite/${referenceId}` : '/(tabs)/activites';
  }

  if (lien.includes('/publications')) return '/(tabs)/publications';
  if (lien.includes('/cotisations')) return '/(tabs)/cotisations';
  if (lien.includes('/paiements')) return '/paiements/historique';

  // Liens génériques vers l'espace membre → accueil
  if (lien.startsWith('/espace-membre')) return '/(tabs)';

  return null;
}

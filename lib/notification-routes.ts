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

  // Notifications destinées aux admins → gestion des membres (écran admin mobile)
  if (lien.includes('/admin/membres')) return '/admin';

  // Activités : ouvrir le détail si on a une référence, sinon la liste
  if (lien.includes('/activites')) {
    return referenceId ? `/activite/${referenceId}` : '/(tabs)/activites';
  }

  if (lien.includes('/publications')) return '/(tabs)/publications';

  if (lien.includes('/paiements')) return '/(tabs)/cotisations';

  // Liens génériques vers l'espace membre → accueil
  if (lien.startsWith('/espace-membre')) return '/(tabs)';

  return null;
}

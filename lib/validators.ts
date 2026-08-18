/**
 * Utilitaires de validation et de filtrage de saisie, réutilisés dans les
 * formulaires (inscription, profil...) pour empêcher la saisie de caractères
 * invalides plutôt que de simplement afficher une erreur après coup.
 */

/** Ne garde que les lettres (accents compris), espaces, apostrophes et tirets. */
export function filterLettersOnly(text: string): string {
  return text.replace(/[^\p{L}\s'-]/gu, '');
}

/** Ne garde que les chiffres (utile pour CIN, téléphone sans indicatif). */
export function filterDigitsOnly(text: string): string {
  return text.replace(/[^0-9]/g, '');
}

/** Ne garde que les chiffres, en autorisant un '+' unique en tout début (indicatif téléphonique). */
export function filterPhone(text: string): string {
  const hasPlus = text.startsWith('+');
  const digits = text.replace(/[^0-9]/g, '');
  return hasPlus ? `+${digits}` : digits;
}

export const validators = {
  lettersOnly: (message = 'Lettres uniquement, sans chiffres.') => ({
    validate: (value: string) =>
      /^[\p{L}\s'-]+$/u.test(value.trim()) || message,
  }),
  digitsOnly: (message = 'Chiffres uniquement.') => ({
    validate: (value: string) => /^[0-9]+$/.test(value.trim()) || message,
  }),
  phone: (message = 'Numéro invalide (chiffres uniquement, 7 à 15 chiffres).') => ({
    validate: (value: string) =>
      /^\+?[0-9]{7,15}$/.test(value.trim()) || message,
  }),
};

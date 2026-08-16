import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/design';
import type { Activite } from '@/types/activite';

interface ActivityCardProps {
  activite: Activite;
  isRegistered: boolean;
  onPress?: () => void;
  onParticipatePress?: () => void;
  loading?: boolean;
}

function formatDateBadge(dateStr: string) {
  const d = new Date(dateStr);
  const jour = d.toLocaleDateString('fr-FR', { day: '2-digit' });
  const mois = d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
  return `${jour} ${mois}`;
}

function formatHeure(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function ActivityCard({
  activite,
  isRegistered,
  onPress,
  onParticipatePress,
  loading,
}: ActivityCardProps) {
  const isAnnulee = activite.statut === 'annulee';
  const isTerminee = activite.statut === 'terminee';

  const actionLabel = isRegistered
    ? 'Inscrit'
    : activite.type_activite === 'payant'
      ? 'Participer'
      : "S'inscrire";

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.imageWrapper}>
        {activite.image ? (
          <Image source={{ uri: activite.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <MaterialIcons name="eco" size={32} color={colors.outline} />
          </View>
        )}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{formatDateBadge(activite.date_debut)}</Text>
        </View>
        {isAnnulee && (
          <View style={[styles.statusBadge, { backgroundColor: colors.error }]}>
            <Text style={styles.statusBadgeText}>Annulée</Text>
          </View>
        )}
        {isTerminee && (
          <View style={[styles.statusBadge, { backgroundColor: colors.outline }]}>
            <Text style={styles.statusBadgeText}>Terminée</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {activite.titre}
        </Text>
        {!!activite.lieu && (
          <View style={styles.metaRow}>
            <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {activite.lieu}
            </Text>
          </View>
        )}
        <View style={styles.metaRow}>
          <MaterialIcons name="schedule" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{formatHeure(activite.date_debut)}</Text>
          {activite.type_activite === 'payant' && !!activite.montant && (
            <Text style={styles.montant}>· {Number(activite.montant).toLocaleString('fr-FR')} Ar</Text>
          )}
        </View>

        {!isAnnulee && !isTerminee && (
          <TouchableOpacity
            disabled={isRegistered || loading}
            onPress={onParticipatePress}
            style={[styles.actionBtn, isRegistered && styles.actionBtnDone]}>
            {isRegistered && (
              <MaterialIcons name="check" size={16} color={colors.statusValidated} style={{ marginRight: 4 }} />
            )}
            <Text style={[styles.actionText, isRegistered && styles.actionTextDone]}>
              {loading ? '...' : actionLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageWrapper: {
    height: 140,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateBadgeText: {
    ...typography.labelSm,
    color: colors.textPrimary,
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    ...typography.labelSm,
    color: colors.white,
  },
  body: {
    padding: spacing.sm + 4,
    gap: 4,
  },
  title: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  montant: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  actionBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusValidated,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionBtnDone: {
    backgroundColor: colors.surfaceContainer,
  },
  actionText: {
    ...typography.labelMd,
    color: colors.white,
  },
  actionTextDone: {
    color: colors.statusValidated,
  },
});

import { StyleSheet } from 'react-native';
import type { Palette } from '@/constants/design';
import { radius, spacing, typography } from '@/constants/design';

export const makeStyles = (colors: Palette) =>
  StyleSheet.create({
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
      backgroundColor: '#FFFFFF',
      borderRadius: radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    dateBadgeText: {
      ...typography.labelSm,
      color: '#1A1A1A',
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
      color: colors.onPrimary,
    },
    actionTextDone: {
      color: colors.statusValidated,
    },
  });

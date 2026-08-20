import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/design';
import { styles, type BannerType } from '@/styles/components/ui/error-banner.styles';

interface MessageBannerProps {
  /** Message displayed to the user. */
  message: string;
  /** Banner type — controls icon and colors. Defaults to `"error"`. */
  type?: BannerType;
  /** Label for the action button (defaults to "Réessayer"). */
  actionLabel?: string;
  /** Called when the user taps the action button. */
  onAction?: () => void;
  /** Called when the user taps the close (✕) button. */
  onDismiss?: () => void;
}

const TYPE_CONFIG: Record<BannerType, { icon: string; iconBg: string; iconColor: string; closeColor: string }> = {
  error: {
    icon: 'error-outline',
    iconBg: colors.error,
    iconColor: colors.onError,
    closeColor: colors.error,
  },
  success: {
    icon: 'check-circle',
    iconBg: colors.statusValidated,
    iconColor: colors.white,
    closeColor: colors.statusValidated,
  },
  info: {
    icon: 'info',
    iconBg: colors.primary,
    iconColor: colors.onPrimary,
    closeColor: colors.primary,
  },
  warning: {
    icon: 'warning',
    iconBg: colors.statusPending,
    iconColor: colors.white,
    closeColor: colors.statusPending,
  },
};

/**
 * Generic message banner with an icon, message, optional action button and
 * close (✕) button. Supports `error | success | info | warning` types.
 */
export function MessageBanner({
  message,
  type = 'error',
  actionLabel = 'Réessayer',
  onAction,
  onDismiss,
}: MessageBannerProps) {
  const cfg = TYPE_CONFIG[type];

  return (
    <View style={[styles.banner, styles[type]]}>
      {/* Icon circle */}
      <View style={[styles.iconContainer, { backgroundColor: cfg.iconBg }]}>
        <MaterialIcons name={cfg.icon as any} size={20} color={cfg.iconColor} />
      </View>

      {/* Text + actions */}
      <View style={styles.content}>
        <Text style={[styles.message, styles[`message_${type}`]]}>{message}</Text>

        {onAction && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: cfg.iconBg }]}
              activeOpacity={0.8}
              onPress={onAction}>
              <Text style={[styles.actionText, { color: cfg.iconColor }]}>{actionLabel}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Close button */}
      {onDismiss && (
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.6}
          onPress={onDismiss}
          accessibilityLabel="Fermer">
          <MaterialIcons name="close" size={18} color={cfg.closeColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

/** Backward-compatible alias. */
export const ErrorBanner = MessageBanner;

import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { radius, spacing, type Palette } from '@/constants/design';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { Role } from '@/types/membre';

type RoleVisual = { label: string; icon: keyof typeof MaterialIcons.glyphMap; bg: string; fg: string };

/** Configuration visuelle par rôle (couleurs dépendantes du thème) */
const makeRoleConfig = (colors: Palette): Record<Role, RoleVisual> => ({
  membre: {
    label: 'Membre',
    icon: 'person',
    bg: colors.badgeNeutralBg,
    fg: colors.badgeNeutralText,
  },
  admin: {
    label: 'Admin',
    icon: 'admin-panel-settings',
    bg: colors.badgeErrorBg,
    fg: colors.badgeErrorText,
  },
  communication: {
    label: 'Communication',
    icon: 'campaign',
    bg: colors.badgeInfoBg,
    fg: colors.badgeInfoText,
  },
  tresor: {
    label: 'Trésor',
    icon: 'account-balance-wallet',
    bg: colors.badgeWarningBg,
    fg: colors.badgeWarningText,
  },
  president: {
    label: 'Président',
    icon: 'emoji-events',
    bg: colors.badgeSuccessBg,
    fg: colors.badgeSuccessText,
  },
});

interface RoleBadgeProps {
  role: Role;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Optional style override */
  style?: ViewStyle;
}

export function RoleBadge({ role, size = 'md', style }: RoleBadgeProps) {
  const { colors } = useAppTheme();
  const config = makeRoleConfig(colors)[role] ?? makeRoleConfig(colors).membre;
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: isSmall ? 3 : 5,
          backgroundColor: config.bg,
          paddingHorizontal: isSmall ? spacing.xs : spacing.sm,
          paddingVertical: isSmall ? 2 : 4,
          borderRadius: radius.full,
        },
        style,
      ]}
    >
      <MaterialIcons name={config.icon} size={isSmall ? 12 : 16} color={config.fg} />
      <Text
        style={{
          color: config.fg,
          fontWeight: '600',
          fontSize: isSmall ? 10 : 12,
          lineHeight: isSmall ? 14 : 16,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}

/** Returns true if the role has admin-level access */
export function hasAdminAccess(role: Role): boolean {
  return ['admin', 'communication', 'tresor', 'president'].includes(role);
}

/** Human-readable label for a role */
const ROLE_LABELS: Record<Role, string> = {
  membre: 'Membre',
  admin: 'Admin',
  communication: 'Communication',
  tresor: 'Trésor',
  president: 'Président',
};

export function getRoleLabel(role: Role): string {
  return ROLE_LABELS[role] ?? role;
}

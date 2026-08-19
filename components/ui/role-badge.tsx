import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { radius, spacing, typography } from '@/constants/design';
import type { Role } from '@/types/membre';

/** Configuration visuelle par rôle */
const ROLE_CONFIG: Record<
  Role,
  { label: string; icon: keyof typeof MaterialIcons.glyphMap; bg: string; fg: string }
> = {
  membre: {
    label: 'Membre',
    icon: 'person',
    bg: '#E5E7EB',
    fg: '#374151',
  },
  admin: {
    label: 'Admin',
    icon: 'admin-panel-settings',
    bg: '#FEE2E2',
    fg: '#991B1B',
  },
  communication: {
    label: 'Communication',
    icon: 'campaign',
    bg: '#DBEAFE',
    fg: '#1E40AF',
  },
  tresor: {
    label: 'Trésor',
    icon: 'account-balance-wallet',
    bg: '#FEF3C7',
    fg: '#92400E',
  },
  president: {
    label: 'Président',
    icon: 'emoji-events',
    bg: '#D1FAE5',
    fg: '#065F46',
  },
};

interface RoleBadgeProps {
  role: Role;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Optional style override */
  style?: ViewStyle;
}

export function RoleBadge({ role, size = 'md', style }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.membre;
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
export function getRoleLabel(role: Role): string {
  return ROLE_CONFIG[role]?.label ?? role;
}

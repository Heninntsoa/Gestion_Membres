import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { colors, typography } from '@/constants/design';

interface AppLogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional container style */
  style?: ViewStyle;
  /** Show subtitle */
  showSubtitle?: boolean;
}

/**
 * Logo textuel amélioré pour IDEM Planète.
 * Style moderne avec icône verte et dégradé subtil.
 */
export function AppLogo({ size = 'md', style, showSubtitle = false }: AppLogoProps) {
  const config = {
    sm: { iconSize: 24, titleSize: 18, subtitleSize: 10, gap: 6 },
    md: { iconSize: 32, titleSize: 24, subtitleSize: 12, gap: 8 },
    lg: { iconSize: 48, titleSize: 36, subtitleSize: 16, gap: 12 },
  }[size];

  return (
    <View
      style={[
        {
          alignItems: 'center',
          gap: config.gap,
        },
        style,
      ]}
    >
      {/* Icône principale */}
      <View
        style={{
          width: config.iconSize * 2.5,
          height: config.iconSize * 2.5,
          borderRadius: config.iconSize * 1.25,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <MaterialIcons name="eco" size={config.iconSize * 1.5} color={colors.white} />
      </View>

      {/* Titre */}
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontSize: config.titleSize,
            fontWeight: '800',
            color: colors.primary,
            letterSpacing: -0.5,
          }}
        >
          IDEM
        </Text>
        <Text
          style={{
            fontSize: config.titleSize * 0.6,
            fontWeight: '600',
            color: colors.primaryContainer,
            letterSpacing: 2,
            marginTop: -2,
          }}
        >
          PLANÈTE
        </Text>
      </View>

      {/* Sous-titre optionnel */}
      {showSubtitle && (
        <Text
          style={{
            fontSize: config.subtitleSize,
            color: colors.textSecondary,
            fontWeight: '400',
            letterSpacing: 0.5,
          }}
        >
          Ensemble pour la planète
        </Text>
      )}
    </View>
  );
}

/**
 * Version compacte du logo pour les en-têtes et la barre de navigation.
 */
export function AppLogoCompact({ style }: { style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="eco" size={20} color={colors.white} />
      </View>
      <View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '800',
            color: colors.primary,
            lineHeight: 18,
          }}
        >
          IDEM
        </Text>
        <Text
          style={{
            fontSize: 9,
            fontWeight: '600',
            color: colors.primaryContainer,
            letterSpacing: 1.5,
            lineHeight: 11,
          }}
        >
          PLANÈTE
        </Text>
      </View>
    </View>
  );
}

import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/design';
import type { Publication } from '@/types/publication';

interface PublicationCardProps {
  publication: Publication;
  onToggleLike?: () => void;
  onCommentPress?: () => void;
  compact?: boolean;
}

export function PublicationCard({ publication, onToggleLike, onCommentPress, compact }: PublicationCardProps) {
  const date = new Date(publication.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={18} color={colors.outline} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.author} numberOfLines={1}>
            {publication.user.name ?? 'IDEM Planète'}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={compact ? 3 : undefined}>
        {publication.content}
      </Text>

      {!!publication.image && <Image source={{ uri: publication.image }} style={styles.image} />}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={onToggleLike}>
          <MaterialIcons
            name={publication.liked ? 'favorite' : 'favorite-border'}
            size={18}
            color={publication.liked ? colors.error : colors.textSecondary}
          />
          <Text style={styles.actionText}>{publication.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={onCommentPress}>
          <MaterialIcons name="chat-bubble-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.actionText}>{publication.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm + 4,
    gap: 8,
  },
  cardCompact: {
    width: 240,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  author: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  date: {
    ...typography.labelSm,
    color: colors.textSecondary,
  },
  content: {
    ...typography.bodySm,
    color: colors.textPrimary,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    marginTop: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  actionText: {
    ...typography.labelSm,
    color: colors.textSecondary,
  },
});

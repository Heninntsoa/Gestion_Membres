import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import type { Publication } from '@/types/publication';

import { makeStyles } from '@/styles/components/publication-card.styles';
interface PublicationCardProps {
  publication: Publication;
  onToggleLike?: () => void;
  onCommentPress?: () => void;
  compact?: boolean;
}

export function PublicationCard({ publication, onToggleLike, onCommentPress, compact }: PublicationCardProps) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
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


import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View,  } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PublicationCard } from '@/components/publication-card';
import { colors, spacing } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { publicationsService } from '@/lib/services/publications';
import { useAuthStore } from '@/store/auth-store';
import type { Commentaire } from '@/types/commentaire';
import type { Publication } from '@/types/publication';

import { styles } from '@/styles/app/publication/[id].styles';
function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export default function PublicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const publicationId = Number(id);
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [publication, setPublication] = useState<Publication | null>(null);
  const [comments, setComments] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const [pubsRes, commentsRes] = await Promise.all([
        publicationsService.getAll(1, 50),
        publicationsService.getComments(publicationId),
      ]);
      const found = pubsRes.data.find((p) => p.id === publicationId) ?? null;
      setPublication(found);
      setComments(commentsRes);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger la publication.'));
    } finally {
      setLoading(false);
    }
  }, [publicationId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleLike = async () => {
    if (!user || !publication) return;
    setPublication({
      ...publication,
      liked: !publication.liked,
      likes: publication.liked ? publication.likes - 1 : publication.likes + 1,
    });
    try {
      await publicationsService.toggleLike(publication.id, user.id);
    } catch {
      setPublication(publication);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    setErrorMsg(null);
    try {
      const comment = await publicationsService.addComment(publicationId, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment('');
      if (publication) {
        setPublication({ ...publication, commentsCount: publication.commentsCount + 1 });
      }
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Impossible d'ajouter le commentaire."));
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    try {
      await publicationsService.deleteComment(commentId);
      if (publication) {
        setPublication({ ...publication, commentsCount: Math.max(0, publication.commentsCount - 1) });
      }
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de supprimer ce commentaire.'));
      load();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publication</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <FlatList
          data={comments}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={{ gap: spacing.md, marginBottom: spacing.sm }}>
              {!!publication && (
                <PublicationCard publication={publication} onToggleLike={handleToggleLike} />
              )}
              {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
              <Text style={styles.commentsTitle}>
                {comments.length} commentaire{comments.length > 1 ? 's' : ''}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun commentaire. Soyez le premier à réagir !</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <View style={styles.commentAvatar}>
                <MaterialIcons name="person" size={16} color={colors.outline} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor}>{item.user.name}</Text>
                  <Text style={styles.commentText}>{item.contenu}</Text>
                </View>
                <View style={styles.commentMetaRow}>
                  <Text style={styles.commentDate}>{timeAgo(item.createdAt)}</Text>
                  {item.user.id === user?.id && (
                    <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                      <Text style={styles.deleteLink}>Supprimer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        />

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) + spacing.sm }]}>
          <TextInput
            style={styles.input}
            placeholder="Écrire un commentaire..."
            placeholderTextColor={colors.outline}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !newComment.trim() && styles.sendBtnDisabled]}
            disabled={!newComment.trim() || posting}
            onPress={handleAddComment}>
            <MaterialIcons name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { spacing } from '@/constants/design';
import { useAppTheme } from '@/hooks/use-app-theme';
import { api, getApiErrorMessage } from '@/lib/api';

import type { Palette } from '@/constants/design';
import { radius, typography } from '@/constants/design';

interface PreviewData {
  membre: {
    id: number;
    nom_complet: string;
    photo: string | null;
    matricule: string | null;
  };
  activite: {
    titre: string;
    date_debut: string;
    statut: string;
    qr_used: number;
  };
}

type ScreenState =
  | { step: 'camera' }
  | { step: 'loading'; message?: string }
  | { step: 'preview'; preview: PreviewData; qrToken: string }
  | { step: 'success'; message: string; memberName?: string }
  | { step: 'error'; message: string };

export default function ScanQrScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<ScreenState>({ step: 'camera' });
  const lastScannedRef = useRef<string | null>(null);

  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (state.step !== 'camera' || lastScannedRef.current === data) return;

    lastScannedRef.current = data;
    setState({ step: 'loading', message: 'Vérification du QR code...' });

    try {
      // Step 1: Preview — get member info
      const previewRes = await api.post('/participations/scan-preview', { qr_token: data });
      const previewData = (previewRes.data as any).data ?? previewRes.data;

      setState({ step: 'preview', preview: previewData, qrToken: data });
    } catch (error: any) {
      const message = getApiErrorMessage(error, 'QR code invalide.');
      setState({ step: 'error', message });
    }
  }, [state.step]);

  const handleConfirmCheckin = useCallback(async (qrToken: string) => {
    setState({ step: 'loading', message: 'Confirmation du pointage...' });

    try {
      // Step 2: Confirm checkin
      const checkinRes = await api.post('/participations/checkin', { qr_token: qrToken });
      const resData = (checkinRes.data as any);

      setState({
        step: 'success',
        message: resData.message ?? 'Présence enregistrée avec succès.',
        memberName: resData.membre?.nom,
      });
    } catch (error: any) {
      const message = getApiErrorMessage(error, 'Erreur lors de la confirmation.');
      setState({ step: 'error', message });
    }
  }, []);

  const handleScanAgain = () => {
    setState({ step: 'camera' });
    lastScannedRef.current = null;
  };

  // Permission not yet determined
  if (!permission) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <MaterialIcons name="no-photography" size={64} color={colors.outline} />
        <Text style={styles.permissionTitle}>Accès caméra requis</Text>
        <Text style={styles.permissionSubtitle}>
          Autorisez l'accès à la caméra pour scanner les QR codes de présence.
        </Text>
        <AppButton
          title="Autoriser la caméra"
          onPress={requestPermission}
          style={{ marginTop: spacing.md, width: 250 }}
        />
        <AppButton
          title="Retour"
          variant="outline"
          onPress={() => router.back()}
          style={{ marginTop: spacing.sm, width: 250 }}
        />
      </SafeAreaView>
    );
  }

  // Loading state
  if (state.step === 'loading') {
    return (
      <View style={styles.screen}>
        <View style={[styles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.permissionSubtitle, { marginTop: spacing.md }]}>
            {state.message}
          </Text>
        </View>
      </View>
    );
  }

  // Preview — show member info before confirming
  if (state.step === 'preview') {
    const { preview, qrToken } = state;
    const isAlreadyScanned = preview.activite.qr_used === 1;

    return (
      <SafeAreaView style={[styles.screen, { padding: spacing.lg }]} edges={['top']}>
        <View style={styles.previewCard}>
          {preview.membre.photo ? (
            <Image source={{ uri: preview.membre.photo }} style={styles.previewAvatar} />
          ) : (
            <View style={[styles.previewAvatar, styles.previewAvatarPlaceholder]}>
              <MaterialIcons name="person" size={40} color={colors.outline} />
            </View>
          )}

          <Text style={styles.previewName}>{preview.membre.nom_complet}</Text>
          {preview.membre.matricule && (
            <Text style={styles.previewMeta}>Matricule : {preview.membre.matricule}</Text>
          )}

          <View style={[styles.previewBadge, { backgroundColor: colors.badgeInfoBg }]}>
            <MaterialIcons name="event" size={16} color={colors.badgeInfoText} />
            <Text style={[styles.previewBadgeText, { color: colors.badgeInfoText }]}>
              {preview.activite.titre}
            </Text>
          </View>

          {isAlreadyScanned && (
            <View style={[styles.previewBadge, { backgroundColor: colors.badgeWarningBg, marginTop: spacing.xs }]}>
              <MaterialIcons name="info" size={16} color={colors.badgeWarningText} />
              <Text style={[styles.previewBadgeText, { color: colors.badgeWarningText }]}>
                Déjà scanné
              </Text>
            </View>
          )}
        </View>

        <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
          {!isAlreadyScanned && (
            <AppButton
              title="✓ Confirmer le pointage"
              onPress={() => handleConfirmCheckin(qrToken)}
            />
          )}
          <AppButton
            title="Scanner un autre code"
            variant="outline"
            onPress={handleScanAgain}
          />
          <AppButton
            title="Retour"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Success
  if (state.step === 'success') {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <View style={[styles.resultCard, { backgroundColor: colors.badgeSuccessBg }]}>
          <MaterialIcons name="check-circle" size={72} color={colors.badgeSuccessText} />
          <Text style={[styles.resultTitle, { color: colors.badgeSuccessText }]}>
            Présence enregistrée
          </Text>
          {state.memberName && (
            <Text style={[styles.resultMember, { color: colors.badgeSuccessText }]}>
              {state.memberName}
            </Text>
          )}
          <Text style={[styles.resultMessage, { color: colors.badgeSuccessText }]}>
            {state.message}
          </Text>
        </View>

        <View style={{ gap: spacing.sm, width: '100%', paddingHorizontal: spacing.xl }}>
          <AppButton title="Scanner un autre code" onPress={handleScanAgain} />
          <AppButton title="Retour" variant="outline" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  // Error
  if (state.step === 'error') {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <View style={[styles.resultCard, { backgroundColor: colors.badgeErrorBg }]}>
          <MaterialIcons name="error" size={72} color={colors.badgeErrorText} />
          <Text style={[styles.resultTitle, { color: colors.badgeErrorText }]}>Erreur</Text>
          <Text style={[styles.resultMessage, { color: colors.badgeErrorText }]}>
            {state.message}
          </Text>
        </View>

        <View style={{ gap: spacing.sm, width: '100%', paddingHorizontal: spacing.xl }}>
          <AppButton title="Réessayer" onPress={handleScanAgain} />
          <AppButton title="Retour" variant="outline" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  // Camera scanner
  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={state.step === 'camera' ? handleBarCodeScanned : undefined}
      />

      {/* Top overlay */}
      <SafeAreaView style={styles.overlayTop} edges={['top', 'left', 'right']}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.overlayTitle}>Scanner le QR Code</Text>
        <View style={{ width: 32 }} />
      </SafeAreaView>

      {/* Center scan area */}
      <View style={styles.scanAreaContainer}>
        <View style={styles.scanArea}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
      </View>

      {/* Bottom instruction */}
      <View style={styles.overlayBottom}>
        <Text style={styles.instructionText}>
          Positionnez le QR code du participant dans le cadre
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      gap: spacing.sm,
    },

    // Permission
    permissionTitle: {
      ...typography.headlineMd,
      color: colors.textPrimary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    permissionSubtitle: {
      ...typography.bodyMd,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xs,
    },

    // Preview
    previewCard: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      padding: spacing.xl,
      gap: spacing.sm,
    },
    previewAvatar: {
      width: 80,
      height: 80,
      borderRadius: radius.full,
    },
    previewAvatarPlaceholder: {
      backgroundColor: colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewName: {
      ...typography.headlineMd,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    previewMeta: {
      ...typography.bodySm,
      color: colors.textSecondary,
    },
    previewBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      marginTop: spacing.xs,
    },
    previewBadgeText: {
      ...typography.labelMd,
    },

    // Result
    resultCard: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      borderRadius: radius.xl,
      width: 280,
      marginBottom: spacing.xl,
      gap: spacing.xs,
    },
    resultTitle: {
      ...typography.headlineLg,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    resultMember: {
      ...typography.headlineSm,
      textAlign: 'center',
    },
    resultMessage: {
      ...typography.bodyMd,
      textAlign: 'center',
      marginTop: spacing.xs,
    },

    // Camera overlay
    overlayTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backBtn: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlayTitle: {
      ...typography.labelMd,
      color: '#fff',
    },
    scanAreaContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scanArea: {
      width: 250,
      height: 250,
    },
    corner: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderColor: '#fff',
    },
    cornerTopLeft: {
      top: 0,
      left: 0,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderTopLeftRadius: radius.md,
    },
    cornerTopRight: {
      top: 0,
      right: 0,
      borderTopWidth: 4,
      borderRightWidth: 4,
      borderTopRightRadius: radius.md,
    },
    cornerBottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderBottomLeftRadius: radius.md,
    },
    cornerBottomRight: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderBottomRightRadius: radius.md,
    },
    overlayBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      alignItems: 'center',
    },
    instructionText: {
      ...typography.bodyMd,
      color: '#fff',
      textAlign: 'center',
    },
  });

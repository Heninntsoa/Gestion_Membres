import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { spacing } from '@/constants/design';
import { useAppTheme } from '@/hooks/use-app-theme';
import { api, getApiErrorMessage } from '@/lib/api';

import type { Palette } from '@/constants/design';
import { radius, typography } from '@/constants/design';

interface ScanResult {
  type: 'success' | 'error' | 'already_scanned';
  message: string;
  memberName?: string;
}

export default function ScanQrScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (loading || !scanning) return;

    // Prevent duplicate scans of the same QR code
    if (lastScannedRef.current === data) return;
    lastScannedRef.current = data;

    setLoading(true);
    setScanning(false);

    try {
      const response = await api.post('/participations/scan', { qr_token: data });
      const resData = response.data as any;

      setResult({
        type: 'success',
        message: resData.message ?? 'Présence enregistrée avec succès.',
        memberName: resData.data?.nom_complet,
      });
    } catch (error: any) {
      const status = error.response?.status;
      const message = getApiErrorMessage(error, 'Erreur lors du scan.');

      if (status === 409) {
        setResult({ type: 'already_scanned', message });
      } else {
        setResult({ type: 'error', message });
      }
    } finally {
      setLoading(false);
    }
  }, [loading, scanning]);

  const handleScanAgain = () => {
    setResult(null);
    setScanning(true);
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

  // Show scan result
  if (result) {
    const isSuccess = result.type === 'success';
    const isAlreadyScanned = result.type === 'already_scanned';
    const iconColor = isSuccess
      ? colors.badgeSuccessText
      : isAlreadyScanned
        ? colors.badgeWarningText
        : colors.badgeErrorText;
    const iconName = isSuccess
      ? 'check-circle'
      : isAlreadyScanned
        ? 'info'
        : 'error';
    const bgColor = isSuccess
      ? colors.badgeSuccessBg
      : isAlreadyScanned
        ? colors.badgeWarningBg
        : colors.badgeErrorBg;
    const textColor = isSuccess
      ? colors.badgeSuccessText
      : isAlreadyScanned
        ? colors.badgeWarningText
        : colors.badgeErrorText;

    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <View style={[styles.resultCard, { backgroundColor: bgColor }]}>
          <MaterialIcons name={iconName as any} size={72} color={iconColor} />
          <Text style={[styles.resultTitle, { color: textColor }]}>
            {isSuccess ? 'Présence enregistrée' : isAlreadyScanned ? 'Déjà scanné' : 'Erreur'}
          </Text>
          {result.memberName && (
            <Text style={[styles.resultMember, { color: textColor }]}>{result.memberName}</Text>
          )}
          <Text style={[styles.resultMessage, { color: textColor }]}>{result.message}</Text>
        </View>

        <View style={{ gap: spacing.sm, width: '100%', paddingHorizontal: spacing.xl }}>
          <AppButton
            title="Scanner un autre code"
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

  // Camera scanner
  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
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
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Vérification en cours...</Text>
          </View>
        )}
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
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
    },
    loadingText: {
      ...typography.bodyMd,
      color: '#fff',
      marginTop: spacing.sm,
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

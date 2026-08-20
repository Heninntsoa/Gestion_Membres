import { Image, type ImageStyle, type StyleProp } from 'react-native';
import React from 'react';

import { styles } from '@/styles/components/ui/logo.styles';

/**
 * Mark = icône seule (logo-icon.png)
 * Full = lockup complet avec slogan (logo.jpeg)
 */
const MARK_SOURCE = require('@/assets/images/logo-adaptive-foreground.png');
const FULL_SOURCE = require('@/assets/images/logo.jpeg');

interface LogoProps {
  /** `"mark"` = icône seule, `"full"` = logo + slogan. Defaults to `"mark"`. */
  variant?: 'mark' | 'full';
  /** Height in dp — width is computed from the real image ratio. */
  height?: number;
  /** Optional style override applied on the Image element. */
  style?: StyleProp<ImageStyle>;
  /** Accessibility label (defaults to "IDEM Planète"). */
  accessibilityLabel?: string;
}

/**
 * Displays the IDEM Planète logo **without** forcing it into a square or
 * circle. The component reads the asset's natural dimensions embedded by
 * the Metro bundler and derives the correct width from the real aspect ratio.
 *
 * - `variant="mark"` → icône seule (navigation, header bar)
 * - `variant="full"` → lockup complet avec slogan (écran de login)
 */
export function Logo({
  variant = 'mark',
  height = 30,
  style,
  accessibilityLabel = 'IDEM Planète',
}: LogoProps) {
  const source = variant === 'full' ? FULL_SOURCE : MARK_SOURCE;

  // Every `require('<image>')` in RN carries `.width` / `.height` in dp
  // via the Metro bundler asset metadata.
  const asset = Image.resolveAssetSource(source);
  const naturalWidth = asset?.width ?? height;
  const naturalHeight = asset?.height ?? height;
  const aspectRatio = naturalWidth / naturalHeight;

  const computedWidth = height * aspectRatio;

  return (
    <Image
      source={source}
      accessibilityLabel={accessibilityLabel}
      accessible
      style={[
        styles.image,
        { height, width: computedWidth },
        style,
      ]}
    />
  );
}

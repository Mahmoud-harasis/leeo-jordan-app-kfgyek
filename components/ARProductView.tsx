
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, spacing, borderRadius, typography } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface ARProductViewProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  arContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  placeholderContainer: {
    width: width * 0.8,
    height: height * 0.5,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    marginBottom: spacing.lg,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },
  controls: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
  },
  controlsContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  controlLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  activeControl: {
    backgroundColor: colors.primaryRed,
    borderRadius: borderRadius.sm,
  },
  activeControlLabel: {
    color: colors.textPrimary,
  },
  infoPanel: {
    position: 'absolute',
    top: 100,
    right: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    maxWidth: width * 0.4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export default function ARProductView({ productId, productName, onClose }: ARProductViewProps) {
  const [activeMode, setActiveMode] = useState<'ar' | '3d' | '360'>('ar');
  const [showInfo, setShowInfo] = useState(true);

  const handleModeChange = (mode: 'ar' | '3d' | '360') => {
    setActiveMode(mode);
    console.log(`Switching to ${mode} mode for product ${productId}`);
    
    // In a real implementation, this would switch between different viewing modes
    Alert.alert(
      'Mode Changed',
      `Switched to ${mode.toUpperCase()} view mode`,
      [{ text: 'OK' }]
    );
  };

  const handleScreenshot = () => {
    console.log('Taking AR screenshot');
    Alert.alert('Screenshot', 'AR screenshot saved to gallery!');
  };

  const handleShare = () => {
    console.log('Sharing AR view');
    Alert.alert('Share', 'Sharing AR experience...');
  };

  const getModeDescription = () => {
    switch (activeMode) {
      case 'ar':
        return 'Point your camera at a flat surface to place the product in your space';
      case '3d':
        return 'Rotate and zoom to explore the product in 3D';
      case '360':
        return 'Drag to rotate and see the product from all angles';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{productName}</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <IconSymbol name="xmark" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* AR/3D View Container */}
      <View style={styles.arContainer}>
        {/* Placeholder for AR/3D content */}
        <View style={styles.placeholderContainer}>
          <IconSymbol 
            name={activeMode === 'ar' ? 'arkit' : activeMode === '3d' ? 'cube.transparent' : 'rotate.3d'} 
            size={64} 
            color={colors.primaryRed} 
            style={styles.placeholderIcon}
          />
          <Text style={styles.placeholderTitle}>
            {activeMode === 'ar' ? 'AR View' : activeMode === '3d' ? '3D Model' : '360° View'}
          </Text>
          <Text style={styles.placeholderText}>
            {activeMode === 'ar' 
              ? 'AR functionality is not supported in Natively web environment. This would show an interactive AR view of the product in a native app.'
              : activeMode === '3d'
              ? '3D model rendering would appear here in a native environment with WebGL support.'
              : '360° product photography would be displayed here with touch rotation controls.'
            }
          </Text>
        </View>

        {/* Info Panel */}
        {showInfo && (
          <View style={styles.infoPanel}>
            <Text style={styles.infoTitle}>How to use:</Text>
            <Text style={styles.infoText}>{getModeDescription()}</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlsContainer}>
          {/* AR Mode */}
          <Pressable
            style={[styles.controlButton, activeMode === 'ar' && styles.activeControl]}
            onPress={() => handleModeChange('ar')}
          >
            <IconSymbol 
              name="arkit" 
              size={24} 
              color={activeMode === 'ar' ? colors.textPrimary : colors.textSecondary} 
            />
            <Text style={[
              styles.controlLabel,
              activeMode === 'ar' && styles.activeControlLabel
            ]}>
              AR
            </Text>
          </Pressable>

          {/* 3D Mode */}
          <Pressable
            style={[styles.controlButton, activeMode === '3d' && styles.activeControl]}
            onPress={() => handleModeChange('3d')}
          >
            <IconSymbol 
              name="cube.transparent" 
              size={24} 
              color={activeMode === '3d' ? colors.textPrimary : colors.textSecondary} 
            />
            <Text style={[
              styles.controlLabel,
              activeMode === '3d' && styles.activeControlLabel
            ]}>
              3D
            </Text>
          </Pressable>

          {/* 360° Mode */}
          <Pressable
            style={[styles.controlButton, activeMode === '360' && styles.activeControl]}
            onPress={() => handleModeChange('360')}
          >
            <IconSymbol 
              name="rotate.3d" 
              size={24} 
              color={activeMode === '360' ? colors.textPrimary : colors.textSecondary} 
            />
            <Text style={[
              styles.controlLabel,
              activeMode === '360' && styles.activeControlLabel
            ]}>
              360°
            </Text>
          </Pressable>

          {/* Screenshot */}
          <Pressable style={styles.controlButton} onPress={handleScreenshot}>
            <IconSymbol name="camera" size={24} color={colors.textSecondary} />
            <Text style={styles.controlLabel}>Capture</Text>
          </Pressable>

          {/* Share */}
          <Pressable style={styles.controlButton} onPress={handleShare}>
            <IconSymbol name="square.and.arrow.up" size={24} color={colors.textSecondary} />
            <Text style={styles.controlLabel}>Share</Text>
          </Pressable>

          {/* Info Toggle */}
          <Pressable 
            style={styles.controlButton} 
            onPress={() => setShowInfo(!showInfo)}
          >
            <IconSymbol 
              name="info.circle" 
              size={24} 
              color={showInfo ? colors.primaryRed : colors.textSecondary} 
            />
            <Text style={[
              styles.controlLabel,
              showInfo && { color: colors.primaryRed }
            ]}>
              Info
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

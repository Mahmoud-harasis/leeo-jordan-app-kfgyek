
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, spacing, borderRadius, typography } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

interface BiometricAuthProps {
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  icon: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamilyBold,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
    fontFamily: typography.fontFamily,
  },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily,
  },
});

export default function BiometricAuth({ 
  onSuccess, 
  onCancel, 
  title = 'Secure Authentication',
  subtitle = 'Use your fingerprint or face to authenticate securely'
}: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setIsSupported(compatible && enrolled);
      setBiometricType(supportedTypes);
      
      console.log('Biometric support:', { compatible, enrolled, supportedTypes });
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setError('Unable to check biometric support');
    }
  };

  const authenticate = async () => {
    if (!isSupported) {
      Alert.alert(
        'Biometric Authentication Unavailable',
        'Please set up biometric authentication in your device settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        subtitle: 'Use your biometric to verify your identity',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: false,
      });

      if (result.success) {
        console.log('Biometric authentication successful');
        onSuccess();
      } else {
        console.log('Biometric authentication failed:', result.error);
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setError('Authentication error occurred');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getBiometricIcon = () => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'faceid';
    } else if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'touchid';
    }
    return 'lock.shield';
  };

  const getBiometricText = () => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Use Face ID';
    } else if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Use Touch ID';
    }
    return 'Use Biometric';
  };

  if (!isSupported) {
    return (
      <View style={styles.container}>
        <IconSymbol name="exclamationmark.triangle" size={48} color={colors.warning} style={styles.icon} />
        <Text style={styles.title}>Biometric Authentication Unavailable</Text>
        <Text style={styles.subtitle}>
          Please set up Face ID or Touch ID in your device settings to use this feature.
        </Text>
        {onCancel && (
          <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Continue without Biometric</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <IconSymbol name={getBiometricIcon()} size={64} color={colors.primaryRed} style={styles.icon} />
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <LinearGradient
        colors={[colors.primaryRed, '#C73E3F']}
        style={styles.button}
      >
        <Pressable
          style={{ width: '100%', alignItems: 'center' }}
          onPress={authenticate}
          disabled={isAuthenticating}
        >
          <Text style={styles.buttonText}>
            {isAuthenticating ? 'Authenticating...' : getBiometricText()}
          </Text>
        </Pressable>
      </LinearGradient>

      {onCancel && (
        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
        </Pressable>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

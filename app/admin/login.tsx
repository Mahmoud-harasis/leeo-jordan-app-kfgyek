
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, buttonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primaryRed,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    ...commonStyles.input,
    fontSize: 16,
  },
  securityNote: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginTop: spacing.md,
  },
  securityText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  loginButton: {
    marginTop: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default function AdminLoginScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (showTwoFactor && !formData.twoFactorCode.trim()) {
      Alert.alert('Error', 'Please enter the 2FA code');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!showTwoFactor) {
        // First step - show 2FA
        setShowTwoFactor(true);
        Alert.alert('2FA Required', 'Please enter the 6-digit code from your authenticator app.');
      } else {
        // Second step - complete login
        console.log('Admin login:', formData);
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => router.replace('/admin/dashboard') }
        ]);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logo}>
              <IconSymbol name="shield.checkered" size={64} color={colors.primaryRed} />
              <Text style={styles.logoText}>Leeo Admin</Text>
              <Text style={styles.subtitle}>Administrative Dashboard</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Admin Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your admin email"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!showTwoFactor}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry
                  autoComplete="password"
                  editable={!showTwoFactor}
                />
              </View>

              {showTwoFactor && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>2FA Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.twoFactorCode}
                    onChangeText={(text) => updateFormData('twoFactorCode', text)}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                </View>
              )}

              {/* Security Note */}
              <View style={styles.securityNote}>
                <Text style={styles.securityText}>
                  🔒 This is a secure admin portal. All activities are logged and monitored for security purposes.
                </Text>
              </View>

              {/* Login Button */}
              <LinearGradient
                colors={[colors.primaryRed, '#C73E3F']}
                style={[buttonStyles.primary, styles.loginButton]}
              >
                <Pressable
                  style={{ width: '100%', alignItems: 'center' }}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={buttonStyles.primaryText}>
                    {loading ? 'Authenticating...' : showTwoFactor ? 'Verify & Login' : 'Continue'}
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Leeo Admin Portal v1.0.0
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

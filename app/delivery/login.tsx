
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
  Image,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primaryRed,
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
  supportText: {
    fontSize: 14,
    color: colors.primaryRed,
    marginTop: spacing.sm,
  },
});

export default function DeliveryLoginScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

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
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Delivery driver login:', formData);
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => router.replace('/delivery/dashboard') }
      ]);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Please contact your supervisor to reset your password.',
      [{ text: 'OK' }]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'For technical support, please call: +962 6 123 4567',
      [{ text: 'OK' }]
    );
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
              <IconSymbol name="truck.box" size={64} color={colors.primaryRed} />
              <Text style={styles.logoText}>Leeo Delivery</Text>
              <Text style={styles.subtitle}>Professional Delivery Portal</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
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
                />
              </View>

              <Pressable style={styles.forgotPassword} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>

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
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Need help?</Text>
              <Pressable onPress={handleSupport}>
                <Text style={styles.supportText}>Contact Support</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

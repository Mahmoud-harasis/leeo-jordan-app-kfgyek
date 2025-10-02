
import React, { useState } from 'react';
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
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, shadows, buttonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Login Successful',
        'Welcome back to Leeo!',
        [
          {
            text: 'Continue',
            onPress: () => router.push('/(tabs)/(home)/'),
          }
        ]
      );
    }, 1500);
  };

  const handleGuestCheckout = () => {
    Alert.alert(
      'Guest Checkout',
      'Continue as guest? You can create an account later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue as Guest',
          onPress: () => router.push('/cart'),
        }
      ]
    );
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      'Social Login',
      `${provider} login will be implemented soon.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Welcome Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
        }}
      />
      <SafeAreaView style={commonStyles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={[colors.primaryRed, '#B91C1C']}
                style={styles.logoContainer}
              >
                <IconSymbol name="bag.fill" color="white" size={40} />
              </LinearGradient>
              <Text style={[commonStyles.title, { textAlign: 'center' }]}>
                Sign in to Leeo
              </Text>
              <Text style={[commonStyles.body, { textAlign: 'center' }]}>
                Jordan's premier shopping destination
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                  Email Address
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
                  <IconSymbol name="envelope" color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                  Password
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
                  <IconSymbol name="lock" color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <IconSymbol
                      name={showPassword ? 'eye.slash' : 'eye'}
                      color={colors.textSecondary}
                      size={20}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Forgot Password */}
              <Pressable onPress={handleForgotPassword} style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.primaryRed }]}>
                  Forgot Password?
                </Text>
              </Pressable>

              {/* Login Button */}
              <LinearGradient
                colors={[colors.primaryRed, '#B91C1C']}
                style={[buttonStyles.primary, { marginTop: spacing.lg }]}
              >
                <Pressable
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Text style={buttonStyles.primaryText}>Signing in...</Text>
                    </View>
                  ) : (
                    <Text style={buttonStyles.primaryText}>Sign In</Text>
                  )}
                </Pressable>
              </LinearGradient>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                  or continue with
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtons}>
                <Pressable
                  style={[styles.socialButton, { backgroundColor: colors.card }]}
                  onPress={() => handleSocialLogin('Google')}
                >
                  <IconSymbol name="globe" color={colors.textPrimary} size={20} />
                  <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                    Google
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.socialButton, { backgroundColor: colors.card }]}
                  onPress={() => handleSocialLogin('Apple')}
                >
                  <IconSymbol name="apple.logo" color={colors.textPrimary} size={20} />
                  <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                    Apple
                  </Text>
                </Pressable>
              </View>

              {/* Guest Checkout */}
              <Pressable
                style={[buttonStyles.ghost, { marginTop: spacing.lg }]}
                onPress={handleGuestCheckout}
              >
                <Text style={buttonStyles.ghostText}>Continue as Guest</Text>
              </Pressable>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[commonStyles.body, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/register')}>
                <Text style={[styles.signUpText, { color: colors.primaryRed }]}>
                  Sign Up
                </Text>
              </Pressable>
            </View>

            {/* Jordan Badge */}
            <View style={styles.jordanBadge}>
              <IconSymbol name="location.fill" color={colors.primaryRed} size={16} />
              <Text style={[styles.jordanText, { color: colors.textSecondary }]}>
                Proudly serving Jordan 🇯🇴
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontFamily: 'Inter_500Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: spacing.sm,
    fontFamily: 'Inter_400Regular',
  },
  eyeButton: {
    padding: spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    marginHorizontal: spacing.md,
    fontFamily: 'Inter_400Regular',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_500Medium',
  },
  jordanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  jordanText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

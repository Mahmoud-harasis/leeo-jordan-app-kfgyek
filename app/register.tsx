
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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (phone.length < 8) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Registration Successful',
        'Welcome to Leeo! Your account has been created successfully.',
        [
          {
            text: 'Get Started',
            onPress: () => router.push('/(tabs)/(home)/'),
          }
        ]
      );
    }, 2000);
  };

  const handleSocialRegister = (provider: string) => {
    Alert.alert(
      'Social Registration',
      `${provider} registration will be implemented soon.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Account',
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
                <IconSymbol name="person.badge.plus" color="white" size={40} />
              </LinearGradient>
              <Text style={[commonStyles.title, { textAlign: 'center' }]}>
                Join Leeo Today
              </Text>
              <Text style={[commonStyles.body, { textAlign: 'center' }]}>
                Create your account and start shopping in Jordan
              </Text>
            </View>

            {/* Registration Form */}
            <View style={styles.form}>
              {/* Name Fields */}
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: spacing.sm }]}>
                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                    First Name
                  </Text>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
                    <IconSymbol name="person" color={colors.textSecondary} size={20} />
                    <TextInput
                      style={[styles.input, { color: colors.textPrimary }]}
                      placeholder="First name"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.firstName}
                      onChangeText={(value) => updateFormData('firstName', value)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: spacing.sm }]}>
                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                    Last Name
                  </Text>
                  <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
                    <IconSymbol name="person" color={colors.textSecondary} size={20} />
                    <TextInput
                      style={[styles.input, { color: colors.textPrimary }]}
                      placeholder="Last name"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.lastName}
                      onChangeText={(value) => updateFormData('lastName', value)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </View>

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
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                  Phone Number
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
                  <IconSymbol name="phone" color={colors.textSecondary} size={20} />
                  <Text style={[styles.countryCode, { color: colors.textSecondary }]}>+962</Text>
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder="7X XXX XXXX"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    keyboardType="phone-pad"
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
                    placeholder="Create a password"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
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

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                  Confirm Password
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
                  <IconSymbol name="lock" color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <IconSymbol
                      name={showConfirmPassword ? 'eye.slash' : 'eye'}
                      color={colors.textSecondary}
                      size={20}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Terms and Conditions */}
              <Pressable
                style={styles.termsContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View style={[
                  styles.checkbox,
                  {
                    backgroundColor: acceptTerms ? colors.primaryRed : 'transparent',
                    borderColor: acceptTerms ? colors.primaryRed : colors.border,
                  }
                ]}>
                  {acceptTerms && (
                    <IconSymbol name="checkmark" color="white" size={14} />
                  )}
                </View>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  I agree to the{' '}
                  <Text style={{ color: colors.primaryRed }}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={{ color: colors.primaryRed }}>Privacy Policy</Text>
                </Text>
              </Pressable>

              {/* Register Button */}
              <LinearGradient
                colors={[colors.primaryRed, '#B91C1C']}
                style={[buttonStyles.primary, { marginTop: spacing.lg }]}
              >
                <Pressable
                  style={styles.registerButton}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Text style={buttonStyles.primaryText}>Creating Account...</Text>
                    </View>
                  ) : (
                    <Text style={buttonStyles.primaryText}>Create Account</Text>
                  )}
                </Pressable>
              </LinearGradient>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                  or sign up with
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Social Registration Buttons */}
              <View style={styles.socialButtons}>
                <Pressable
                  style={[styles.socialButton, { backgroundColor: colors.card }]}
                  onPress={() => handleSocialRegister('Google')}
                >
                  <IconSymbol name="globe" color={colors.textPrimary} size={20} />
                  <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                    Google
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.socialButton, { backgroundColor: colors.card }]}
                  onPress={() => handleSocialRegister('Apple')}
                >
                  <IconSymbol name="apple.logo" color={colors.textPrimary} size={20} />
                  <Text style={[styles.socialButtonText, { color: colors.textPrimary }]}>
                    Apple
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[commonStyles.body, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/login')}>
                <Text style={[styles.signInText, { color: colors.primaryRed }]}>
                  Sign In
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
  nameRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
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
  countryCode: {
    fontSize: 16,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
    fontFamily: 'Inter_500Medium',
  },
  eyeButton: {
    padding: spacing.xs,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  registerButton: {
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signInText: {
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

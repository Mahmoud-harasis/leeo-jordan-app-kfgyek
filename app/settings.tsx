
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface NotificationSetting {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  enabled: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  enabled: boolean;
}

export default function SettingsScreen() {
  const [isArabic, setIsArabic] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [biometricAuth, setBiometricAuth] = useState<boolean>(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Order Updates',
      titleAr: 'تحديثات الطلبات',
      description: 'Get notified about order status changes',
      descriptionAr: 'احصل على إشعارات حول تغييرات حالة الطلب',
      enabled: true,
    },
    {
      id: '2',
      title: 'Promotions & Deals',
      titleAr: 'العروض والصفقات',
      description: 'Receive notifications about special offers',
      descriptionAr: 'احصل على إشعارات حول العروض الخاصة',
      enabled: true,
    },
    {
      id: '3',
      title: 'New Products',
      titleAr: 'منتجات جديدة',
      description: 'Be the first to know about new arrivals',
      descriptionAr: 'كن أول من يعرف عن الوصولات الجديدة',
      enabled: false,
    },
    {
      id: '4',
      title: 'Price Drops',
      titleAr: 'انخفاض الأسعار',
      description: 'Get alerted when prices drop on your wishlist',
      descriptionAr: 'احصل على تنبيهات عند انخفاض الأسعار في قائمة أمنياتك',
      enabled: true,
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', name: 'Credit Card', nameAr: 'بطاقة ائتمان', icon: 'creditcard.fill', enabled: true },
    { id: '2', name: 'PayPal', nameAr: 'باي بال', icon: 'wallet.pass.fill', enabled: true },
    { id: '3', name: 'Apple Pay', nameAr: 'أبل باي', icon: 'applelogo', enabled: true },
    { id: '4', name: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام', icon: 'banknote.fill', enabled: true },
  ]);

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      isArabic ? 'حذف الحساب' : 'Delete Account',
      isArabic 
        ? 'هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.'
        : 'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: isArabic ? 'إلغاء' : 'Cancel',
          style: 'cancel',
        },
        {
          text: isArabic ? 'حذف' : 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            console.log('Account deletion requested');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      isArabic ? 'تصدير البيانات' : 'Export Data',
      isArabic 
        ? 'سيتم إرسال نسخة من بياناتك إلى بريدك الإلكتروني خلال 24 ساعة.'
        : 'A copy of your data will be sent to your email within 24 hours.',
      [
        {
          text: isArabic ? 'موافق' : 'OK',
          onPress: () => {
            console.log('Data export requested');
          },
        },
      ]
    );
  };

  const renderSection = (title: string, titleAr: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {isArabic ? titleAr : title}
      </Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const renderSettingItem = (
    icon: string,
    title: string,
    titleAr: string,
    description?: string,
    descriptionAr?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void,
    showBorder: boolean = true
  ) => (
    <Pressable 
      style={[styles.settingItem, !showBorder && styles.settingItemNoBorder]} 
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <IconSymbol name={icon as any} size={20} color={colors.primaryRed} />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>
            {isArabic ? titleAr : title}
          </Text>
          {description && (
            <Text style={styles.settingDescription}>
              {isArabic ? descriptionAr : description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: isArabic ? 'الإعدادات' : 'Settings',
          headerRight: () => (
            <Pressable onPress={() => setIsArabic(!isArabic)} style={commonStyles.headerButton}>
              <Text style={{ color: colors.textPrimary, fontSize: 14 }}>
                {isArabic ? 'EN' : 'عر'}
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Account Settings */}
        {renderSection('Account', 'الحساب', (
          <>
            {renderSettingItem(
              'person.circle.fill',
              'Edit Profile',
              'تعديل الملف الشخصي',
              'Update your personal information',
              'تحديث معلوماتك الشخصية',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Edit profile')
            )}
            {renderSettingItem(
              'lock.fill',
              'Change Password',
              'تغيير كلمة المرور',
              'Update your account password',
              'تحديث كلمة مرور حسابك',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Change password')
            )}
            {renderSettingItem(
              'envelope.fill',
              'Email Preferences',
              'تفضيلات البريد الإلكتروني',
              'Manage email notifications',
              'إدارة إشعارات البريد الإلكتروني',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Email preferences'),
              false
            )}
          </>
        ))}

        {/* App Preferences */}
        {renderSection('App Preferences', 'تفضيلات التطبيق', (
          <>
            {renderSettingItem(
              'globe',
              'Language',
              'اللغة',
              'Choose your preferred language',
              'اختر لغتك المفضلة',
              <View style={styles.languageSelector}>
                <Text style={styles.settingValue}>
                  {isArabic ? 'العربية' : 'English'}
                </Text>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </View>,
              () => setIsArabic(!isArabic)
            )}
            {renderSettingItem(
              'moon.fill',
              'Dark Mode',
              'الوضع المظلم',
              'Toggle dark/light theme',
              'تبديل المظهر المظلم/الفاتح',
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.border, true: colors.primaryRed }}
                thumbColor={colors.textPrimary}
              />,
              undefined,
              false
            )}
          </>
        ))}

        {/* Notifications */}
        {renderSection('Notifications', 'الإشعارات', (
          <>
            {notificationSettings.map((setting, index) => 
              renderSettingItem(
                'bell.fill',
                setting.title,
                setting.titleAr,
                setting.description,
                setting.descriptionAr,
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleNotification(setting.id)}
                  trackColor={{ false: colors.border, true: colors.primaryRed }}
                  thumbColor={colors.textPrimary}
                />,
                undefined,
                index !== notificationSettings.length - 1
              )
            )}
          </>
        ))}

        {/* Payment Methods */}
        {renderSection('Payment Methods', 'طرق الدفع', (
          <>
            {paymentMethods.map((method, index) => 
              renderSettingItem(
                method.icon,
                method.name,
                method.nameAr,
                undefined,
                undefined,
                <Switch
                  value={method.enabled}
                  onValueChange={() => togglePaymentMethod(method.id)}
                  trackColor={{ false: colors.border, true: colors.primaryRed }}
                  thumbColor={colors.textPrimary}
                />,
                undefined,
                index !== paymentMethods.length - 1
              )
            )}
          </>
        ))}

        {/* Security */}
        {renderSection('Security', 'الأمان', (
          <>
            {renderSettingItem(
              'faceid',
              'Biometric Authentication',
              'المصادقة البيومترية',
              'Use Face ID or Touch ID to unlock',
              'استخدم Face ID أو Touch ID للفتح',
              <Switch
                value={biometricAuth}
                onValueChange={setBiometricAuth}
                trackColor={{ false: colors.border, true: colors.primaryRed }}
                thumbColor={colors.textPrimary}
              />
            )}
            {renderSettingItem(
              'shield.fill',
              'Two-Factor Authentication',
              'المصادقة الثنائية',
              'Add an extra layer of security',
              'أضف طبقة إضافية من الأمان',
              <Switch
                value={twoFactorAuth}
                onValueChange={setTwoFactorAuth}
                trackColor={{ false: colors.border, true: colors.primaryRed }}
                thumbColor={colors.textPrimary}
              />
            )}
            {renderSettingItem(
              'key.fill',
              'Manage Sessions',
              'إدارة الجلسات',
              'View and manage active sessions',
              'عرض وإدارة الجلسات النشطة',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Manage sessions'),
              false
            )}
          </>
        ))}

        {/* Privacy */}
        {renderSection('Privacy', 'الخصوصية', (
          <>
            {renderSettingItem(
              'doc.text.fill',
              'Privacy Policy',
              'سياسة الخصوصية',
              'Read our privacy policy',
              'اقرأ سياسة الخصوصية الخاصة بنا',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Privacy policy')
            )}
            {renderSettingItem(
              'doc.plaintext.fill',
              'Terms of Service',
              'شروط الخدمة',
              'Read our terms of service',
              'اقرأ شروط الخدمة الخاصة بنا',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Terms of service')
            )}
            {renderSettingItem(
              'square.and.arrow.up.fill',
              'Export Data',
              'تصدير البيانات',
              'Download a copy of your data',
              'تحميل نسخة من بياناتك',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              handleExportData,
              false
            )}
          </>
        ))}

        {/* Support */}
        {renderSection('Support', 'الدعم', (
          <>
            {renderSettingItem(
              'questionmark.circle.fill',
              'Help Center',
              'مركز المساعدة',
              'Find answers to common questions',
              'ابحث عن إجابات للأسئلة الشائعة',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Help center')
            )}
            {renderSettingItem(
              'message.fill',
              'Contact Support',
              'اتصل بالدعم',
              'Get help from our support team',
              'احصل على المساعدة من فريق الدعم',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Contact support')
            )}
            {renderSettingItem(
              'star.fill',
              'Rate App',
              'قيم التطبيق',
              'Rate us on the App Store',
              'قيمنا في متجر التطبيقات',
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />,
              () => console.log('Rate app'),
              false
            )}
          </>
        ))}

        {/* About */}
        {renderSection('About', 'حول التطبيق', (
          <>
            {renderSettingItem(
              'info.circle.fill',
              'App Version',
              'إصدار التطبيق',
              undefined,
              undefined,
              <Text style={styles.settingValue}>1.0.0</Text>,
              undefined,
              false
            )}
          </>
        ))}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>
            {isArabic ? 'منطقة الخطر' : 'Danger Zone'}
          </Text>
          <View style={[styles.sectionContent, styles.dangerSection]}>
            <Pressable style={styles.dangerButton} onPress={handleDeleteAccount}>
              <IconSymbol name="trash.fill" size={20} color={colors.error} />
              <Text style={styles.dangerButtonText}>
                {isArabic ? 'حذف الحساب' : 'Delete Account'}
              </Text>
              <IconSymbol name="chevron.right" size={16} color={colors.error} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  dangerTitle: {
    color: colors.error,
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  dangerSection: {
    borderWidth: 1,
    borderColor: colors.error,
  },

  // Setting item styles
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemNoBorder: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Danger zone styles
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.error,
    flex: 1,
    marginLeft: spacing.md,
  },
});

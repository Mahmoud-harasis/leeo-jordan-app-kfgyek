
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface LoyaltyTier {
  name: string;
  nameAr: string;
  minPoints: number;
  color: string;
  benefits: string[];
  benefitsAr: string[];
}

interface Achievement {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    nameAr: 'برونزي',
    minPoints: 0,
    color: '#CD7F32',
    benefits: ['5% cashback', 'Free delivery on orders over 50 JOD'],
    benefitsAr: ['استرداد نقدي 5%', 'توصيل مجاني للطلبات أكثر من 50 دينار'],
  },
  {
    name: 'Silver',
    nameAr: 'فضي',
    minPoints: 500,
    color: '#C0C0C0',
    benefits: ['10% cashback', 'Free delivery on orders over 30 JOD', 'Priority support'],
    benefitsAr: ['استرداد نقدي 10%', 'توصيل مجاني للطلبات أكثر من 30 دينار', 'دعم أولوية'],
  },
  {
    name: 'Gold',
    nameAr: 'ذهبي',
    minPoints: 1500,
    color: '#FFD700',
    benefits: ['15% cashback', 'Free delivery on all orders', 'Priority support', 'Exclusive deals'],
    benefitsAr: ['استرداد نقدي 15%', 'توصيل مجاني لجميع الطلبات', 'دعم أولوية', 'عروض حصرية'],
  },
  {
    name: 'Platinum',
    nameAr: 'بلاتيني',
    minPoints: 5000,
    color: '#E5E4E2',
    benefits: ['20% cashback', 'Free delivery', 'Priority support', 'Exclusive deals', 'Personal shopper'],
    benefitsAr: ['استرداد نقدي 20%', 'توصيل مجاني', 'دعم أولوية', 'عروض حصرية', 'مساعد تسوق شخصي'],
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Purchase',
    titleAr: 'أول عملية شراء',
    description: 'Complete your first order',
    descriptionAr: 'أكمل طلبك الأول',
    icon: 'cart.fill',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: '2',
    title: 'Loyal Customer',
    titleAr: 'عميل مخلص',
    description: 'Complete 10 orders',
    descriptionAr: 'أكمل 10 طلبات',
    icon: 'heart.fill',
    unlocked: false,
    progress: 7,
    maxProgress: 10,
  },
  {
    id: '3',
    title: 'Big Spender',
    titleAr: 'منفق كبير',
    description: 'Spend over 1000 JOD',
    descriptionAr: 'أنفق أكثر من 1000 دينار',
    icon: 'banknote.fill',
    unlocked: false,
    progress: 750,
    maxProgress: 1000,
  },
  {
    id: '4',
    title: 'Review Master',
    titleAr: 'خبير المراجعات',
    description: 'Write 25 product reviews',
    descriptionAr: 'اكتب 25 مراجعة منتج',
    icon: 'star.fill',
    unlocked: false,
    progress: 12,
    maxProgress: 25,
  },
];

export default function ProfileScreen() {
  const [isArabic, setIsArabic] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<boolean>(true);

  // Mock user data
  const user = {
    name: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    email: 'ahmed.rashid@email.com',
    phone: '+962 79 123 4567',
    joinDate: '2023-06-15',
    loyaltyPoints: 1250,
    totalSpent: 2450.75,
    ordersCount: 18,
    avatar: null,
  };

  const currentTier = loyaltyTiers.reduce((prev, current) => 
    user.loyaltyPoints >= current.minPoints ? current : prev
  );

  const nextTier = loyaltyTiers.find(tier => tier.minPoints > user.loyaltyPoints);
  const progressToNextTier = nextTier 
    ? (user.loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)
    : 1;

  const handleLogout = () => {
    Alert.alert(
      isArabic ? 'تسجيل الخروج' : 'Logout',
      isArabic ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?',
      [
        {
          text: isArabic ? 'إلغاء' : 'Cancel',
          style: 'cancel',
        },
        {
          text: isArabic ? 'تسجيل الخروج' : 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace('/login');
          },
        },
      ]
    );
  };

  const renderAchievement = (achievement: Achievement) => {
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
    
    return (
      <View key={achievement.id} style={styles.achievementCard}>
        <View style={[
          styles.achievementIcon,
          achievement.unlocked && styles.achievementIconUnlocked,
        ]}>
          <IconSymbol 
            name={achievement.icon as any} 
            size={24} 
            color={achievement.unlocked ? colors.textPrimary : colors.textSecondary} 
          />
        </View>
        
        <View style={styles.achievementContent}>
          <Text style={[
            styles.achievementTitle,
            achievement.unlocked && styles.achievementTitleUnlocked,
          ]}>
            {isArabic ? achievement.titleAr : achievement.title}
          </Text>
          <Text style={styles.achievementDescription}>
            {isArabic ? achievement.descriptionAr : achievement.description}
          </Text>
          
          {!achievement.unlocked && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {achievement.progress}/{achievement.maxProgress}
              </Text>
            </View>
          )}
        </View>
        
        {achievement.unlocked && (
          <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
        )}
      </View>
    );
  };

  const renderSettingItem = (
    icon: string, 
    title: string, 
    titleAr: string, 
    onPress?: () => void, 
    rightElement?: React.ReactNode,
    showChevron: boolean = true
  ) => (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <IconSymbol name={icon as any} size={20} color={colors.primaryRed} />
        <Text style={styles.settingTitle}>
          {isArabic ? titleAr : title}
        </Text>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showChevron && (
          <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: isArabic ? 'الملف الشخصي' : 'Profile',
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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[colors.primaryRed, '#FF6B6B']}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <IconSymbol name="person.fill" size={40} color={colors.textPrimary} />
                </View>
              )}
            </View>
            
            <Text style={styles.userName}>
              {isArabic ? user.nameAr : user.name}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.ordersCount}</Text>
                <Text style={styles.statLabel}>
                  {isArabic ? 'طلبات' : 'Orders'}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.totalSpent.toFixed(0)} JOD</Text>
                <Text style={styles.statLabel}>
                  {isArabic ? 'إجمالي الإنفاق' : 'Total Spent'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Loyalty Points Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'نقاط الولاء' : 'Loyalty Points'}
          </Text>
          
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyHeader}>
              <View style={styles.loyaltyPoints}>
                <IconSymbol name="star.fill" size={24} color={colors.primaryRed} />
                <Text style={styles.pointsValue}>{user.loyaltyPoints}</Text>
                <Text style={styles.pointsLabel}>
                  {isArabic ? 'نقطة' : 'Points'}
                </Text>
              </View>
              
              <View style={[styles.tierBadge, { backgroundColor: currentTier.color }]}>
                <Text style={styles.tierText}>
                  {isArabic ? currentTier.nameAr : currentTier.name}
                </Text>
              </View>
            </View>
            
            {nextTier && (
              <View style={styles.tierProgress}>
                <Text style={styles.tierProgressText}>
                  {isArabic 
                    ? `${nextTier.minPoints - user.loyaltyPoints} نقطة للوصول إلى ${nextTier.nameAr}`
                    : `${nextTier.minPoints - user.loyaltyPoints} points to ${nextTier.name}`
                  }
                </Text>
                <View style={styles.tierProgressBar}>
                  <View 
                    style={[
                      styles.tierProgressFill, 
                      { width: `${progressToNextTier * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            )}
            
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>
                {isArabic ? 'المزايا الحالية:' : 'Current Benefits:'}
              </Text>
              {currentTier.benefits.map((benefit, index) => (
                <Text key={index} style={styles.benefitItem}>
                  • {isArabic ? currentTier.benefitsAr[index] : benefit}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'الإنجازات' : 'Achievements'}
          </Text>
          {mockAchievements.map(renderAchievement)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
          </Text>
          <View style={styles.quickActions}>
            <Pressable 
              style={styles.quickActionButton}
              onPress={() => router.push('/orders')}
            >
              <IconSymbol name="list.bullet" size={24} color={colors.primaryRed} />
              <Text style={styles.quickActionText}>
                {isArabic ? 'طلباتي' : 'My Orders'}
              </Text>
            </Pressable>
            
            <Pressable 
              style={styles.quickActionButton}
              onPress={() => router.push('/cart')}
            >
              <IconSymbol name="heart.fill" size={24} color={colors.primaryRed} />
              <Text style={styles.quickActionText}>
                {isArabic ? 'المفضلة' : 'Wishlist'}
              </Text>
            </Pressable>
            
            <Pressable style={styles.quickActionButton}>
              <IconSymbol name="creditcard.fill" size={24} color={colors.primaryRed} />
              <Text style={styles.quickActionText}>
                {isArabic ? 'المدفوعات' : 'Payments'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'الإعدادات' : 'Settings'}
          </Text>
          
          <View style={styles.settingsContainer}>
            {renderSettingItem(
              'person.circle.fill',
              'Edit Profile',
              'تعديل الملف الشخصي',
              () => console.log('Edit profile')
            )}
            
            {renderSettingItem(
              'lock.fill',
              'Change Password',
              'تغيير كلمة المرور',
              () => console.log('Change password')
            )}
            
            {renderSettingItem(
              'globe',
              'Language',
              'اللغة',
              () => setIsArabic(!isArabic),
              <Text style={styles.settingValue}>
                {isArabic ? 'العربية' : 'English'}
              </Text>
            )}
            
            {renderSettingItem(
              'moon.fill',
              'Dark Mode',
              'الوضع المظلم',
              undefined,
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.border, true: colors.primaryRed }}
                thumbColor={colors.textPrimary}
              />,
              false
            )}
            
            {renderSettingItem(
              'bell.fill',
              'Notifications',
              'الإشعارات',
              undefined,
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primaryRed }}
                thumbColor={colors.textPrimary}
              />,
              false
            )}
            
            {renderSettingItem(
              'questionmark.circle.fill',
              'Help & Support',
              'المساعدة والدعم',
              () => console.log('Help & Support')
            )}
            
            {renderSettingItem(
              'doc.text.fill',
              'Privacy Policy',
              'سياسة الخصوصية',
              () => console.log('Privacy Policy')
            )}
            
            {renderSettingItem(
              'info.circle.fill',
              'About',
              'حول التطبيق',
              () => console.log('About')
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={colors.error} />
            <Text style={styles.logoutText}>
              {isArabic ? 'تسجيل الخروج' : 'Logout'}
            </Text>
          </Pressable>
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

  // Profile header styles
  profileHeader: {
    marginBottom: spacing.lg,
  },
  profileGradient: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  statValue: {
    fontSize: 20,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Loyalty styles
  loyaltyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.medium,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  loyaltyPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 24,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  pointsLabel: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  tierBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tierText: {
    fontSize: 14,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  tierProgress: {
    marginBottom: spacing.md,
  },
  tierProgressText: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  tierProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  tierProgressFill: {
    height: '100%',
    backgroundColor: colors.primaryRed,
  },
  benefitsContainer: {
    marginTop: spacing.sm,
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  benefitItem: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  // Achievement styles
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  achievementIconUnlocked: {
    backgroundColor: colors.success,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  achievementTitleUnlocked: {
    color: colors.textPrimary,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryRed,
  },
  progressText: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },

  // Quick actions styles
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.small,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  // Settings styles
  settingsContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    marginLeft: spacing.md,
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

  // Logout styles
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.error,
    marginLeft: spacing.sm,
  },
});

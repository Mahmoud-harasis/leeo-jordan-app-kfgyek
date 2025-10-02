
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, typography } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  gradient: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to Leeo',
    titleAr: 'مرحباً بك في ليو',
    description: 'Your ultimate shopping destination in Jordan. Discover amazing products with fast delivery.',
    descriptionAr: 'وجهتك المثلى للتسوق في الأردن. اكتشف منتجات رائعة مع توصيل سريع.',
    icon: 'house.fill',
    gradient: [colors.primaryRed, '#FF6B6B'],
  },
  {
    id: 2,
    title: 'Smart Shopping',
    titleAr: 'تسوق ذكي',
    description: 'AI-powered recommendations, AR product views, and personalized experience just for you.',
    descriptionAr: 'توصيات مدعومة بالذكاء الاصطناعي وعرض المنتجات بالواقع المعزز وتجربة شخصية مخصصة لك.',
    icon: 'brain.head.profile',
    gradient: ['#FF6B6B', '#4ECDC4'],
  },
  {
    id: 3,
    title: 'Fast Delivery',
    titleAr: 'توصيل سريع',
    description: 'Track your orders in real-time with our advanced delivery system across Jordan.',
    descriptionAr: 'تتبع طلباتك في الوقت الفعلي مع نظام التوصيل المتقدم في جميع أنحاء الأردن.',
    icon: 'shippingbox.fill',
    gradient: ['#4ECDC4', '#45B7D1'],
  },
  {
    id: 4,
    title: 'Loyalty Rewards',
    titleAr: 'مكافآت الولاء',
    description: 'Earn points with every purchase and unlock exclusive rewards and discounts.',
    descriptionAr: 'اكسب نقاط مع كل عملية شراء واحصل على مكافآت وخصومات حصرية.',
    icon: 'star.fill',
    gradient: ['#45B7D1', colors.primaryRed],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isArabic, setIsArabic] = useState(true); // Default to Arabic for Jordan
  const scrollX = useSharedValue(0);
  const slideRef = useRef<any>(null);

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [0, width, width * 2, width * 3],
            [0, 30, 60, 90],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollX.value = withSpring(nextIndex * width);
    } else {
      // Navigate to login screen
      router.replace('/login');
    }
  };

  const skipOnboarding = () => {
    router.replace('/login');
  };

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const renderSlide = (item: OnboardingSlide, index: number) => {
    const slideAnimatedStyle = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
      const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP);
      const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP);

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View key={item.id} style={[styles.slide, slideAnimatedStyle]}>
        <LinearGradient
          colors={item.gradient}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name={item.icon as any} size={80} color={colors.textPrimary} />
        </LinearGradient>
        
        <Text style={[styles.title, isArabic && styles.arabicText]}>
          {isArabic ? item.titleAr : item.title}
        </Text>
        
        <Text style={[styles.description, isArabic && styles.arabicText]}>
          {isArabic ? item.descriptionAr : item.description}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={toggleLanguage} style={styles.languageButton}>
          <Text style={styles.languageText}>
            {isArabic ? 'English' : 'العربية'}
          </Text>
        </Pressable>
        
        <Pressable onPress={skipOnboarding} style={styles.skipButton}>
          <Text style={styles.skipText}>
            {isArabic ? 'تخطي' : 'Skip'}
          </Text>
        </Pressable>
      </View>

      {/* Slides */}
      <View style={styles.slidesContainer}>
        {onboardingData.map((item, index) => renderSlide(item, index))}
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
          <Animated.View style={[styles.activeDotIndicator, animatedDotStyle]} />
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <Pressable onPress={nextSlide} style={styles.nextButton}>
          <LinearGradient
            colors={[colors.primaryRed, '#FF6B6B']}
            style={styles.nextButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1
                ? (isArabic ? 'ابدأ التسوق' : 'Start Shopping')
                : (isArabic ? 'التالي' : 'Next')
              }
            </Text>
            <IconSymbol 
              name={isArabic ? 'chevron.left' : 'chevron.right'} 
              size={20} 
              color={colors.textPrimary} 
            />
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  languageButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
  },
  languageText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
  },
  skipButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    position: 'absolute',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  pagination: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    backgroundColor: colors.primaryRed,
  },
  activeDotIndicator: {
    position: 'absolute',
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryRed,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  nextButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  nextButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    marginRight: spacing.sm,
  },
});

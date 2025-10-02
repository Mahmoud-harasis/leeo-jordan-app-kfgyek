
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  Image,
  Platform,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Stack, Link, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'new' | 'sale' | 'hot' | 'exclusive';
  discount?: number;
}

interface Banner {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  image: string;
  color: string;
  action: string;
}

const categories: Category[] = [
  { id: '1', name: 'Electronics', nameAr: 'إلكترونيات', icon: 'iphone', color: '#4A90E2', productCount: 245 },
  { id: '2', name: 'Fashion', nameAr: 'أزياء', icon: 'tshirt.fill', color: '#F5A623', productCount: 189 },
  { id: '3', name: 'Home & Garden', nameAr: 'منزل وحديقة', icon: 'house.fill', color: '#7ED321', productCount: 156 },
  { id: '4', name: 'Sports', nameAr: 'رياضة', icon: 'figure.run', color: '#D0021B', productCount: 98 },
  { id: '5', name: 'Books', nameAr: 'كتب', icon: 'book.fill', color: '#9013FE', productCount: 234 },
  { id: '6', name: 'Beauty', nameAr: 'جمال', icon: 'heart.fill', color: '#E91E63', productCount: 167 },
];

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones Pro',
    nameAr: 'سماعات لاسلكية برو',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    badge: 'sale',
    discount: 31,
  },
  {
    id: '2',
    name: 'Smart Watch Series 8',
    nameAr: 'ساعة ذكية سلسلة 8',
    price: 299.99,
    rating: 4.9,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    badge: 'new',
  },
  {
    id: '3',
    name: 'Premium Coffee Maker',
    nameAr: 'صانعة قهوة فاخرة',
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    badge: 'hot',
    discount: 20,
  },
  {
    id: '4',
    name: 'Bluetooth Speaker',
    nameAr: 'مكبر صوت بلوتوث',
    price: 79.99,
    rating: 4.6,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    badge: 'exclusive',
  },
];

const banners: Banner[] = [
  {
    id: '1',
    title: 'Winter Sale',
    titleAr: 'تخفيضات الشتاء',
    subtitle: 'Up to 70% off on selected items',
    subtitleAr: 'خصم يصل إلى 70% على منتجات مختارة',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop',
    color: '#FF6B6B',
    action: 'shop_sale',
  },
  {
    id: '2',
    title: 'New Arrivals',
    titleAr: 'وصولات جديدة',
    subtitle: 'Discover the latest trends',
    subtitleAr: 'اكتشف أحدث الصيحات',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
    color: '#4ECDC4',
    action: 'shop_new',
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isArabic, setIsArabic] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Mock user data
  const user = {
    name: 'Ahmed',
    nameAr: 'أحمد',
    loyaltyPoints: 1250,
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getBadgeColor = (badge: Product['badge']) => {
    switch (badge) {
      case 'new':
        return colors.success;
      case 'sale':
        return colors.primaryRed;
      case 'hot':
        return colors.warning;
      case 'exclusive':
        return '#9C27B0';
      default:
        return colors.textSecondary;
    }
  };

  const getBadgeText = (badge: Product['badge']) => {
    const badgeMap = {
      new: { en: 'NEW', ar: 'جديد' },
      sale: { en: 'SALE', ar: 'تخفيض' },
      hot: { en: 'HOT', ar: 'مميز' },
      exclusive: { en: 'EXCLUSIVE', ar: 'حصري' },
    };
    return badge ? (isArabic ? badgeMap[badge].ar : badgeMap[badge].en) : '';
  };

  const renderHeaderRight = () => (
    <View style={styles.headerRight}>
      <Pressable onPress={() => setIsArabic(!isArabic)} style={styles.headerButton}>
        <Text style={styles.languageText}>
          {isArabic ? 'EN' : 'عر'}
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push('/cart')} style={styles.headerButton}>
        <IconSymbol name="cart.fill" size={24} color={colors.textPrimary} />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>3</Text>
        </View>
      </Pressable>
    </View>
  );

  const renderBanner = ({ item, index }: { item: Banner; index: number }) => (
    <Pressable style={styles.bannerContainer}>
      <LinearGradient
        colors={[item.color, `${item.color}80`]}
        style={styles.banner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>
            {isArabic ? item.titleAr : item.title}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {isArabic ? item.subtitleAr : item.subtitle}
          </Text>
          <Pressable style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>
              {isArabic ? 'تسوق الآن' : 'Shop Now'}
            </Text>
            <IconSymbol name="arrow.right" size={16} color={colors.textPrimary} />
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <Pressable style={styles.categoryCard}>
      <LinearGradient
        colors={[item.color, `${item.color}80`]}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <IconSymbol name={item.icon as any} size={32} color={colors.textPrimary} />
      </LinearGradient>
      <Text style={styles.categoryName} numberOfLines={2}>
        {isArabic ? item.nameAr : item.name}
      </Text>
      <Text style={styles.categoryCount}>
        {item.productCount} {isArabic ? 'منتج' : 'items'}
      </Text>
    </Pressable>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.badge && (
          <View style={[styles.productBadge, { backgroundColor: getBadgeColor(item.badge) }]}>
            <Text style={styles.productBadgeText}>
              {getBadgeText(item.badge)}
            </Text>
          </View>
        )}
        <Pressable style={styles.favoriteButton}>
          <IconSymbol name="heart" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {isArabic ? item.nameAr : item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={14} color={colors.warning} />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price.toFixed(2)} JOD</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>
              {item.originalPrice.toFixed(2)} JOD
            </Text>
          )}
        </View>
        
        {item.discount && (
          <Text style={styles.discountText}>
            {isArabic ? `وفر ${item.discount}%` : `Save ${item.discount}%`}
          </Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>
                {isArabic ? `مرحباً، ${user.nameAr}` : `Hello, ${user.name}`}
              </Text>
              <View style={styles.loyaltyContainer}>
                <IconSymbol name="star.fill" size={16} color={colors.primaryRed} />
                <Text style={styles.loyaltyPoints}>
                  {user.loyaltyPoints} {isArabic ? 'نقطة' : 'pts'}
                </Text>
              </View>
            </View>
          ),
          headerRight: renderHeaderRight,
        }}
      />

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryRed}
            colors={[colors.primaryRed]}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={isArabic ? 'ابحث عن المنتجات...' : 'Search products...'}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
          
          {/* Guest Checkout Button */}
          <Pressable 
            style={styles.guestButton}
            onPress={() => router.push('/login')}
          >
            <IconSymbol name="bolt.fill" size={20} color={colors.primaryRed} />
          </Pressable>
        </View>

        {/* Banners */}
        <View style={styles.section}>
          <FlatList
            data={banners}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={width - spacing.md * 2}
            decelerationRate="fast"
            contentContainerStyle={styles.bannersContainer}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isArabic ? 'الفئات' : 'Categories'}
            </Text>
            <Pressable>
              <Text style={styles.seeAllText}>
                {isArabic ? 'عرض الكل' : 'See All'}
              </Text>
            </Pressable>
          </View>
          
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isArabic ? 'منتجات مميزة' : 'Featured Products'}
            </Text>
            <Pressable>
              <Text style={styles.seeAllText}>
                {isArabic ? 'عرض الكل' : 'See All'}
              </Text>
            </Pressable>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        {/* Recommended Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isArabic ? 'موصى لك' : 'Recommended for You'}
            </Text>
            <Pressable>
              <Text style={styles.seeAllText}>
                {isArabic ? 'عرض الكل' : 'See All'}
              </Text>
            </Pressable>
          </View>
          
          <FlatList
            data={featuredProducts.slice().reverse()}
            renderItem={renderProduct}
            keyExtractor={(item) => `rec_${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
          </Text>
          
          <View style={styles.quickActionsGrid}>
            <Pressable 
              style={styles.quickActionCard}
              onPress={() => router.push('/orders')}
            >
              <IconSymbol name="list.bullet" size={24} color={colors.primaryRed} />
              <Text style={styles.quickActionText}>
                {isArabic ? 'طلباتي' : 'My Orders'}
              </Text>
            </Pressable>
            
            <Pressable style={styles.quickActionCard}>
              <IconSymbol name="heart.fill" size={24} color={colors.primaryRed} />
              <Text style={styles.quickActionText}>
                {isArabic ? 'المفضلة' : 'Wishlist'}
              </Text>
            </Pressable>
            
            <Pressable style={styles.quickActionCard}>
              <IconSymbol name="percent" size={24} color={colors.primaryRed} />
              <Text style={styles.quickActionText}>
                {isArabic ? 'العروض' : 'Deals'}
              </Text>
            </Pressable>
            
            <Pressable 
              style={styles.quickActionCard}
              onPress={() => router.push('/settings')}
            >
              <IconSymbol name="gearshape.fill" size={24} color={colors.primaryRed} />
              <Text style={styles.quickActionText}>
                {isArabic ? 'الإعدادات' : 'Settings'}
              </Text>
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
    backgroundColor: colors.background,
  },
  
  // Header styles
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  loyaltyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  loyaltyPoints: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.primaryRed,
    marginLeft: spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
    position: 'relative',
  },
  languageText: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primaryRed,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },

  // Search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    marginLeft: spacing.sm,
  },
  guestButton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },

  // Section styles
  section: {
    paddingVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.primaryRed,
  },

  // Banner styles
  bannersContainer: {
    paddingHorizontal: spacing.md,
  },
  bannerContainer: {
    width: width - spacing.md * 2,
    marginRight: spacing.md,
  },
  banner: {
    height: 160,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    justifyContent: 'center',
    ...shadows.medium,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.md,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },

  // Category styles
  categoriesContainer: {
    paddingHorizontal: spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 100,
  },
  categoryGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Product styles
  productsContainer: {
    paddingHorizontal: spacing.md,
  },
  productCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    width: 180,
    ...shadows.medium,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  productBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  productBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: spacing.sm,
  },
  productInfo: {
    padding: spacing.md,
  },
  productName: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    minHeight: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.primaryRed,
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  discountText: {
    fontSize: 12,
    fontFamily: typography.fontFamilyMedium,
    color: colors.success,
  },

  // Quick actions styles
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    width: (width - spacing.md * 3) / 2,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

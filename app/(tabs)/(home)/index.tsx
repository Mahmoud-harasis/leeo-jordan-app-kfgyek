
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from "@/styles/commonStyles";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { Stack, Link, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import AIRecommendations from '@/components/AIRecommendations';
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
  Alert,
} from "react-native";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  guestCheckoutButton: {
    backgroundColor: colors.warning,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    height: 180,
    marginVertical: spacing.md,
  },
  banner: {
    width: width - spacing.md * 2,
    height: 160,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xs,
    overflow: 'hidden',
    ...shadows.medium,
  },
  bannerContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primaryRed,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingHorizontal: spacing.sm,
  },
  categoryCard: {
    width: 100,
    height: 100,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  categoryIcon: {
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryCount: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  productsContainer: {
    paddingHorizontal: spacing.sm,
  },
  productCard: {
    width: 160,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.xs,
    ...shadows.medium,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    backgroundColor: colors.border,
  },
  productContent: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    numberOfLines: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryRed,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
});

export default function HomeScreen() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const banners: Banner[] = [
    {
      id: '1',
      title: 'New iPhone 15 Pro',
      titleAr: 'آيفون 15 برو الجديد',
      subtitle: 'Experience the future of mobile technology',
      subtitleAr: 'اختبر مستقبل تكنولوجيا الهواتف المحمولة',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=200&fit=crop',
      color: colors.primaryRed,
      action: 'shop_now',
    },
    {
      id: '2',
      title: 'Black Friday Sale',
      titleAr: 'تخفيضات الجمعة السوداء',
      subtitle: 'Up to 50% off on selected items',
      subtitleAr: 'خصم يصل إلى 50% على المنتجات المختارة',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop',
      color: colors.error,
      action: 'view_deals',
    },
  ];

  const categories: Category[] = [
    { id: '1', name: 'Electronics', nameAr: 'إلكترونيات', icon: 'iphone', color: colors.primaryRed, productCount: 245 },
    { id: '2', name: 'Fashion', nameAr: 'أزياء', icon: 'tshirt', color: colors.warning, productCount: 189 },
    { id: '3', name: 'Home', nameAr: 'منزل', icon: 'house', color: colors.success, productCount: 156 },
    { id: '4', name: 'Sports', nameAr: 'رياضة', icon: 'figure.run', color: colors.error, productCount: 98 },
    { id: '5', name: 'Books', nameAr: 'كتب', icon: 'book', color: colors.primaryRed, productCount: 234 },
  ];

  const featuredProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      nameAr: 'آيفون 15 برو ماكس',
      price: 1299,
      originalPrice: 1399,
      rating: 4.8,
      reviewCount: 2847,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      badge: 'new',
    },
    {
      id: '2',
      name: 'MacBook Air M2',
      nameAr: 'ماك بوك إير إم 2',
      price: 1199,
      originalPrice: 1299,
      rating: 4.9,
      reviewCount: 892,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      badge: 'sale',
    },
    {
      id: '3',
      name: 'AirPods Pro 2nd Gen',
      nameAr: 'إيربودز برو الجيل الثاني',
      price: 249,
      rating: 4.7,
      reviewCount: 1523,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
      badge: 'hot',
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getBadgeColor = (badge: Product['badge']) => {
    switch (badge) {
      case 'new': return colors.success;
      case 'sale': return colors.error;
      case 'hot': return colors.warning;
      case 'exclusive': return colors.primaryRed;
      default: return colors.primaryRed;
    }
  };

  const getBadgeText = (badge: Product['badge']) => {
    switch (badge) {
      case 'new': return 'NEW';
      case 'sale': return 'SALE';
      case 'hot': return 'HOT';
      case 'exclusive': return 'EXCLUSIVE';
      default: return '';
    }
  };

  const handleGuestCheckout = () => {
    Alert.alert(
      'Guest Checkout',
      'Continue as guest for quick checkout without creating an account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.push('/cart') }
      ]
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const renderHeaderRight = () => (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      <Pressable onPress={() => router.push('/cart')}>
        <IconSymbol name="bag" size={24} color={colors.textPrimary} />
      </Pressable>
      <Pressable onPress={() => router.push('/profile')}>
        <IconSymbol name="person.circle" size={24} color={colors.textPrimary} />
      </Pressable>
    </View>
  );

  const renderBanner = ({ item, index }: { item: Banner; index: number }) => (
    <Pressable style={styles.banner}>
      <LinearGradient
        colors={[item.color, `${item.color}CC`]}
        style={styles.bannerContent}
      >
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </LinearGradient>
    </Pressable>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <Pressable 
      style={styles.categoryCard}
      onPress={() => router.push(`/category/${item.id}`)}
    >
      <IconSymbol name={item.icon} size={24} color={item.color} style={styles.categoryIcon} />
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.productCount} items</Text>
    </Pressable>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      {item.badge && (
        <View style={[styles.badge, { backgroundColor: getBadgeColor(item.badge) }]}>
          <Text style={styles.badgeText}>{getBadgeText(item.badge)}</Text>
        </View>
      )}

      <View style={styles.productContent}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>JD {item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>JD {item.originalPrice}</Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={12} color={colors.warning} />
          <Text style={styles.rating}>
            {item.rating} ({item.reviewCount})
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Leeo',
          headerRight: renderHeaderRight,
        }} 
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome to Leeo! 👋</Text>
          <Text style={styles.subtitle}>Discover amazing products in Jordan</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
            
            <Pressable style={styles.guestCheckoutButton} onPress={handleGuestCheckout}>
              <IconSymbol name="bolt.fill" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={styles.quickAction} onPress={() => router.push('/orders')}>
            <IconSymbol name="list.clipboard" size={20} color={colors.primaryRed} />
            <Text style={styles.quickActionText}>Orders</Text>
          </Pressable>
          
          <Pressable style={styles.quickAction} onPress={() => router.push('/profile')}>
            <IconSymbol name="star.fill" size={20} color={colors.warning} />
            <Text style={styles.quickActionText}>Loyalty</Text>
          </Pressable>
          
          <Pressable style={styles.quickAction} onPress={() => router.push('/settings')}>
            <IconSymbol name="bell" size={20} color={colors.success} />
            <Text style={styles.quickActionText}>Notifications</Text>
          </Pressable>
          
          <Pressable style={styles.quickAction} onPress={() => Alert.alert('Support', 'Contact: +962 6 123 4567')}>
            <IconSymbol name="questionmark.circle" size={20} color={colors.textSecondary} />
            <Text style={styles.quickActionText}>Support</Text>
          </Pressable>
        </View>

        {/* Banners */}
        <FlatList
          data={banners}
          renderItem={renderBanner}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerContainer}
        />

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable>
            <Text style={styles.viewAllText}>View All</Text>
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

        {/* AI Recommendations */}
        <AIRecommendations
          title="Recommended for You"
          maxItems={5}
          showReasons={true}
        />

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <Pressable>
            <Text style={styles.viewAllText}>View All</Text>
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

        {/* More AI Recommendations */}
        <AIRecommendations
          title="Trending in Jordan"
          maxItems={5}
          showReasons={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

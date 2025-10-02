
import React, { useState } from "react";
import { Stack, Link, router } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  Image,
  Platform,
  FlatList
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles, spacing, borderRadius, shadows } from "@/styles/commonStyles";
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for categories
const categories = [
  { id: '1', name: 'Electronics', icon: 'tv', color: '#007AFF' },
  { id: '2', name: 'Fashion', icon: 'tshirt', color: '#FF9500' },
  { id: '3', name: 'Home', icon: 'house', color: '#34C759' },
  { id: '4', name: 'Sports', icon: 'figure.run', color: '#FF3B30' },
  { id: '5', name: 'Books', icon: 'book', color: '#5856D6' },
  { id: '6', name: 'Beauty', icon: 'heart', color: '#FF2D92' },
];

// Mock data for featured products
const featuredProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 'JD 1,199',
    originalPrice: 'JD 1,299',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    rating: 4.8,
    discount: '8%',
  },
  {
    id: '2',
    name: 'Nike Air Max',
    price: 'JD 89',
    originalPrice: 'JD 120',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    rating: 4.6,
    discount: '26%',
  },
  {
    id: '3',
    name: 'MacBook Pro',
    price: 'JD 2,499',
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    rating: 4.9,
    discount: null,
  },
  {
    id: '4',
    name: 'Samsung TV 55"',
    price: 'JD 699',
    originalPrice: 'JD 899',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop',
    rating: 4.5,
    discount: '22%',
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const renderHeaderRight = () => (
    <View style={styles.headerActions}>
      <Pressable
        onPress={() => router.push('/cart')}
        style={[styles.headerButton, { backgroundColor: colors.card }]}
      >
        <IconSymbol name="cart" color={colors.textPrimary} size={20} />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>3</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => router.push('/(tabs)/profile')}
        style={[styles.headerButton, { backgroundColor: colors.card }]}
      >
        <IconSymbol name="person.circle" color={colors.textPrimary} size={20} />
      </Pressable>
    </View>
  );

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <Pressable style={[styles.categoryCard, { backgroundColor: colors.card }]}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <IconSymbol name={item.icon as any} color="white" size={24} />
      </View>
      <Text style={[styles.categoryName, { color: colors.textPrimary }]}>{item.name}</Text>
    </Pressable>
  );

  const renderProduct = ({ item }: { item: typeof featuredProducts[0] }) => (
    <Pressable 
      style={[styles.productCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      )}
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" color="#FFD700" size={12} />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primaryRed }]}>{item.price}</Text>
          {item.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              {item.originalPrice}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Leeo - Jordan",
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
        }}
      />
      <SafeAreaView style={[commonStyles.safeArea]}>
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Search Bar */}
          <View style={[commonStyles.searchBar, { backgroundColor: colors.card }]}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search products in Jordan..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" color={colors.textSecondary} size={20} />
              </Pressable>
            )}
          </View>

          {/* Welcome Banner */}
          <LinearGradient
            colors={[colors.primaryRed, '#B91C1C']}
            style={styles.welcomeBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.welcomeTitle}>مرحباً بك في Leeo</Text>
              <Text style={styles.welcomeSubtitle}>Welcome to Jordan's #1 Shopping App</Text>
              <Text style={styles.welcomeDescription}>
                Discover amazing products with fast delivery across Jordan
              </Text>
            </View>
            <View style={styles.bannerIcon}>
              <IconSymbol name="gift" color="white" size={40} />
            </View>
          </LinearGradient>

          {/* Categories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[commonStyles.heading, { color: colors.textPrimary }]}>Categories</Text>
              <Pressable>
                <Text style={[styles.seeAll, { color: colors.primaryRed }]}>See All</Text>
              </Pressable>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>

          {/* Featured Products Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[commonStyles.heading, { color: colors.textPrimary }]}>Featured Products</Text>
              <Pressable>
                <Text style={[styles.seeAll, { color: colors.primaryRed }]}>See All</Text>
              </Pressable>
            </View>
            <FlatList
              data={featuredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[commonStyles.heading, { color: colors.textPrimary }]}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <Pressable 
                style={[styles.quickActionCard, { backgroundColor: colors.card }]}
                onPress={() => router.push('/login')}
              >
                <IconSymbol name="person.badge.plus" color={colors.primaryRed} size={24} />
                <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Sign Up</Text>
              </Pressable>
              <Pressable 
                style={[styles.quickActionCard, { backgroundColor: colors.card }]}
                onPress={() => router.push('/cart')}
              >
                <IconSymbol name="cart.badge.plus" color={colors.primaryRed} size={24} />
                <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Guest Order</Text>
              </Pressable>
              <Pressable 
                style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              >
                <IconSymbol name="location" color={colors.primaryRed} size={24} />
                <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>Track Order</Text>
              </Pressable>
            </View>
          </View>

          {/* Bottom Padding for FloatingTabBar */}
          <View style={{ height: Platform.OS !== 'ios' ? 100 : 20 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.primaryRed,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  welcomeBanner: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
  },
  bannerContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: spacing.xs,
    fontFamily: 'Inter_700Bold',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: spacing.xs,
    fontFamily: 'Inter_500Medium',
  },
  welcomeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter_400Regular',
  },
  bannerIcon: {
    marginLeft: spacing.md,
  },
  section: {
    marginVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  categoriesList: {
    paddingHorizontal: spacing.md,
  },
  categoryCard: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    ...shadows.small,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
  productsList: {
    paddingHorizontal: spacing.md,
  },
  productCard: {
    width: 160,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    ...shadows.medium,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primaryRed,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter_700Bold',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    backgroundColor: colors.border,
  },
  productInfo: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    fontFamily: 'Inter_500Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  quickActionCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.small,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing.xs,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
});

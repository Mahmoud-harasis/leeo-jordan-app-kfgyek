
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, spacing, borderRadius, typography, shadows } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'new' | 'sale' | 'hot' | 'exclusive' | 'recommended';
  category: string;
  aiScore: number; // AI recommendation confidence score
  reason: string; // Why this product is recommended
}

interface AIRecommendationsProps {
  userId?: string;
  currentProductId?: string;
  category?: string;
  maxItems?: number;
  title?: string;
  showReasons?: boolean;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryRed,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  aiLabelText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: spacing.xs,
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
    marginBottom: spacing.xs,
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
    backgroundColor: colors.primaryRed,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  aiScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  aiScore: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  reasonContainer: {
    backgroundColor: colors.background,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  reasonText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 14,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  viewAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primaryRed,
    fontWeight: '500',
  },
});

export default function AIRecommendations({
  userId,
  currentProductId,
  category,
  maxItems = 10,
  title = 'Recommended for You',
  showReasons = true,
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate AI recommendation API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI-generated recommendations
      const mockRecommendations: Product[] = [
        {
          id: '1',
          name: 'iPhone 15 Pro Max',
          nameAr: 'آيفون 15 برو ماكس',
          price: 1299,
          originalPrice: 1399,
          rating: 4.8,
          reviewCount: 2847,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
          badge: 'recommended',
          category: 'Electronics',
          aiScore: 0.95,
          reason: 'Based on your recent purchases and browsing history',
        },
        {
          id: '2',
          name: 'AirPods Pro 2nd Gen',
          nameAr: 'إيربودز برو الجيل الثاني',
          price: 249,
          rating: 4.7,
          reviewCount: 1523,
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
          badge: 'hot',
          category: 'Audio',
          aiScore: 0.89,
          reason: 'Frequently bought together with similar products',
        },
        {
          id: '3',
          name: 'MacBook Air M2',
          nameAr: 'ماك بوك إير إم 2',
          price: 1199,
          originalPrice: 1299,
          rating: 4.9,
          reviewCount: 892,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
          badge: 'sale',
          category: 'Computers',
          aiScore: 0.87,
          reason: 'Perfect complement to your iPhone',
        },
        {
          id: '4',
          name: 'Apple Watch Series 9',
          nameAr: 'ساعة آبل سيريز 9',
          price: 399,
          rating: 4.6,
          reviewCount: 1247,
          image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300&h=300&fit=crop',
          badge: 'new',
          category: 'Wearables',
          aiScore: 0.84,
          reason: 'Trending in your area',
        },
        {
          id: '5',
          name: 'iPad Pro 12.9"',
          nameAr: 'آيباد برو 12.9 بوصة',
          price: 1099,
          rating: 4.8,
          reviewCount: 634,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
          badge: 'exclusive',
          category: 'Tablets',
          aiScore: 0.82,
          reason: 'Matches your professional needs',
        },
      ];

      // Simulate AI filtering and sorting
      const filteredRecommendations = mockRecommendations
        .filter(product => product.id !== currentProductId)
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, maxItems);

      setRecommendations(filteredRecommendations);
      console.log('AI Recommendations loaded:', filteredRecommendations.length);
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [userId, currentProductId, category, maxItems]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const getBadgeColor = (badge: Product['badge']) => {
    switch (badge) {
      case 'new': return colors.success;
      case 'sale': return colors.error;
      case 'hot': return colors.warning;
      case 'exclusive': return colors.primaryRed;
      case 'recommended': return colors.primaryRed;
      default: return colors.primaryRed;
    }
  };

  const getBadgeText = (badge: Product['badge']) => {
    switch (badge) {
      case 'new': return 'NEW';
      case 'sale': return 'SALE';
      case 'hot': return 'HOT';
      case 'exclusive': return 'EXCLUSIVE';
      case 'recommended': return 'AI PICK';
      default: return '';
    }
  };

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

        <View style={styles.aiScoreContainer}>
          <IconSymbol name="brain.head.profile" size={12} color={colors.warning} />
          <Text style={styles.aiScore}>
            {Math.round(item.aiScore * 100)}% match
          </Text>
        </View>

        {showReasons && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonText} numberOfLines={2}>
              {item.reason}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.aiLabel}>
            <IconSymbol name="brain.head.profile" size={12} color={colors.textPrimary} />
            <Text style={styles.aiLabelText}>AI</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <IconSymbol name="brain.head.profile" size={48} color={colors.primaryRed} />
          <Text style={styles.loadingText}>AI is analyzing your preferences...</Text>
        </View>
      </View>
    );
  }

  if (recommendations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.aiLabel}>
            <IconSymbol name="brain.head.profile" size={12} color={colors.textPrimary} />
            <Text style={styles.aiLabelText}>AI</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            No recommendations available at the moment. Browse more products to improve AI suggestions.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.aiLabel}>
          <IconSymbol name="brain.head.profile" size={12} color={colors.textPrimary} />
          <Text style={styles.aiLabelText}>AI</Text>
        </View>
      </View>

      <FlatList
        data={recommendations}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.sm }}
      />

      {recommendations.length >= maxItems && (
        <Pressable style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All AI Recommendations</Text>
        </Pressable>
      )}
    </View>
  );
}

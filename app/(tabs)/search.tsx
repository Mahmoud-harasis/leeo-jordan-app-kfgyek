
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');

interface SearchFilter {
  id: string;
  name: string;
  nameAr: string;
  active: boolean;
}

interface SearchResult {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'new' | 'sale' | 'hot' | 'exclusive';
  category: string;
  categoryAr: string;
}

const searchFilters: SearchFilter[] = [
  { id: '1', name: 'All', nameAr: 'الكل', active: true },
  { id: '2', name: 'Electronics', nameAr: 'إلكترونيات', active: false },
  { id: '3', name: 'Fashion', nameAr: 'أزياء', active: false },
  { id: '4', name: 'Home', nameAr: 'منزل', active: false },
  { id: '5', name: 'Sports', nameAr: 'رياضة', active: false },
  { id: '6', name: 'Books', nameAr: 'كتب', active: false },
];

const recentSearches = [
  'Wireless headphones',
  'Smart watch',
  'Coffee maker',
  'Bluetooth speaker',
  'Phone case',
];

const trendingSearches = [
  'Winter jackets',
  'Gaming laptop',
  'Fitness tracker',
  'Air purifier',
  'Wireless charger',
];

const mockSearchResults: SearchResult[] = [
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
    category: 'Electronics',
    categoryAr: 'إلكترونيات',
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
    category: 'Electronics',
    categoryAr: 'إلكترونيات',
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
    category: 'Home',
    categoryAr: 'منزل',
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
    category: 'Electronics',
    categoryAr: 'إلكترونيات',
  },
];

export default function SearchScreen() {
  const [isArabic, setIsArabic] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilter[]>(searchFilters);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      setShowResults(true);
      // Simulate API call
      setTimeout(() => {
        setSearchResults(mockSearchResults);
        setIsSearching(false);
      }, 500);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const toggleFilter = (filterId: string) => {
    setFilters(prev => 
      prev.map(filter => ({
        ...filter,
        active: filter.id === filterId ? true : filter.id === '1' ? filterId === '1' : false
      }))
    );
  };

  const getBadgeColor = (badge: SearchResult['badge']) => {
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

  const getBadgeText = (badge: SearchResult['badge']) => {
    const badgeMap = {
      new: { en: 'NEW', ar: 'جديد' },
      sale: { en: 'SALE', ar: 'تخفيض' },
      hot: { en: 'HOT', ar: 'مميز' },
      exclusive: { en: 'EXCLUSIVE', ar: 'حصري' },
    };
    return badge ? (isArabic ? badgeMap[badge].ar : badgeMap[badge].en) : '';
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <Pressable 
      style={styles.resultCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.resultImageContainer}>
        <Image source={{ uri: item.image }} style={styles.resultImage} />
        {item.badge && (
          <View style={[styles.resultBadge, { backgroundColor: getBadgeColor(item.badge) }]}>
            <Text style={styles.resultBadgeText}>
              {getBadgeText(item.badge)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.resultInfo}>
        <Text style={styles.resultCategory}>
          {isArabic ? item.categoryAr : item.category}
        </Text>
        <Text style={styles.resultName} numberOfLines={2}>
          {isArabic ? item.nameAr : item.name}
        </Text>
        
        <View style={styles.resultRating}>
          <IconSymbol name="star.fill" size={14} color={colors.warning} />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
        
        <View style={styles.resultPriceContainer}>
          <Text style={styles.resultPrice}>{item.price.toFixed(2)} JOD</Text>
          {item.originalPrice && (
            <Text style={styles.resultOriginalPrice}>
              {item.originalPrice.toFixed(2)} JOD
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  const renderSearchSuggestion = (suggestion: string, index: number) => (
    <Pressable 
      key={index}
      style={styles.suggestionItem}
      onPress={() => handleSearch(suggestion)}
    >
      <IconSymbol name="magnifyingglass" size={16} color={colors.textSecondary} />
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: isArabic ? 'البحث' : 'Search',
          headerRight: () => (
            <Pressable onPress={() => setIsArabic(!isArabic)} style={commonStyles.headerButton}>
              <Text style={{ color: colors.textPrimary, fontSize: 14 }}>
                {isArabic ? 'EN' : 'عر'}
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={isArabic ? 'ابحث عن المنتجات...' : 'Search products...'}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => handleSearch('')}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filters */}
        {showResults && (
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filtersContent}>
                {filters.map((filter) => (
                  <Pressable
                    key={filter.id}
                    style={[
                      styles.filterChip,
                      filter.active && styles.filterChipActive,
                    ]}
                    onPress={() => toggleFilter(filter.id)}
                  >
                    <Text style={[
                      styles.filterText,
                      filter.active && styles.filterTextActive,
                    ]}>
                      {isArabic ? filter.nameAr : filter.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {!showResults ? (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {isArabic ? 'عمليات البحث الأخيرة' : 'Recent Searches'}
                  </Text>
                  {recentSearches.map((search, index) => renderSearchSuggestion(search, index))}
                </View>
              )}

              {/* Trending Searches */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {isArabic ? 'الأكثر بحثاً' : 'Trending Searches'}
                </Text>
                {trendingSearches.map((search, index) => renderSearchSuggestion(search, index))}
              </View>

              {/* Voice Search */}
              <View style={styles.section}>
                <Pressable style={styles.voiceSearchButton}>
                  <LinearGradient
                    colors={[colors.primaryRed, '#FF6B6B']}
                    style={styles.voiceSearchGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <IconSymbol name="mic.fill" size={24} color={colors.textPrimary} />
                    <Text style={styles.voiceSearchText}>
                      {isArabic ? 'البحث الصوتي' : 'Voice Search'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {/* Search Results */}
              {isSearching ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>
                    {isArabic ? 'جاري البحث...' : 'Searching...'}
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>
                      {searchResults.length} {isArabic ? 'نتيجة' : 'results'} 
                      {searchQuery && ` ${isArabic ? 'لـ' : 'for'} "${searchQuery}"`}
                    </Text>
                    <Pressable style={styles.sortButton}>
                      <Text style={styles.sortText}>
                        {isArabic ? 'ترتيب' : 'Sort'}
                      </Text>
                      <IconSymbol name="chevron.down" size={16} color={colors.textSecondary} />
                    </Pressable>
                  </View>

                  <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.resultRow}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.resultsContainer}
                  />
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Search bar styles
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    marginLeft: spacing.sm,
  },

  // Filters styles
  filtersContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContent: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryRed,
    borderColor: colors.primaryRed,
  },
  filterText: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.textPrimary,
  },

  // Content styles
  content: {
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

  // Suggestion styles
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },

  // Voice search styles
  voiceSearchButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  voiceSearchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  voiceSearchText: {
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },

  // Results styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  resultsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  resultRow: {
    justifyContent: 'space-between',
  },

  // Result card styles
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    width: (width - spacing.md * 3) / 2,
    ...shadows.medium,
  },
  resultImageContainer: {
    position: 'relative',
  },
  resultImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  resultBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  resultBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  resultInfo: {
    padding: spacing.md,
  },
  resultCategory: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultName: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    minHeight: 36,
  },
  resultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  resultPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultPrice: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.primaryRed,
  },
  resultOriginalPrice: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
});


import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  Pressable, 
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, shadows, buttonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import ARProductView from '@/components/ARProductView';
import AIRecommendations from '@/components/AIRecommendations';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    height: 300,
    backgroundColor: colors.card,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  imageControls: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: borderRadius.round,
    padding: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryRed,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.md,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryRed,
  },
  originalPrice: {
    fontSize: 18,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  discount: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  optionsContainer: {
    marginBottom: spacing.lg,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  optionButtonSelected: {
    borderColor: colors.primaryRed,
    backgroundColor: colors.primaryRed,
  },
  optionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  featuresContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primaryRed,
  },
  buyNowButton: {
    backgroundColor: colors.primaryRed,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addToCartText: {
    color: colors.primaryRed,
  },
  buyNowText: {
    color: colors.textPrimary,
  },
  arButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  arButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

// Mock product data
const getProductById = (id: string) => {
  const products = {
    '1': {
      id: '1',
      name: 'iPhone 15 Pro Max',
      nameAr: 'آيفون 15 برو ماكس',
      price: 1299,
      originalPrice: 1399,
      rating: 4.8,
      reviewCount: 2847,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
      ],
      badge: 'new',
      description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and revolutionary camera system. Experience the future of mobile technology.',
      colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
      storage: ['128GB', '256GB', '512GB', '1TB'],
      features: [
        'A17 Pro chip with 6-core GPU',
        'Pro camera system with 5x Telephoto',
        'Titanium design with textured matte glass',
        'Up to 29 hours video playback',
        'Face ID for secure authentication',
        '5G connectivity',
      ],
      category: 'Electronics',
      inStock: true,
    },
  };
  
  return products[id as keyof typeof products] || null;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showARView, setShowARView] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = getProductById(id as string);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.title}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedStorage) {
      Alert.alert('Please select options', 'Please choose color and storage options before adding to cart.');
      return;
    }
    
    console.log('Adding to cart:', { 
      productId: product.id, 
      color: selectedColor, 
      storage: selectedStorage 
    });
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedStorage) {
      Alert.alert('Please select options', 'Please choose color and storage options before purchasing.');
      return;
    }
    
    console.log('Buy now:', { 
      productId: product.id, 
      color: selectedColor, 
      storage: selectedStorage 
    });
    router.push('/checkout');
  };

  const handleShare = () => {
    Alert.alert('Share Product', 'Sharing product with friends...');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorite ? 'Product removed from your favorites' : 'Product added to your favorites'
    );
  };

  const renderHeaderRight = () => (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      <Pressable onPress={handleShare}>
        <IconSymbol name="square.and.arrow.up" size={24} color={colors.textPrimary} />
      </Pressable>
      <Pressable onPress={toggleFavorite}>
        <IconSymbol 
          name={isFavorite ? "heart.fill" : "heart"} 
          size={24} 
          color={isFavorite ? colors.error : colors.textPrimary} 
        />
      </Pressable>
    </View>
  );

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: product.name,
          headerRight: renderHeaderRight,
        }} 
      />

      <ScrollView style={{ flex: 1 }}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.images[currentImageIndex] }} 
            style={styles.productImage}
          />
          
          {/* Image Controls */}
          <View style={styles.imageControls}>
            <Pressable style={styles.controlButton} onPress={() => setShowARView(true)}>
              <IconSymbol name="arkit" size={20} color={colors.textPrimary} />
            </Pressable>
            <Pressable style={styles.controlButton}>
              <IconSymbol name="magnifyingglass" size={20} color={colors.textPrimary} />
            </Pressable>
            <Pressable style={styles.controlButton}>
              <IconSymbol name="rotate.3d" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Badge */}
          {product.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Product Info */}
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>JD {product.price}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>JD {product.originalPrice}</Text>
                <View style={styles.discount}>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color={colors.warning} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
          </View>

          {/* AR Experience Button */}
          <Pressable style={styles.arButton} onPress={() => setShowARView(true)}>
            <IconSymbol name="arkit" size={24} color={colors.textPrimary} />
            <Text style={styles.arButtonText}>View in AR</Text>
          </Pressable>

          {/* Color Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.optionTitle}>Color</Text>
            <View style={styles.optionButtons}>
              {product.colors.map((color) => (
                <Pressable
                  key={color}
                  style={[
                    styles.optionButton,
                    selectedColor === color && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedColor === color && styles.optionTextSelected,
                  ]}>
                    {color}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Storage Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.optionTitle}>Storage</Text>
            <View style={styles.optionButtons}>
              {product.storage.map((storage) => (
                <Pressable
                  key={storage}
                  style={[
                    styles.optionButton,
                    selectedStorage === storage && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedStorage(storage)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedStorage === storage && styles.optionTextSelected,
                  ]}>
                    {storage}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Key Features</Text>
            {product.features.map((feature, index) => (
              <View key={index} style={styles.feature}>
                <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* AI Recommendations */}
          <AIRecommendations
            currentProductId={product.id}
            category={product.category}
            title="You might also like"
            maxItems={5}
          />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable style={[styles.actionButton, styles.addToCartButton]} onPress={handleAddToCart}>
          <Text style={[styles.buttonText, styles.addToCartText]}>Add to Cart</Text>
        </Pressable>
        
        <LinearGradient
          colors={[colors.primaryRed, '#C73E3F']}
          style={[styles.actionButton, styles.buyNowButton]}
        >
          <Pressable
            style={{ width: '100%', alignItems: 'center' }}
            onPress={handleBuyNow}
          >
            <Text style={[styles.buttonText, styles.buyNowText]}>Buy Now</Text>
          </Pressable>
        </LinearGradient>
      </View>

      {/* AR View Modal */}
      <Modal
        visible={showARView}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <ARProductView
          productId={product.id}
          productName={product.name}
          onClose={() => setShowARView(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

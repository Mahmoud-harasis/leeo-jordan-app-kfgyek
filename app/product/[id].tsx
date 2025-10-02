
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  Pressable, 
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, shadows, buttonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock product data
const getProductById = (id: string) => {
  const products = {
    '1': {
      id: '1',
      name: 'iPhone 15 Pro',
      price: 'JD 1,199',
      originalPrice: 'JD 1,299',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
      ],
      rating: 4.8,
      reviews: 1247,
      description: 'The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system. Experience the ultimate in mobile technology with this flagship device.',
      features: [
        'A17 Pro chip with 6-core GPU',
        'Pro camera system with 48MP main camera',
        'Titanium design with Ceramic Shield',
        '128GB, 256GB, 512GB, 1TB storage options',
        'USB-C connectivity',
        'Face ID for secure authentication'
      ],
      colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
      sizes: ['128GB', '256GB', '512GB', '1TB'],
      inStock: true,
      fastDelivery: true,
      freeShipping: true,
    },
    '2': {
      id: '2',
      name: 'Nike Air Max',
      price: 'JD 89',
      originalPrice: 'JD 120',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      ],
      rating: 4.6,
      reviews: 892,
      description: 'Classic Nike Air Max sneakers with superior comfort and style. Perfect for everyday wear and athletic activities.',
      features: [
        'Air Max cushioning technology',
        'Breathable mesh upper',
        'Durable rubber outsole',
        'Iconic Nike design',
        'Available in multiple colors',
        'Comfortable all-day wear'
      ],
      colors: ['White/Black', 'Black/Red', 'Blue/White', 'Gray/Orange'],
      sizes: ['40', '41', '42', '43', '44', '45'],
      inStock: true,
      fastDelivery: true,
      freeShipping: false,
    }
  };
  
  return products[id as keyof typeof products] || products['1'];
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const product = getProductById(id as string);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${product.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/cart') }
      ]
    );
  };

  const handleBuyNow = () => {
    router.push('/checkout');
  };

  const renderHeaderRight = () => (
    <View style={styles.headerActions}>
      <Pressable
        onPress={() => Alert.alert('Added to Wishlist')}
        style={[styles.headerButton, { backgroundColor: colors.card }]}
      >
        <IconSymbol name="heart" color={colors.textPrimary} size={20} />
      </Pressable>
      <Pressable
        onPress={() => Alert.alert('Share Product')}
        style={[styles.headerButton, { backgroundColor: colors.card }]}
      >
        <IconSymbol name="square.and.arrow.up" color={colors.textPrimary} size={20} />
      </Pressable>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
        }}
      />
      <SafeAreaView style={commonStyles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Product Images */}
          <View style={styles.imageContainer}>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setSelectedImageIndex(index);
              }}
            >
              {product.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.productImage} />
              ))}
            </ScrollView>
            
            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: index === selectedImageIndex 
                        ? colors.primaryRed 
                        : colors.textSecondary
                    }
                  ]}
                />
              ))}
            </View>

            {/* Badges */}
            <View style={styles.badges}>
              {product.fastDelivery && (
                <View style={[styles.badge, { backgroundColor: colors.success }]}>
                  <IconSymbol name="bolt.fill" color="white" size={12} />
                  <Text style={styles.badgeText}>Fast Delivery</Text>
                </View>
              )}
              {product.freeShipping && (
                <View style={[styles.badge, { backgroundColor: colors.primaryRed }]}>
                  <IconSymbol name="truck" color="white" size={12} />
                  <Text style={styles.badgeText}>Free Shipping</Text>
                </View>
              )}
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={[commonStyles.title, { fontSize: 24 }]}>{product.name}</Text>
            
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconSymbol
                    key={star}
                    name="star.fill"
                    color={star <= Math.floor(product.rating) ? '#FFD700' : colors.border}
                    size={16}
                  />
                ))}
              </View>
              <Text style={[commonStyles.body, { marginLeft: spacing.sm }]}>
                {product.rating} ({product.reviews} reviews)
              </Text>
            </View>

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{product.price}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>{product.originalPrice}</Text>
              )}
              {product.originalPrice && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((parseFloat(product.originalPrice.replace('JD ', '')) - 
                    parseFloat(product.price.replace('JD ', ''))) / 
                    parseFloat(product.originalPrice.replace('JD ', ''))) * 100)}% OFF
                  </Text>
                </View>
              )}
            </View>

            {/* Color Selection */}
            <View style={styles.optionSection}>
              <Text style={[commonStyles.heading, { fontSize: 16 }]}>Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionsList}>
                  {product.colors.map((color) => (
                    <Pressable
                      key={color}
                      style={[
                        styles.colorOption,
                        {
                          borderColor: selectedColor === color ? colors.primaryRed : colors.border,
                          backgroundColor: selectedColor === color ? colors.card : 'transparent',
                        }
                      ]}
                      onPress={() => setSelectedColor(color)}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: selectedColor === color ? colors.primaryRed : colors.textSecondary }
                      ]}>
                        {color}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Size Selection */}
            <View style={styles.optionSection}>
              <Text style={[commonStyles.heading, { fontSize: 16 }]}>Size</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionsList}>
                  {product.sizes.map((size) => (
                    <Pressable
                      key={size}
                      style={[
                        styles.sizeOption,
                        {
                          borderColor: selectedSize === size ? colors.primaryRed : colors.border,
                          backgroundColor: selectedSize === size ? colors.primaryRed : colors.card,
                        }
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: selectedSize === size ? 'white' : colors.textPrimary }
                      ]}>
                        {size}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Quantity */}
            <View style={styles.optionSection}>
              <Text style={[commonStyles.heading, { fontSize: 16 }]}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <Pressable
                  style={[styles.quantityButton, { backgroundColor: colors.card }]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <IconSymbol name="minus" color={colors.textPrimary} size={16} />
                </Pressable>
                <Text style={[styles.quantityText, { color: colors.textPrimary }]}>{quantity}</Text>
                <Pressable
                  style={[styles.quantityButton, { backgroundColor: colors.card }]}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <IconSymbol name="plus" color={colors.textPrimary} size={16} />
                </Pressable>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={[commonStyles.heading, { fontSize: 18 }]}>Description</Text>
              <Text style={[commonStyles.body, { textAlign: 'left' }]}>{product.description}</Text>
            </View>

            {/* Features */}
            <View style={styles.section}>
              <Text style={[commonStyles.heading, { fontSize: 18 }]}>Features</Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <IconSymbol name="checkmark.circle.fill" color={colors.success} size={16} />
                  <Text style={[commonStyles.body, { marginLeft: spacing.sm, flex: 1 }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Pressable
            style={[buttonStyles.secondary, { flex: 1, marginRight: spacing.sm }]}
            onPress={handleAddToCart}
          >
            <Text style={buttonStyles.secondaryText}>Add to Cart</Text>
          </Pressable>
          <LinearGradient
            colors={[colors.primaryRed, '#B91C1C']}
            style={[buttonStyles.primary, { flex: 1 }]}
          >
            <Pressable style={styles.buyNowButton} onPress={handleBuyNow}>
              <Text style={buttonStyles.primaryText}>Buy Now</Text>
            </Pressable>
          </LinearGradient>
        </View>
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
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: width,
    height: width,
    backgroundColor: colors.card,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badges: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    gap: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_500Medium',
  },
  productInfo: {
    padding: spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryRed,
    fontFamily: 'Inter_700Bold',
  },
  originalPrice: {
    fontSize: 18,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  discountBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_700Bold',
  },
  optionSection: {
    marginVertical: spacing.md,
  },
  optionsList: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  colorOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
  },
  sizeOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    minWidth: 50,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_700Bold',
    minWidth: 30,
    textAlign: 'center',
  },
  section: {
    marginVertical: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.xs,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  buyNowButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
});

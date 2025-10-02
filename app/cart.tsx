
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, shadows, buttonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

// Mock cart data
const initialCartItems = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 1199,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
    color: 'Natural Titanium',
    size: '128GB',
    quantity: 1,
    inStock: true,
  },
  {
    id: '2',
    name: 'Nike Air Max',
    price: 89,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    color: 'White/Black',
    size: '42',
    quantity: 2,
    inStock: true,
  },
  {
    id: '3',
    name: 'MacBook Pro',
    price: 2499,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
    color: 'Space Gray',
    size: '512GB',
    quantity: 1,
    inStock: false,
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(250);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCartItems(items => items.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'jordan10') {
      setPromoApplied(true);
      Alert.alert('Success', 'Promo code applied! 10% discount added.');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
    }
  };

  const toggleLoyaltyPoints = () => {
    setUseLoyaltyPoints(!useLoyaltyPoints);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
  const loyaltyDiscount = useLoyaltyPoints ? Math.min(loyaltyPoints * 0.1, subtotal * 0.05) : 0;
  const shipping = subtotal > 100 ? 0 : 5;
  const total = subtotal - promoDiscount - loyaltyDiscount + shipping;

  const renderCartItem = (item: typeof cartItems[0]) => (
    <View key={item.id} style={[styles.cartItem, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.itemVariant, { color: colors.textSecondary }]}>
          {item.color} • {item.size}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.itemPrice, { color: colors.primaryRed }]}>
            JD {item.price}
          </Text>
          {item.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              JD {item.originalPrice}
            </Text>
          )}
        </View>

        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <Pressable
            style={[styles.quantityButton, { backgroundColor: colors.background }]}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <IconSymbol name="minus" color={colors.textPrimary} size={14} />
          </Pressable>
          <Text style={[styles.quantityText, { color: colors.textPrimary }]}>
            {item.quantity}
          </Text>
          <Pressable
            style={[styles.quantityButton, { backgroundColor: colors.background }]}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <IconSymbol name="plus" color={colors.textPrimary} size={14} />
          </Pressable>
        </View>

        <Pressable
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <IconSymbol name="trash" color={colors.error} size={16} />
        </Pressable>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Shopping Cart',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.textPrimary,
          }}
        />
        <SafeAreaView style={commonStyles.safeArea}>
          <View style={styles.emptyCart}>
            <IconSymbol name="cart" color={colors.textSecondary} size={80} />
            <Text style={[commonStyles.title, { marginTop: spacing.lg }]}>
              Your cart is empty
            </Text>
            <Text style={[commonStyles.body, { textAlign: 'center', marginVertical: spacing.md }]}>
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </Text>
            <LinearGradient
              colors={[colors.primaryRed, '#B91C1C']}
              style={[buttonStyles.primary, { marginTop: spacing.lg }]}
            >
              <Pressable
                style={styles.continueShoppingButton}
                onPress={() => router.push('/(tabs)/(home)/')}
              >
                <Text style={buttonStyles.primaryText}>Continue Shopping</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Shopping Cart (${cartItems.length})`,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
        }}
      />
      <SafeAreaView style={commonStyles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Cart Items */}
          <View style={styles.section}>
            <Text style={[commonStyles.heading, { color: colors.textPrimary }]}>
              Items ({cartItems.length})
            </Text>
            {cartItems.map(renderCartItem)}
          </View>

          {/* Promo Code */}
          <View style={[styles.section, styles.promoSection, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.heading, { color: colors.textPrimary }]}>
              Promo Code
            </Text>
            <View style={styles.promoContainer}>
              <TextInput
                style={[styles.promoInput, { color: colors.textPrimary }]}
                placeholder="Enter promo code"
                placeholderTextColor={colors.textSecondary}
                value={promoCode}
                onChangeText={setPromoCode}
                editable={!promoApplied}
              />
              <Pressable
                style={[
                  styles.promoButton,
                  {
                    backgroundColor: promoApplied ? colors.success : colors.primaryRed,
                    opacity: promoApplied ? 0.7 : 1,
                  }
                ]}
                onPress={applyPromoCode}
                disabled={promoApplied}
              >
                <Text style={styles.promoButtonText}>
                  {promoApplied ? 'Applied' : 'Apply'}
                </Text>
              </Pressable>
            </View>
            {promoApplied && (
              <View style={styles.promoSuccess}>
                <IconSymbol name="checkmark.circle.fill" color={colors.success} size={16} />
                <Text style={[styles.promoSuccessText, { color: colors.success }]}>
                  JORDAN10 applied - 10% off!
                </Text>
              </View>
            )}
          </View>

          {/* Loyalty Points */}
          <View style={[styles.section, styles.loyaltySection, { backgroundColor: colors.card }]}>
            <View style={styles.loyaltyHeader}>
              <View>
                <Text style={[commonStyles.heading, { color: colors.textPrimary }]}>
                  Loyalty Points
                </Text>
                <Text style={[commonStyles.caption, { color: colors.textSecondary }]}>
                  You have {loyaltyPoints} points (JD {(loyaltyPoints * 0.1).toFixed(1)} value)
                </Text>
              </View>
              <Pressable
                style={[
                  styles.loyaltyToggle,
                  {
                    backgroundColor: useLoyaltyPoints ? colors.primaryRed : colors.border,
                  }
                ]}
                onPress={toggleLoyaltyPoints}
              >
                <View
                  style={[
                    styles.loyaltyToggleThumb,
                    {
                      backgroundColor: 'white',
                      transform: [{ translateX: useLoyaltyPoints ? 20 : 2 }],
                    }
                  ]}
                />
              </Pressable>
            </View>
            {useLoyaltyPoints && (
              <Text style={[styles.loyaltyDiscount, { color: colors.success }]}>
                -{loyaltyDiscount.toFixed(1)} JD discount applied
              </Text>
            )}
          </View>

          {/* Order Summary */}
          <View style={[styles.section, styles.summarySection, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.heading, { color: colors.textPrimary }]}>
              Order Summary
            </Text>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                JD {subtotal.toFixed(2)}
              </Text>
            </View>

            {promoApplied && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.success }]}>
                  Promo Discount (10%)
                </Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  -JD {promoDiscount.toFixed(2)}
                </Text>
              </View>
            )}

            {useLoyaltyPoints && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.success }]}>
                  Loyalty Points
                </Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  -JD {loyaltyDiscount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Shipping
              </Text>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                {shipping === 0 ? 'Free' : `JD ${shipping.toFixed(2)}`}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: colors.primaryRed }]}>
                JD {total.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Pressable
            style={[buttonStyles.secondary, { flex: 1, marginRight: spacing.sm }]}
            onPress={() => router.push('/(tabs)/(home)/')}
          >
            <Text style={buttonStyles.secondaryText}>Continue Shopping</Text>
          </Pressable>
          <LinearGradient
            colors={[colors.primaryRed, '#B91C1C']}
            style={[buttonStyles.primary, { flex: 1 }]}
          >
            <Pressable
              style={styles.checkoutButton}
              onPress={() => router.push('/checkout')}
            >
              <Text style={buttonStyles.primaryText}>Checkout</Text>
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
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  continueShoppingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  section: {
    margin: spacing.md,
    marginBottom: spacing.sm,
  },
  cartItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs,
    ...shadows.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_500Medium',
    marginBottom: spacing.xs,
  },
  itemVariant: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  outOfStockBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter_700Bold',
  },
  itemActions: {
    alignItems: 'center',
    gap: spacing.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_700Bold',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.sm,
  },
  promoSection: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  promoContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  promoInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter_400Regular',
  },
  promoButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_500Medium',
  },
  promoSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  promoSuccessText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  loyaltySection: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loyaltyToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  loyaltyToggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  loyaltyDiscount: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing.sm,
    fontFamily: 'Inter_500Medium',
  },
  summarySection: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
});

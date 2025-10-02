
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface PaymentMethod {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  type: 'card' | 'wallet' | 'cash';
}

interface DeliveryAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

const paymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Credit Card', nameAr: 'بطاقة ائتمان', icon: 'creditcard.fill', type: 'card' },
  { id: '2', name: 'Visa', nameAr: 'فيزا', icon: 'creditcard.fill', type: 'card' },
  { id: '3', name: 'Mastercard', nameAr: 'ماستركارد', icon: 'creditcard.fill', type: 'card' },
  { id: '4', name: 'PayPal', nameAr: 'باي بال', icon: 'wallet.pass.fill', type: 'wallet' },
  { id: '5', name: 'Apple Pay', nameAr: 'أبل باي', icon: 'applelogo', type: 'wallet' },
  { id: '6', name: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام', icon: 'banknote.fill', type: 'cash' },
];

const mockAddresses: DeliveryAddress[] = [
  {
    id: '1',
    name: 'Home',
    address: 'Al-Abdali Boulevard, Building 15, Apt 302',
    city: 'Amman',
    phone: '+962 79 123 4567',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Office',
    address: 'Jabal Amman, Rainbow Street 45',
    city: 'Amman',
    phone: '+962 79 123 4567',
    isDefault: false,
  },
];

export default function CheckoutScreen() {
  const [selectedPayment, setSelectedPayment] = useState<string>('6'); // Default to COD
  const [selectedAddress, setSelectedAddress] = useState<string>('1');
  const [promoCode, setPromoCode] = useState<string>('');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false);
  const [isArabic, setIsArabic] = useState<boolean>(true);
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Mock data
  const subtotal = 125.50;
  const deliveryFee = 3.00;
  const loyaltyPoints = 250;
  const loyaltyDiscount = useLoyaltyPoints ? 12.50 : 0;
  const promoDiscount = promoCode === 'LEEO10' ? 10.00 : 0;
  const total = subtotal + deliveryFee - loyaltyDiscount - promoDiscount;

  const handlePlaceOrder = () => {
    Alert.alert(
      isArabic ? 'تأكيد الطلب' : 'Confirm Order',
      isArabic 
        ? `إجمالي الطلب: ${total.toFixed(2)} دينار أردني\nهل تريد تأكيد الطلب؟`
        : `Total: ${total.toFixed(2)} JOD\nDo you want to confirm your order?`,
      [
        {
          text: isArabic ? 'إلغاء' : 'Cancel',
          style: 'cancel',
        },
        {
          text: isArabic ? 'تأكيد' : 'Confirm',
          onPress: () => {
            // Navigate to order tracking
            router.push('/orders');
          },
        },
      ]
    );
  };

  const applyPromoCode = () => {
    if (promoCode === 'LEEO10') {
      Alert.alert(
        isArabic ? 'تم تطبيق الكود' : 'Promo Applied',
        isArabic ? 'تم تطبيق خصم 10 دنانير' : '10 JOD discount applied'
      );
    } else {
      Alert.alert(
        isArabic ? 'كود خاطئ' : 'Invalid Code',
        isArabic ? 'الرجاء التحقق من الكود' : 'Please check your promo code'
      );
    }
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <Pressable
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPayment === method.id && styles.selectedPaymentMethod,
      ]}
      onPress={() => setSelectedPayment(method.id)}
    >
      <View style={styles.paymentMethodContent}>
        <IconSymbol name={method.icon as any} size={24} color={colors.primaryRed} />
        <Text style={styles.paymentMethodText}>
          {isArabic ? method.nameAr : method.name}
        </Text>
      </View>
      <View style={[
        styles.radioButton,
        selectedPayment === method.id && styles.selectedRadioButton,
      ]}>
        {selectedPayment === method.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </Pressable>
  );

  const renderAddress = (address: DeliveryAddress) => (
    <Pressable
      key={address.id}
      style={[
        styles.addressCard,
        selectedAddress === address.id && styles.selectedAddressCard,
      ]}
      onPress={() => setSelectedAddress(address.id)}
    >
      <View style={styles.addressHeader}>
        <Text style={styles.addressName}>{address.name}</Text>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>
              {isArabic ? 'افتراضي' : 'Default'}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.addressText}>{address.address}</Text>
      <Text style={styles.addressCity}>{address.city}</Text>
      <Text style={styles.addressPhone}>{address.phone}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: isArabic ? 'إتمام الطلب' : 'Checkout',
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
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'عنوان التوصيل' : 'Delivery Address'}
          </Text>
          {mockAddresses.map(renderAddress)}
          
          <Pressable style={styles.addAddressButton}>
            <IconSymbol name="plus.circle.fill" size={20} color={colors.primaryRed} />
            <Text style={styles.addAddressText}>
              {isArabic ? 'إضافة عنوان جديد' : 'Add New Address'}
            </Text>
          </Pressable>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'طريقة الدفع' : 'Payment Method'}
          </Text>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Promo Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'كود الخصم' : 'Promo Code'}
          </Text>
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder={isArabic ? 'أدخل كود الخصم' : 'Enter promo code'}
              placeholderTextColor={colors.textSecondary}
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <Pressable style={styles.applyButton} onPress={applyPromoCode}>
              <Text style={styles.applyButtonText}>
                {isArabic ? 'تطبيق' : 'Apply'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Loyalty Points Section */}
        <View style={styles.section}>
          <View style={styles.loyaltyContainer}>
            <View style={styles.loyaltyInfo}>
              <IconSymbol name="star.fill" size={20} color={colors.primaryRed} />
              <Text style={styles.loyaltyText}>
                {isArabic 
                  ? `استخدم ${loyaltyPoints} نقطة (${loyaltyDiscount.toFixed(2)} د.أ)`
                  : `Use ${loyaltyPoints} points (${loyaltyDiscount.toFixed(2)} JOD)`
                }
              </Text>
            </View>
            <Switch
              value={useLoyaltyPoints}
              onValueChange={setUseLoyaltyPoints}
              trackColor={{ false: colors.border, true: colors.primaryRed }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </View>

        {/* Order Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'ملاحظات الطلب' : 'Order Notes'}
          </Text>
          <TextInput
            style={styles.notesInput}
            placeholder={isArabic ? 'أضف ملاحظات للطلب (اختياري)' : 'Add order notes (optional)'}
            placeholderTextColor={colors.textSecondary}
            value={orderNotes}
            onChangeText={setOrderNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'ملخص الطلب' : 'Order Summary'}
          </Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {isArabic ? 'المجموع الفرعي' : 'Subtotal'}
              </Text>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)} JOD</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {isArabic ? 'رسوم التوصيل' : 'Delivery Fee'}
              </Text>
              <Text style={styles.summaryValue}>{deliveryFee.toFixed(2)} JOD</Text>
            </View>

            {useLoyaltyPoints && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountText]}>
                  {isArabic ? 'خصم نقاط الولاء' : 'Loyalty Discount'}
                </Text>
                <Text style={[styles.summaryValue, styles.discountText]}>
                  -{loyaltyDiscount.toFixed(2)} JOD
                </Text>
              </View>
            )}

            {promoDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountText]}>
                  {isArabic ? 'خصم الكود' : 'Promo Discount'}
                </Text>
                <Text style={[styles.summaryValue, styles.discountText]}>
                  -{promoDiscount.toFixed(2)} JOD
                </Text>
              </View>
            )}

            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                {isArabic ? 'الإجمالي' : 'Total'}
              </Text>
              <Text style={styles.totalValue}>{total.toFixed(2)} JOD</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <Pressable style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <LinearGradient
            colors={[colors.primaryRed, '#FF6B6B']}
            style={styles.placeOrderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.textPrimary} />
            <Text style={styles.placeOrderText}>
              {isArabic ? 'تأكيد الطلب' : 'Place Order'} • {total.toFixed(2)} JOD
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
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
  
  // Address styles
  addressCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.small,
  },
  selectedAddressCard: {
    borderColor: colors.primaryRed,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  addressName: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: colors.primaryRed,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
  },
  addressText: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  addressCity: {
    fontSize: 14,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  addressPhone: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.primaryRed,
    marginLeft: spacing.sm,
  },

  // Payment method styles
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.small,
  },
  selectedPaymentMethod: {
    borderColor: colors.primaryRed,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: colors.primaryRed,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryRed,
  },

  // Promo code styles
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    marginRight: spacing.sm,
  },
  applyButton: {
    backgroundColor: colors.primaryRed,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },

  // Loyalty points styles
  loyaltyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  loyaltyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loyaltyText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },

  // Notes styles
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    minHeight: 80,
  },

  // Summary styles
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
  },
  discountText: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: typography.fontFamilyBold,
    color: colors.primaryRed,
  },

  // Bottom button styles
  bottomContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  placeOrderButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  placeOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  placeOrderText: {
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
});

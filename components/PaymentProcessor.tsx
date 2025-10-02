
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, spacing, borderRadius, typography, shadows } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { SecureStorage } from './SecureStorage';

interface PaymentMethod {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  type: 'card' | 'wallet' | 'cash' | 'bank';
  enabled: boolean;
  processingFee?: number;
}

interface PaymentProcessorProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentData: any) => void;
  onCancel: () => void;
  loyaltyPoints?: number;
  onUseLoyaltyPoints?: (points: number) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primaryRed,
    marginBottom: spacing.xs,
  },
  currency: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  paymentMethod: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.small,
  },
  paymentMethodSelected: {
    borderColor: colors.primaryRed,
  },
  paymentIcon: {
    marginRight: spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  paymentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  processingFee: {
    fontSize: 12,
    color: colors.warning,
    marginTop: spacing.xs,
  },
  cardForm: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadows.small,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  loyaltySection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  loyaltyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  loyaltyBalance: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  loyaltyInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  useMaxButton: {
    backgroundColor: colors.primaryRed,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  useMaxText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  summary: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryRed,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: colors.textSecondary,
  },
  payButtonText: {
    color: colors.textPrimary,
  },
});

export default function PaymentProcessor({
  amount,
  currency = 'JD',
  onSuccess,
  onCancel,
  loyaltyPoints = 0,
  onUseLoyaltyPoints,
}: PaymentProcessorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0);
  const [processing, setProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'click',
      name: 'Click Payment',
      nameAr: 'دفع كليك',
      icon: 'creditcard',
      type: 'bank',
      enabled: true,
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      nameAr: 'آبل باي',
      icon: 'apple.logo',
      type: 'wallet',
      enabled: true,
    },
    {
      id: 'visa',
      name: 'Visa Card',
      nameAr: 'بطاقة فيزا',
      icon: 'creditcard',
      type: 'card',
      enabled: true,
      processingFee: 0.025, // 2.5%
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      nameAr: 'ماستركارد',
      icon: 'creditcard',
      type: 'card',
      enabled: true,
      processingFee: 0.025, // 2.5%
    },
    {
      id: 'paypal',
      name: 'PayPal',
      nameAr: 'باي بال',
      icon: 'p.circle',
      type: 'wallet',
      enabled: true,
      processingFee: 0.035, // 3.5%
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      nameAr: 'الدفع عند الاستلام',
      icon: 'banknote',
      type: 'cash',
      enabled: true,
    },
  ];

  const calculateTotal = () => {
    let total = amount;
    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
    
    // Apply loyalty points discount (1 point = 0.01 JD)
    const loyaltyDiscount = loyaltyPointsToUse * 0.01;
    total -= loyaltyDiscount;
    
    // Add processing fee if applicable
    if (selectedPaymentMethod?.processingFee) {
      total += total * selectedPaymentMethod.processingFee;
    }
    
    return Math.max(0, total);
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
    
    if (selectedPaymentMethod?.type === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name)) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store payment token securely (never store actual card data)
      if (selectedPaymentMethod?.type === 'card') {
        const paymentToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await SecureStorage.storePaymentToken(paymentToken);
      }

      const paymentData = {
        method: selectedMethod,
        amount: calculateTotal(),
        currency,
        loyaltyPointsUsed: loyaltyPointsToUse,
        timestamp: Date.now(),
        transactionId: `txn_${Date.now()}`,
      };

      console.log('Payment processed:', paymentData);
      
      // Use loyalty points if specified
      if (loyaltyPointsToUse > 0 && onUseLoyaltyPoints) {
        onUseLoyaltyPoints(loyaltyPointsToUse);
      }

      Alert.alert('Success', 'Payment processed successfully!', [
        { text: 'OK', onPress: () => onSuccess(paymentData) }
      ]);
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleUseMaxLoyaltyPoints = () => {
    const maxUsablePoints = Math.min(loyaltyPoints, Math.floor(amount * 100)); // Max points that can cover the amount
    setLoyaltyPointsToUse(maxUsablePoints);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Amount Header */}
        <View style={styles.header}>
          <Text style={styles.amount}>{currency} {amount.toFixed(2)}</Text>
          <Text style={styles.currency}>Total Amount</Text>
        </View>

        {/* Loyalty Points Section */}
        {loyaltyPoints > 0 && (
          <View style={styles.section}>
            <View style={styles.loyaltySection}>
              <View style={styles.loyaltyHeader}>
                <IconSymbol name="star.fill" size={20} color={colors.warning} />
                <Text style={styles.loyaltyTitle}>Use Loyalty Points</Text>
              </View>
              <Text style={styles.loyaltyBalance}>
                Available: {loyaltyPoints} points (JD {(loyaltyPoints * 0.01).toFixed(2)})
              </Text>
              <TextInput
                style={styles.loyaltyInput}
                placeholder="Points to use"
                placeholderTextColor={colors.textSecondary}
                value={loyaltyPointsToUse.toString()}
                onChangeText={(text) => {
                  const points = parseInt(text) || 0;
                  setLoyaltyPointsToUse(Math.min(points, loyaltyPoints));
                }}
                keyboardType="numeric"
              />
              <Pressable style={styles.useMaxButton} onPress={handleUseMaxLoyaltyPoints}>
                <Text style={styles.useMaxText}>Use Maximum Points</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.filter(method => method.enabled).map((method) => (
            <Pressable
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <IconSymbol name={method.icon} size={24} color={colors.primaryRed} style={styles.paymentIcon} />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentDescription}>{method.nameAr}</Text>
                {method.processingFee && (
                  <Text style={styles.processingFee}>
                    Processing fee: {(method.processingFee * 100).toFixed(1)}%
                  </Text>
                )}
              </View>
              {selectedMethod === method.id && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
              )}
            </Pressable>
          ))}
        </View>

        {/* Card Form */}
        {selectedMethod && ['visa', 'mastercard'].includes(selectedMethod) && (
          <View style={styles.section}>
            <View style={styles.cardForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.textSecondary}
                  value={cardData.number}
                  onChangeText={(text) => setCardData(prev => ({ ...prev, number: text }))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textSecondary}
                    value={cardData.expiry}
                    onChangeText={(text) => setCardData(prev => ({ ...prev, expiry: text }))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor={colors.textSecondary}
                    value={cardData.cvv}
                    onChangeText={(text) => setCardData(prev => ({ ...prev, cvv: text }))}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={colors.textSecondary}
                  value={cardData.name}
                  onChangeText={(text) => setCardData(prev => ({ ...prev, name: text }))}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>
        )}

        {/* Payment Summary */}
        <View style={styles.section}>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{currency} {amount.toFixed(2)}</Text>
            </View>
            
            {loyaltyPointsToUse > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Loyalty Discount</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  -{currency} {(loyaltyPointsToUse * 0.01).toFixed(2)}
                </Text>
              </View>
            )}
            
            {selectedMethod && paymentMethods.find(m => m.id === selectedMethod)?.processingFee && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Processing Fee</Text>
                <Text style={styles.summaryValue}>
                  {currency} {((amount - loyaltyPointsToUse * 0.01) * paymentMethods.find(m => m.id === selectedMethod)!.processingFee!).toFixed(2)}
                </Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{currency} {calculateTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
        </Pressable>
        
        <LinearGradient
          colors={[colors.primaryRed, '#C73E3F']}
          style={styles.button}
        >
          <Pressable
            style={{ width: '100%', alignItems: 'center' }}
            onPress={handlePayment}
            disabled={processing || !selectedMethod}
          >
            <Text style={[styles.buttonText, styles.payButtonText]}>
              {processing ? 'Processing...' : `Pay ${currency} ${calculateTotal().toFixed(2)}`}
            </Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}


import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
  estimatedDelivery: string;
  trackingSteps: TrackingStep[];
}

interface TrackingStep {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
  icon: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'LEO-2024-001',
    date: '2024-01-15',
    status: 'shipped',
    total: 125.50,
    deliveryAddress: 'Al-Abdali Boulevard, Building 15, Apt 302, Amman',
    estimatedDelivery: '2024-01-16 14:00',
    items: [
      { id: '1', name: 'Wireless Headphones', quantity: 1, price: 89.99, image: 'headphones' },
      { id: '2', name: 'Phone Case', quantity: 2, price: 17.75, image: 'case' },
    ],
    trackingSteps: [
      {
        id: '1',
        title: 'Order Placed',
        titleAr: 'تم تأكيد الطلب',
        description: 'Your order has been received and confirmed',
        descriptionAr: 'تم استلام وتأكيد طلبك',
        timestamp: '2024-01-15 10:30',
        completed: true,
        active: false,
        icon: 'checkmark.circle.fill',
      },
      {
        id: '2',
        title: 'Preparing',
        titleAr: 'قيد التحضير',
        description: 'Your order is being prepared for shipment',
        descriptionAr: 'يتم تحضير طلبك للشحن',
        timestamp: '2024-01-15 12:15',
        completed: true,
        active: false,
        icon: 'box.fill',
      },
      {
        id: '3',
        title: 'Shipped',
        titleAr: 'تم الشحن',
        description: 'Your order is on the way to you',
        descriptionAr: 'طلبك في الطريق إليك',
        timestamp: '2024-01-15 16:45',
        completed: true,
        active: true,
        icon: 'shippingbox.fill',
      },
      {
        id: '4',
        title: 'Out for Delivery',
        titleAr: 'خرج للتوصيل',
        description: 'Your order is out for delivery',
        descriptionAr: 'طلبك خرج للتوصيل',
        timestamp: '',
        completed: false,
        active: false,
        icon: 'truck.box.fill',
      },
      {
        id: '5',
        title: 'Delivered',
        titleAr: 'تم التسليم',
        description: 'Your order has been delivered',
        descriptionAr: 'تم تسليم طلبك',
        timestamp: '',
        completed: false,
        active: false,
        icon: 'house.fill',
      },
    ],
  },
  {
    id: '2',
    orderNumber: 'LEO-2024-002',
    date: '2024-01-14',
    status: 'delivered',
    total: 67.25,
    deliveryAddress: 'Jabal Amman, Rainbow Street 45, Amman',
    estimatedDelivery: '2024-01-15 11:00',
    items: [
      { id: '3', name: 'Bluetooth Speaker', quantity: 1, price: 67.25, image: 'speaker' },
    ],
    trackingSteps: [
      {
        id: '1',
        title: 'Order Placed',
        titleAr: 'تم تأكيد الطلب',
        description: 'Your order has been received and confirmed',
        descriptionAr: 'تم استلام وتأكيد طلبك',
        timestamp: '2024-01-14 09:15',
        completed: true,
        active: false,
        icon: 'checkmark.circle.fill',
      },
      {
        id: '2',
        title: 'Preparing',
        titleAr: 'قيد التحضير',
        description: 'Your order is being prepared for shipment',
        descriptionAr: 'يتم تحضير طلبك للشحن',
        timestamp: '2024-01-14 11:30',
        completed: true,
        active: false,
        icon: 'box.fill',
      },
      {
        id: '3',
        title: 'Shipped',
        titleAr: 'تم الشحن',
        description: 'Your order is on the way to you',
        descriptionAr: 'طلبك في الطريق إليك',
        timestamp: '2024-01-14 14:20',
        completed: true,
        active: false,
        icon: 'shippingbox.fill',
      },
      {
        id: '4',
        title: 'Out for Delivery',
        titleAr: 'خرج للتوصيل',
        description: 'Your order is out for delivery',
        descriptionAr: 'طلبك خرج للتوصيل',
        timestamp: '2024-01-15 09:45',
        completed: true,
        active: false,
        icon: 'truck.box.fill',
      },
      {
        id: '5',
        title: 'Delivered',
        titleAr: 'تم التسليم',
        description: 'Your order has been delivered',
        descriptionAr: 'تم تسليم طلبك',
        timestamp: '2024-01-15 10:30',
        completed: true,
        active: false,
        icon: 'house.fill',
      },
    ],
  },
];

export default function OrdersScreen() {
  const [isArabic, setIsArabic] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'confirmed':
      case 'preparing':
        return colors.primaryRed;
      case 'shipped':
        return '#4ECDC4';
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: { en: 'Pending', ar: 'في الانتظار' },
      confirmed: { en: 'Confirmed', ar: 'مؤكد' },
      preparing: { en: 'Preparing', ar: 'قيد التحضير' },
      shipped: { en: 'Shipped', ar: 'تم الشحن' },
      delivered: { en: 'Delivered', ar: 'تم التسليم' },
      cancelled: { en: 'Cancelled', ar: 'ملغي' },
    };
    return isArabic ? statusMap[status].ar : statusMap[status].en;
  };

  const renderTrackingStep = (step: TrackingStep, index: number, isLast: boolean) => {
    const stepAnimation = useSharedValue(step.completed ? 1 : 0);
    
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(stepAnimation.value, [0, 1], [0.8, 1]);
      const opacity = interpolate(stepAnimation.value, [0, 1], [0.5, 1]);
      
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <View key={step.id} style={styles.trackingStep}>
        <View style={styles.trackingStepLeft}>
          <Animated.View style={[animatedStyle]}>
            <View style={[
              styles.stepIcon,
              step.completed && styles.stepIconCompleted,
              step.active && styles.stepIconActive,
            ]}>
              <IconSymbol 
                name={step.icon as any} 
                size={20} 
                color={step.completed ? colors.textPrimary : colors.textSecondary} 
              />
            </View>
          </Animated.View>
          {!isLast && (
            <View style={[
              styles.stepLine,
              step.completed && styles.stepLineCompleted,
            ]} />
          )}
        </View>
        
        <View style={styles.trackingStepContent}>
          <Text style={[
            styles.stepTitle,
            step.completed && styles.stepTitleCompleted,
          ]}>
            {isArabic ? step.titleAr : step.title}
          </Text>
          <Text style={styles.stepDescription}>
            {isArabic ? step.descriptionAr : step.description}
          </Text>
          {step.timestamp && (
            <Text style={styles.stepTimestamp}>{step.timestamp}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderOrderCard = (order: Order) => (
    <Pressable
      key={order.id}
      style={styles.orderCard}
      onPress={() => setSelectedOrder(order)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>
          {order.total.toFixed(2)} JOD
        </Text>
        <Text style={styles.itemCount}>
          {order.items.length} {isArabic ? 'عنصر' : 'items'}
        </Text>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.deliveryAddress} numberOfLines={1}>
          {order.deliveryAddress}
        </Text>
        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );

  if (selectedOrder) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Stack.Screen
          options={{
            title: isArabic ? 'تتبع الطلب' : 'Track Order',
            headerLeft: () => (
              <Pressable 
                onPress={() => setSelectedOrder(null)} 
                style={commonStyles.headerButton}
              >
                <IconSymbol name="chevron.left" size={20} color={colors.textPrimary} />
              </Pressable>
            ),
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
          {/* Order Info */}
          <View style={styles.section}>
            <View style={styles.orderInfoCard}>
              <View style={styles.orderInfoHeader}>
                <Text style={styles.orderInfoTitle}>
                  {selectedOrder.orderNumber}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(selectedOrder.status)}</Text>
                </View>
              </View>
              
              <Text style={styles.orderInfoDate}>
                {isArabic ? 'تاريخ الطلب:' : 'Order Date:'} {selectedOrder.date}
              </Text>
              
              <Text style={styles.orderInfoTotal}>
                {isArabic ? 'الإجمالي:' : 'Total:'} {selectedOrder.total.toFixed(2)} JOD
              </Text>
              
              <Text style={styles.orderInfoAddress}>
                {isArabic ? 'عنوان التوصيل:' : 'Delivery Address:'} {selectedOrder.deliveryAddress}
              </Text>
              
              {selectedOrder.estimatedDelivery && (
                <Text style={styles.orderInfoEstimated}>
                  {isArabic ? 'التوصيل المتوقع:' : 'Estimated Delivery:'} {selectedOrder.estimatedDelivery}
                </Text>
              )}
            </View>
          </View>

          {/* Tracking Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isArabic ? 'تتبع الطلب' : 'Order Tracking'}
            </Text>
            <View style={styles.trackingContainer}>
              {selectedOrder.trackingSteps.map((step, index) => 
                renderTrackingStep(step, index, index === selectedOrder.trackingSteps.length - 1)
              )}
            </View>
          </View>

          {/* Map Placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isArabic ? 'موقع التوصيل' : 'Delivery Location'}
            </Text>
            <View style={styles.mapPlaceholder}>
              <IconSymbol name="map.fill" size={48} color={colors.textSecondary} />
              <Text style={styles.mapPlaceholderText}>
                {isArabic 
                  ? 'خرائط التتبع غير مدعومة في Natively حالياً'
                  : 'Tracking maps are not supported in Natively right now'
                }
              </Text>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isArabic ? 'عناصر الطلب' : 'Order Items'}
            </Text>
            {selectedOrder.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.itemImagePlaceholder}>
                  <IconSymbol name="photo.fill" size={24} color={colors.textSecondary} />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>
                    {isArabic ? 'الكمية:' : 'Qty:'} {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>{item.price.toFixed(2)} JOD</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.bottomContainer}>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {isArabic ? 'اتصل بالدعم' : 'Contact Support'}
            </Text>
          </Pressable>
          
          {selectedOrder.status === 'delivered' && (
            <Pressable style={[styles.actionButton, styles.primaryActionButton]}>
              <LinearGradient
                colors={[colors.primaryRed, '#FF6B6B']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryActionButtonText}>
                  {isArabic ? 'إعادة الطلب' : 'Reorder'}
                </Text>
              </LinearGradient>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <Stack.Screen
        options={{
          title: isArabic ? 'طلباتي' : 'My Orders',
          headerRight: () => (
            <Pressable onPress={() => setIsArabic(!isArabic)} style={commonStyles.headerButton}>
              <Text style={{ color: colors.textPrimary, fontSize: 14 }}>
                {isArabic ? 'EN' : 'عر'}
              </Text>
            </Pressable>
          ),
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'الطلبات الحديثة' : 'Recent Orders'}
          </Text>
          {mockOrders.map(renderOrderCard)}
        </View>
      </ScrollView>
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

  // Order card styles
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderTotal: {
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.primaryRed,
  },
  itemCount: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryAddress: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },

  // Order info styles
  orderInfoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.medium,
  },
  orderInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderInfoTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
  orderInfoDate: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  orderInfoTotal: {
    fontSize: 18,
    fontFamily: typography.fontFamilyBold,
    color: colors.primaryRed,
    marginBottom: spacing.sm,
  },
  orderInfoAddress: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  orderInfoEstimated: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
  },

  // Tracking styles
  trackingContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.medium,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  trackingStepLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconCompleted: {
    backgroundColor: colors.success,
  },
  stepIconActive: {
    backgroundColor: colors.primaryRed,
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  stepLineCompleted: {
    backgroundColor: colors.success,
  },
  trackingStepContent: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  stepTitleCompleted: {
    color: colors.textPrimary,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  stepTimestamp: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },

  // Map placeholder styles
  mapPlaceholder: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    ...shadows.medium,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },

  // Order items styles
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.primaryRed,
  },

  // Bottom actions styles
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
  },
  primaryActionButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: '100%',
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamilyBold,
    color: colors.textPrimary,
  },
});


import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  RefreshControl,
  FlatList,
  Switch,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  area: string;
  items: number;
  total: number;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  priority: 'normal' | 'urgent';
  estimatedTime: string;
  distance: string;
  paymentMethod: 'cash' | 'card' | 'paid';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryRed,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryRed,
    borderColor: colors.primaryRed,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.textPrimary,
  },
  orderCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.md,
    padding: spacing.md,
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
    fontWeight: '600',
    color: colors.textPrimary,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.warning,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  customerInfo: {
    marginBottom: spacing.sm,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryAction: {
    backgroundColor: colors.primaryRed,
    borderColor: colors.primaryRed,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryActionText: {
    color: colors.textPrimary,
  },
  secondaryActionText: {
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default function DeliveryDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isOnline, setIsOnline] = useState(true);

  // Mock data
  const [orders] = useState<DeliveryOrder[]>([
    {
      id: '1',
      orderNumber: '#LE001234',
      customerName: 'Ahmed Al-Rashid',
      customerPhone: '+962 79 123 4567',
      address: 'Abdoun, Building 15, Apt 3A, Amman',
      area: 'Abdoun',
      items: 3,
      total: 45.50,
      status: 'assigned',
      priority: 'urgent',
      estimatedTime: '25 min',
      distance: '2.3 km',
      paymentMethod: 'cash',
    },
    {
      id: '2',
      orderNumber: '#LE001235',
      customerName: 'Fatima Hassan',
      customerPhone: '+962 77 987 6543',
      address: 'Sweifieh, Rainbow Street 42, Amman',
      area: 'Sweifieh',
      items: 2,
      total: 32.00,
      status: 'picked_up',
      priority: 'normal',
      estimatedTime: '15 min',
      distance: '1.8 km',
      paymentMethod: 'paid',
    },
  ]);

  const filters = [
    { id: 'all', label: 'All Orders', labelAr: 'جميع الطلبات' },
    { id: 'assigned', label: 'Assigned', labelAr: 'مُعيّن' },
    { id: 'picked_up', label: 'Picked Up', labelAr: 'تم الاستلام' },
    { id: 'in_transit', label: 'In Transit', labelAr: 'في الطريق' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'assigned': return colors.warning;
      case 'picked_up': return colors.primaryRed;
      case 'in_transit': return colors.primaryRed;
      case 'delivered': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'picked_up': return 'Picked Up';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: DeliveryOrder['status']) => {
    console.log('Updating order status:', orderId, newStatus);
    Alert.alert('Status Updated', `Order status updated to ${getStatusText(newStatus)}`);
  };

  const handleCallCustomer = (phone: string) => {
    Alert.alert('Call Customer', `Calling ${phone}...`);
  };

  const handleNavigate = (address: string) => {
    Alert.alert('Navigation', `Opening navigation to: ${address}`);
  };

  const renderOrderCard = (order: DeliveryOrder) => (
    <View key={order.id} style={styles.orderCard}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        {order.priority === 'urgent' && (
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>URGENT</Text>
          </View>
        )}
      </View>

      {/* Customer Info */}
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <Text style={styles.customerPhone}>{order.customerPhone}</Text>
      </View>

      {/* Address */}
      <View style={styles.addressContainer}>
        <IconSymbol name="location" size={16} color={colors.primaryRed} />
        <Text style={styles.addressText}>{order.address}</Text>
      </View>

      {/* Order Details */}
      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>{order.items}</Text>
          <Text style={styles.detailLabel}>Items</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>JD {order.total}</Text>
          <Text style={styles.detailLabel}>Total</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>{order.distance}</Text>
          <Text style={styles.detailLabel}>Distance</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>{order.estimatedTime}</Text>
          <Text style={styles.detailLabel}>ETA</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable 
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => handleCallCustomer(order.customerPhone)}
        >
          <Text style={[styles.actionText, styles.secondaryActionText]}>Call</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => handleNavigate(order.address)}
        >
          <Text style={[styles.actionText, styles.secondaryActionText]}>Navigate</Text>
        </Pressable>

        <Pressable 
          style={[styles.actionButton, styles.primaryAction]}
          onPress={() => {
            const nextStatus = order.status === 'assigned' ? 'picked_up' : 
                             order.status === 'picked_up' ? 'in_transit' : 'delivered';
            handleUpdateStatus(order.id, nextStatus);
          }}
        >
          <Text style={[styles.actionText, styles.primaryActionText]}>
            {order.status === 'assigned' ? 'Pick Up' : 
             order.status === 'picked_up' ? 'Start Delivery' : 'Mark Delivered'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Delivery Dashboard',
          headerRight: () => (
            <Pressable onPress={() => router.push('/delivery/settings')}>
              <IconSymbol name="gear" size={24} color={colors.textPrimary} />
            </Pressable>
          ),
        }} 
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Good morning, Driver!</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.error }]} />
            <Text style={[styles.statusText, { color: isOnline ? colors.success : colors.error }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>JD 156</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <Pressable
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter.id && styles.filterTextActive,
            ]}>
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map(renderOrderCard)
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="truck.box" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              No orders found for the selected filter
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface DashboardStat {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - spacing.md * 3) / 2,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  positiveChange: {
    color: colors.success,
  },
  negativeChange: {
    color: colors.error,
  },
  neutralChange: {
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - spacing.md * 4) / 3,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  actionIcon: {
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  recentActivity: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  activityHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primaryRed,
    fontWeight: '500',
  },
  activityItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default function AdminDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const stats: DashboardStat[] = [
    {
      id: '1',
      title: 'Total Sales',
      value: 'JD 12,450',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'chart.line.uptrend.xyaxis',
      color: colors.success,
    },
    {
      id: '2',
      title: 'Orders Today',
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'bag',
      color: colors.primaryRed,
    },
    {
      id: '3',
      title: 'Active Users',
      value: '2,340',
      change: '+5.1%',
      changeType: 'positive',
      icon: 'person.3',
      color: colors.warning,
    },
    {
      id: '4',
      title: 'Revenue',
      value: 'JD 8,920',
      change: '-2.3%',
      changeType: 'negative',
      icon: 'dollarsign.circle',
      color: colors.error,
    },
  ];

  const quickActions: QuickAction[] = [
    { id: '1', title: 'Products', icon: 'cube.box', color: colors.primaryRed, route: '/admin/products' },
    { id: '2', title: 'Orders', icon: 'list.clipboard', color: colors.warning, route: '/admin/orders' },
    { id: '3', title: 'Users', icon: 'person.3', color: colors.success, route: '/admin/users' },
    { id: '4', title: 'Analytics', icon: 'chart.bar', color: colors.primaryRed, route: '/admin/analytics' },
    { id: '5', title: 'Marketing', icon: 'megaphone', color: colors.warning, route: '/admin/marketing' },
    { id: '6', title: 'Settings', icon: 'gear', color: colors.textSecondary, route: '/admin/settings' },
  ];

  const recentActivities = [
    {
      id: '1',
      text: 'New order #LE001256 received',
      time: '2 minutes ago',
      icon: 'plus.circle',
      color: colors.success,
    },
    {
      id: '2',
      text: 'Product "iPhone 15 Pro" updated',
      time: '15 minutes ago',
      icon: 'pencil.circle',
      color: colors.warning,
    },
    {
      id: '3',
      text: 'User "Ahmed Al-Rashid" registered',
      time: '1 hour ago',
      icon: 'person.badge.plus',
      color: colors.primaryRed,
    },
    {
      id: '4',
      text: 'Payment of JD 125.50 processed',
      time: '2 hours ago',
      icon: 'creditcard.circle',
      color: colors.success,
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleQuickAction = (route: string) => {
    console.log('Navigating to:', route);
    Alert.alert('Navigation', `Opening ${route}`);
  };

  const renderStatCard = (stat: DashboardStat) => (
    <View key={stat.id} style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statTitle}>{stat.title}</Text>
        <IconSymbol name={stat.icon} size={20} color={stat.color} />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={[
        styles.statChange,
        stat.changeType === 'positive' ? styles.positiveChange :
        stat.changeType === 'negative' ? styles.negativeChange : styles.neutralChange
      ]}>
        {stat.change} from last month
      </Text>
    </View>
  );

  const renderQuickAction = (action: QuickAction) => (
    <Pressable
      key={action.id}
      style={styles.actionCard}
      onPress={() => handleQuickAction(action.route)}
    >
      <IconSymbol 
        name={action.icon} 
        size={24} 
        color={action.color} 
        style={styles.actionIcon}
      />
      <Text style={styles.actionTitle}>{action.title}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Admin Dashboard',
          headerRight: () => (
            <Pressable onPress={() => Alert.alert('Notifications', 'No new notifications')}>
              <IconSymbol name="bell" size={24} color={colors.textPrimary} />
            </Pressable>
          ),
        }} 
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, Admin!</Text>
          <Text style={styles.subtitle}>Here's what's happening with your store today.</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            {stats.map(renderStatCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(renderQuickAction)}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.recentActivity}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Latest Updates</Text>
            <Pressable>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          
          {recentActivities.map((activity, index) => (
            <View 
              key={activity.id} 
              style={[
                styles.activityItem,
                index === recentActivities.length - 1 && styles.activityItemLast
              ]}
            >
              <IconSymbol 
                name={activity.icon} 
                size={20} 
                color={activity.color} 
                style={styles.activityIcon}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  sectionHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  logoutButton: {
    backgroundColor: colors.error,
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function DeliverySettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            console.log('Delivery driver logout');
            router.replace('/delivery/login');
          }
        }
      ]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'For technical support, please call: +962 6 123 4567\nEmail: support@leeoapp.com',
      [{ text: 'OK' }]
    );
  };

  const handleWorkingHours = () => {
    Alert.alert(
      'Working Hours',
      'Current schedule: 9:00 AM - 6:00 PM\nContact your supervisor to modify.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Settings' }} />
      
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile</Text>
          </View>
          
          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="person.circle" size={24} color={colors.primaryRed} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Edit Profile</Text>
                <Text style={styles.settingSubtitle}>Update your personal information</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={[styles.settingItem, styles.settingItemLast]} onPress={handleWorkingHours}>
            <View style={styles.settingLeft}>
              <IconSymbol name="clock" size={24} color={colors.primaryRed} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Working Hours</Text>
                <Text style={styles.settingSubtitle}>9:00 AM - 6:00 PM</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="bell" size={24} color={colors.primaryRed} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive order updates</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primaryRed }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <View style={[styles.settingItem, styles.settingItemLast]}>
            <View style={styles.settingLeft}>
              <IconSymbol name="checkmark.circle" size={24} color={colors.primaryRed} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto Accept Orders</Text>
                <Text style={styles.settingSubtitle}>Automatically accept new orders</Text>
              </View>
            </View>
            <Switch
              value={autoAcceptOrders}
              onValueChange={setAutoAcceptOrders}
              trackColor={{ false: colors.border, true: colors.primaryRed }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Location & Navigation</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="location" size={24} color={colors.primaryRed} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Location Sharing</Text>
                <Text style={styles.settingSubtitle}>Share location with customers</Text>
              </View>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: colors.border, true: colors.primaryRed }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <Pressable style={[styles.settingItem, styles.settingItemLast]}>
            <View style={styles.settingLeft}>
              <IconSymbol name="map" size={24} color={colors.primaryRed} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Navigation Preferences</Text>
                <Text style={styles.settingSubtitle}>Choose your preferred map app</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          
          <Pressable style={styles.settingItem} onPress={handleSupport}>
            <View style={styles.settingLeft}>
              <IconSymbol name="questionmark.circle" size={24} color={colors.primaryRed} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingSubtitle}>Get help or contact support</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={[styles.settingItem, styles.settingItemLast]}>
            <View style={styles.settingLeft}>
              <IconSymbol name="info.circle" size={24} color={colors.primaryRed} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>App Version</Text>
                <Text style={styles.settingSubtitle}>v1.0.0 (Professional)</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

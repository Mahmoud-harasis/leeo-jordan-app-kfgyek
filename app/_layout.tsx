
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { SystemBars } from "react-native-edge-to-edge";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useNetworkState } from "expo-network";
import * as SplashScreen from "expo-splash-screen";
import { Button } from "@/components/button";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import React, { useEffect, useState } from "react";
import { useColorScheme, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/styles/commonStyles";
import { SecureStorage } from "@/components/SecureStorage";
import BiometricAuth from "@/components/BiometricAuth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Custom theme for Leeo App
const LeeoTheme: Theme = {
  dark: true,
  colors: {
    primary: colors.primaryRed,
    background: colors.background,
    card: colors.card,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.primaryRed,
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const { isConnected } = useNetworkState();
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showBiometric, setShowBiometric] = useState(false);

  useEffect(() => {
    if (loaded) {
      checkAuthenticationStatus();
    }
  }, [loaded]);

  useEffect(() => {
    if (isConnected === false) {
      console.log('Network disconnected - enabling offline mode');
      // Here you could implement offline functionality
    }
  }, [isConnected]);

  const checkAuthenticationStatus = async () => {
    try {
      const userSession = await SecureStorage.getUserSession();
      const biometricEnabled = await SecureStorage.getItem('biometric_enabled');
      
      if (userSession) {
        if (biometricEnabled === 'true') {
          setShowBiometric(true);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        // Redirect to onboarding for new users
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    } finally {
      SplashScreen.hideAsync();
    }
  };

  const handleBiometricSuccess = () => {
    setShowBiometric(false);
    setIsAuthenticated(true);
  };

  const handleBiometricCancel = () => {
    setShowBiometric(false);
    setIsAuthenticated(false);
    router.replace('/login');
  };

  if (!loaded || isAuthenticated === null) {
    return null;
  }

  if (showBiometric) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <WidgetProvider>
          <ThemeProvider value={LeeoTheme}>
            <SystemBars style="light" />
            <BiometricAuth
              onSuccess={handleBiometricSuccess}
              onCancel={handleBiometricCancel}
              title="Welcome Back"
              subtitle="Use your biometric to securely access your account"
            />
            <StatusBar style="light" backgroundColor={colors.background} />
          </ThemeProvider>
        </WidgetProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WidgetProvider>
        <ThemeProvider value={LeeoTheme}>
          <SystemBars style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.textPrimary,
              headerTitleStyle: {
                fontWeight: '600',
                fontSize: 18,
              },
              headerShadowVisible: false,
            }}
          >
            {/* Main app tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            
            {/* Onboarding */}
            <Stack.Screen 
              name="onboarding" 
              options={{ 
                headerShown: false,
                gestureEnabled: false,
              }} 
            />
            
            {/* Authentication */}
            <Stack.Screen 
              name="login" 
              options={{ 
                title: "Login",
                headerShown: true,
              }} 
            />
            <Stack.Screen 
              name="register" 
              options={{ 
                title: "Register",
                headerShown: true,
              }} 
            />
            
            {/* Shopping */}
            <Stack.Screen 
              name="product/[id]" 
              options={{ 
                title: "Product Details",
                headerShown: true,
              }} 
            />
            <Stack.Screen 
              name="cart" 
              options={{ 
                title: "Shopping Cart",
                headerShown: true,
              }} 
            />
            <Stack.Screen 
              name="checkout" 
              options={{ 
                title: "Checkout",
                headerShown: true,
              }} 
            />
            
            {/* Orders & Tracking */}
            <Stack.Screen 
              name="orders" 
              options={{ 
                title: "My Orders",
                headerShown: true,
              }} 
            />
            
            {/* Settings */}
            <Stack.Screen 
              name="settings" 
              options={{ 
                title: "Settings",
                headerShown: true,
              }} 
            />

            {/* Delivery Driver Routes */}
            <Stack.Screen 
              name="delivery/login" 
              options={{ 
                headerShown: false,
                gestureEnabled: false,
              }} 
            />
            <Stack.Screen 
              name="delivery/dashboard" 
              options={{ 
                title: "Delivery Dashboard",
                headerShown: true,
              }} 
            />
            <Stack.Screen 
              name="delivery/settings" 
              options={{ 
                title: "Delivery Settings",
                headerShown: true,
              }} 
            />

            {/* Admin Routes */}
            <Stack.Screen 
              name="admin/login" 
              options={{ 
                headerShown: false,
                gestureEnabled: false,
              }} 
            />
            <Stack.Screen 
              name="admin/dashboard" 
              options={{ 
                title: "Admin Dashboard",
                headerShown: true,
              }} 
            />
            
            {/* Modals */}
            <Stack.Screen 
              name="modal" 
              options={{ 
                presentation: "modal",
                title: "Modal",
              }} 
            />
            <Stack.Screen 
              name="formsheet" 
              options={{ 
                presentation: "formSheet",
                title: "Form Sheet",
              }} 
            />
            <Stack.Screen 
              name="transparent-modal" 
              options={{ 
                presentation: "transparentModal",
                title: "Transparent Modal",
              }} 
            />
          </Stack>
          <StatusBar style="light" backgroundColor={colors.background} />
        </ThemeProvider>
      </WidgetProvider>
    </GestureHandlerRootView>
  );
}

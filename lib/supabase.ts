import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type UserRole = 'user' | 'driver' | 'admin';

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  wallet_balance: number;
  loyalty_points: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  price_jd: number;
  original_price_jd: number | null;
  category_id: string | null;
  stock: number;
  images: string[];
  badges: string[];
  rating: number;
  review_count: number;
  active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name_en: string;
  name_ar: string;
  parent_id: string | null;
  icon: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total_jd: number;
  subtotal_jd: number;
  discount_jd: number;
  delivery_fee_jd: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_address: any;
  driver_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  options: any;
  created_at: string;
  updated_at: string;
  product?: Product;
};

export type Driver = {
  id: string;
  user_id: string;
  license_number: string;
  vehicle_info: any;
  status: 'offline' | 'available' | 'busy';
  current_location: any;
  rating: number;
  total_deliveries: number;
  earnings_jd: number;
  documents: any[];
  approved: boolean;
  created_at: string;
  updated_at: string;
};

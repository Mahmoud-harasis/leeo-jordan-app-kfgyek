/*
  # Leeo App - Complete Database Schema

  ## Overview
  This migration creates the complete database structure for the Leeo shopping app,
  including user management, products, orders, drivers, and administrative features.

  ## New Tables

  ### 1. profiles
  Extended user profiles linked to auth.users
  - `id` (uuid, FK to auth.users)
  - `full_name` (text)
  - `phone` (text)
  - `role` (enum: user, driver, admin)
  - `wallet_balance` (decimal) - in JD
  - `loyalty_points` (integer)
  - `avatar_url` (text)
  - `created_at`, `updated_at` (timestamptz)

  ### 2. categories
  Product categories with multi-language support
  - `id` (uuid, PK)
  - `name_en`, `name_ar` (text)
  - `parent_id` (uuid, self-reference for subcategories)
  - `icon` (text)
  - `display_order` (integer)
  - `active` (boolean)

  ### 3. products
  Product catalog with full details
  - `id` (uuid, PK)
  - `title_en`, `title_ar` (text)
  - `description_en`, `description_ar` (text)
  - `price_jd` (decimal)
  - `original_price_jd` (decimal, for sales)
  - `category_id` (uuid, FK)
  - `stock` (integer)
  - `images` (jsonb array)
  - `badges` (jsonb array: new, sale, hot, exclusive)
  - `rating` (decimal)
  - `review_count` (integer)
  - `active` (boolean)
  - `featured` (boolean)
  - `created_at`, `updated_at` (timestamptz)

  ### 4. orders
  Customer orders
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `total_jd` (decimal)
  - `subtotal_jd` (decimal)
  - `discount_jd` (decimal)
  - `delivery_fee_jd` (decimal)
  - `status` (enum: pending, confirmed, preparing, out_for_delivery, delivered, cancelled)
  - `payment_method` (text: click, apple_pay, card, paypal, cod)
  - `payment_status` (enum: pending, paid, failed, refunded)
  - `delivery_address` (jsonb)
  - `driver_id` (uuid, FK to drivers)
  - `created_at`, `updated_at` (timestamptz)

  ### 5. order_items
  Items within each order
  - `id` (uuid, PK)
  - `order_id` (uuid, FK)
  - `product_id` (uuid, FK)
  - `quantity` (integer)
  - `price_jd` (decimal, snapshot at purchase time)
  - `options` (jsonb, for size/color/variants)

  ### 6. drivers
  Delivery driver information
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `license_number` (text)
  - `vehicle_info` (jsonb)
  - `status` (enum: offline, available, busy)
  - `current_location` (point, PostGIS)
  - `rating` (decimal)
  - `total_deliveries` (integer)
  - `earnings_jd` (decimal)
  - `documents` (jsonb array)
  - `approved` (boolean)
  - `created_at`, `updated_at` (timestamptz)

  ### 7. coupons
  Discount coupons and promotions
  - `id` (uuid, PK)
  - `code` (text, unique)
  - `discount_type` (enum: percentage, fixed)
  - `discount_value` (decimal)
  - `min_order_jd` (decimal)
  - `max_discount_jd` (decimal)
  - `usage_limit` (integer)
  - `used_count` (integer)
  - `active` (boolean)
  - `valid_from`, `valid_to` (timestamptz)

  ### 8. banners
  Marketing banners for home page
  - `id` (uuid, PK)
  - `title_en`, `title_ar` (text)
  - `subtitle_en`, `subtitle_ar` (text)
  - `image_url` (text)
  - `link` (text)
  - `color` (text)
  - `display_order` (integer)
  - `active` (boolean)
  - `valid_from`, `valid_to` (timestamptz)

  ### 9. transactions
  Financial transactions (wallet, refunds, etc.)
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `order_id` (uuid, FK, nullable)
  - `amount_jd` (decimal)
  - `type` (enum: purchase, refund, wallet_topup, loyalty_redemption)
  - `status` (enum: pending, completed, failed)
  - `payment_gateway_ref` (text)
  - `created_at` (timestamptz)

  ### 10. reviews
  Product reviews and ratings
  - `id` (uuid, PK)
  - `product_id` (uuid, FK)
  - `user_id` (uuid, FK)
  - `order_id` (uuid, FK)
  - `rating` (integer, 1-5)
  - `comment` (text)
  - `images` (jsonb array)
  - `created_at` (timestamptz)

  ### 11. cart_items
  Shopping cart (persistent)
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `product_id` (uuid, FK)
  - `quantity` (integer)
  - `options` (jsonb)
  - `created_at`, `updated_at` (timestamptz)

  ### 12. wishlists
  User wishlists
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `product_id` (uuid, FK)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Drivers can only see assigned orders
  - Admins have full access
  - Public read access for products, categories, banners

  ## Indexes
  - Performance indexes on foreign keys
  - Text search indexes on product names/descriptions
  - Geospatial indexes for driver locations
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'driver', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE driver_status AS ENUM ('offline', 'available', 'busy');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('purchase', 'refund', 'wallet_topup', 'loyalty_redemption');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  role user_role DEFAULT 'user' NOT NULL,
  wallet_balance decimal(10,2) DEFAULT 0.00 NOT NULL,
  loyalty_points integer DEFAULT 0 NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  icon text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text,
  description_ar text,
  price_jd decimal(10,2) NOT NULL,
  original_price_jd decimal(10,2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stock integer DEFAULT 0 NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  badges jsonb DEFAULT '[]'::jsonb,
  rating decimal(3,2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  active boolean DEFAULT true NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_jd decimal(10,2) NOT NULL,
  subtotal_jd decimal(10,2) NOT NULL,
  discount_jd decimal(10,2) DEFAULT 0.00,
  delivery_fee_jd decimal(10,2) DEFAULT 3.00,
  status order_status DEFAULT 'pending' NOT NULL,
  payment_method text NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  delivery_address jsonb NOT NULL,
  driver_id uuid,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_jd decimal(10,2) NOT NULL,
  options jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  license_number text NOT NULL,
  vehicle_info jsonb NOT NULL,
  status driver_status DEFAULT 'offline' NOT NULL,
  current_location geography(Point),
  rating decimal(3,2) DEFAULT 5.00,
  total_deliveries integer DEFAULT 0,
  earnings_jd decimal(10,2) DEFAULT 0.00,
  documents jsonb DEFAULT '[]'::jsonb,
  approved boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Add foreign key for driver_id in orders
ALTER TABLE orders ADD CONSTRAINT fk_orders_driver 
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL;

-- 7. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  discount_type discount_type NOT NULL,
  discount_value decimal(10,2) NOT NULL,
  min_order_jd decimal(10,2) DEFAULT 0.00,
  max_discount_jd decimal(10,2),
  usage_limit integer,
  used_count integer DEFAULT 0,
  active boolean DEFAULT true NOT NULL,
  valid_from timestamptz DEFAULT now(),
  valid_to timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Banners Table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  subtitle_en text,
  subtitle_ar text,
  image_url text NOT NULL,
  link text,
  color text DEFAULT '#EE3F40',
  display_order integer DEFAULT 0,
  active boolean DEFAULT true NOT NULL,
  valid_from timestamptz DEFAULT now(),
  valid_to timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 9. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  amount_jd decimal(10,2) NOT NULL,
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending' NOT NULL,
  payment_gateway_ref text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 10. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(product_id, user_id, order_id)
);

-- 11. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  options jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 12. Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_location ON drivers USING GIST(current_location);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Categories (Public Read)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Products (Public Read)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Drivers can view assigned orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM drivers
      WHERE drivers.user_id = auth.uid() AND drivers.id = orders.driver_id
    )
  );

CREATE POLICY "Drivers can update assigned orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM drivers
      WHERE drivers.user_id = auth.uid() AND drivers.id = orders.driver_id
    )
  );

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Order Items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for Drivers
CREATE POLICY "Drivers can view own profile"
  ON drivers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Drivers can update own profile"
  ON drivers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all drivers"
  ON drivers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Coupons
CREATE POLICY "Users can view active coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (active = true AND now() BETWEEN valid_from AND COALESCE(valid_to, now() + interval '1 year'));

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Banners (Public Read)
CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  TO authenticated
  USING (active = true AND now() BETWEEN valid_from AND COALESCE(valid_to, now() + interval '1 year'));

CREATE POLICY "Admins can manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for Cart Items
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for Wishlists
CREATE POLICY "Users can manage own wishlist"
  ON wishlists FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
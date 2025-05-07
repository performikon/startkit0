-- Seed file for Supabase database
-- Created at: 2025-05-07T18:52:25.000Z
-- Updated at: 2025-05-07T20:06:15.000Z

-- First, insert users into auth.users table
-- Note: In a real application, you would create users through the Supabase Auth API
-- This is a simplified version for demonstration purposes

-- Create test users in auth.users table
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data,
  aud,
  role,
  is_anonymous,
  is_sso_user
)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789',  -- This is a dummy hash, not a real password
    NOW(),
    NOW(),
    NOW(),
    '{"first_name": "Admin", "last_name": "User", "avatar_url": "https://example.com/avatars/admin.png"}'::jsonb,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'test@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789',  -- This is a dummy hash, not a real password
    NOW(),
    NOW(),
    NOW(),
    '{"first_name": "Test", "last_name": "User", "avatar_url": "https://example.com/avatars/test.png"}'::jsonb,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'jane@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789',  -- This is a dummy hash, not a real password
    NOW(),
    NOW(),
    NOW(),
    '{"first_name": "Jane", "last_name": "Doe", "avatar_url": "https://example.com/avatars/jane.png"}'::jsonb,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    false,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Then insert profiles
-- The trigger function should handle this automatically, but we'll do it manually for demonstration
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  avatar_url
)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Admin',
    'User',
    'https://example.com/avatars/admin.png'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Test',
    'User',
    'https://example.com/avatars/test.png'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Jane',
    'Doe',
    'https://example.com/avatars/jane.png'
  )
ON CONFLICT (id) DO NOTHING;

-- Example of other tables you might want to seed
-- For example:
--
-- -- Create sample products
-- CREATE TABLE IF NOT EXISTS public.products (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   name TEXT NOT NULL,
--   description TEXT,
--   price DECIMAL(10, 2) NOT NULL
-- );
--
-- INSERT INTO public.products (name, description, price)
-- VALUES
--   ('Product 1', 'Description for product 1', 19.99),
--   ('Product 2', 'Description for product 2', 29.99),
--   ('Product 3', 'Description for product 3', 39.99)
-- ON CONFLICT (id) DO NOTHING;
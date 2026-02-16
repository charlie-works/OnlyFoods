-- Create membership_applications table
CREATE TABLE IF NOT EXISTS membership_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  items TEXT NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow inserts from anyone (for form submissions)
CREATE POLICY "Allow public inserts on membership_applications"
  ON membership_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public inserts on orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policies to allow authenticated users to read (optional - for admin dashboard)
CREATE POLICY "Allow authenticated reads on membership_applications"
  ON membership_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated reads on orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

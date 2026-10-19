CREATE TABLE tracking_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip text NOT NULL,
  last_active timestamp with time zone DEFAULT now(),
  dropoff_step integer NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  events text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Optional: Create an index on the ip column for faster lookups
CREATE INDEX idx_tracking_data_ip ON tracking_data(ip);
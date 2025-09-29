import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your actual Supabase URL and anon key
// You can get these from your Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface SilverAsset {
  id: string
  name: string
  purchase_price: number
  purchase_date: string
  silver_weight_oz: number
  created_at: string
  updated_at: string
}

export interface SilverPriceHistory {
  id: string
  price_per_oz: number
  date: string
  created_at: string
}

import { createClient } from '@supabase/supabase-js'

// You need to set these environment variables or replace with your actual values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types matching the schema
export interface SilverAsset {
  id?: string
  name: string
  purchase_price: number
  silver_price_at_purchase: number
  purchase_date: string
  silver_weight_oz: number
  created_at?: string
  updated_at?: string
}

export interface SilverPriceHistory {
  id?: string
  price_per_oz: number
  timestamp: string
  source?: string
  exchange?: string
  prev_close_price?: number
  open_price?: number
  high_price?: number
  low_price?: number
  created_at?: string
}

// Database service functions
export class SilverDatabaseService {
  
  // Save a new silver asset
  async saveAsset(asset: Omit<SilverAsset, 'id' | 'created_at' | 'updated_at'>): Promise<SilverAsset | null> {
    try {
      console.log('Saving asset to database:', asset)
      
      const { data, error } = await supabase
        .from('silver_assets')
        .insert([asset])
        .select()
        .single()

      if (error) {
        console.error('Error saving asset:', error)
        return null
      }

      console.log('Asset saved successfully:', data)
      return data
    } catch (error) {
      console.error('Error saving asset:', error)
      return null
    }
  }

  // Get all silver assets
  async getAllAssets(): Promise<SilverAsset[]> {
    try {
      console.log('Loading assets from database...')
      
      const { data, error } = await supabase
        .from('silver_assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading assets:', error)
        return []
      }

      console.log('Assets loaded successfully:', data)
      return data || []
    } catch (error) {
      console.error('Error loading assets:', error)
      return []
    }
  }

  // Delete an asset
  async deleteAsset(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('silver_assets')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting asset:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting asset:', error)
      return false
    }
  }

  // Save price history
  async savePriceHistory(priceData: Omit<SilverPriceHistory, 'id' | 'created_at'>): Promise<boolean> {
    try {
      console.log('Saving price history:', priceData)
      
      const { error } = await supabase
        .from('silver_price_history')
        .insert([priceData])

      if (error) {
        console.error('Error saving price history:', error)
        return false
      }

      console.log('Price history saved successfully')
      return true
    } catch (error) {
      console.error('Error saving price history:', error)
      return false
    }
  }

  // Get recent price history
  async getPriceHistory(days: number = 30): Promise<SilverPriceHistory[]> {
    try {
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - days)

      const { data, error } = await supabase
        .from('silver_price_history')
        .select('*')
        .gte('timestamp', fromDate.toISOString())
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error loading price history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error loading price history:', error)
      return []
    }
  }
}

export const silverDB = new SilverDatabaseService()

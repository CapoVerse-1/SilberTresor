import axios from 'axios'

const SILVER_API_KEY = import.meta.env.VITE_SILVER_API_KEY || 'goldapi-15smtnsmg4ubhog-io'

export interface SilverPriceResponse {
  timestamp: number
  metal: string
  currency: string
  exchange: string
  symbol: string
  prev_close_price: number
  open_price: number
  low_price: number
  high_price: number
  open_time: number
  price: number
}

export class SilverPriceService {
  private readonly baseURL = 'https://www.goldapi.io/api'
  
  async getCurrentSilverPrice(): Promise<number> {
    try {
      // Using GoldAPI.io for silver prices (XAG/USD)
      const response = await axios.get(`${this.baseURL}/XAG/USD`, {
        headers: {
          'x-access-token': SILVER_API_KEY,
        }
      })
      
      console.log('Silver price response:', response.data)
      return response.data.price || 24.50
    } catch (error) {
      console.error('Error fetching silver price:', error)
      // Return a fallback price for demo purposes
      return 24.50
    }
  }
  
  async getSilverPriceHistory(days: number = 7): Promise<SilverPriceResponse[]> {
    try {
      // GoldAPI doesn't provide historical data in free tier
      // We'll simulate based on current price for now
      const currentResponse = await this.getCurrentSilverPriceWithDetails()
      const history: SilverPriceResponse[] = []
      
      for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        // Simulate realistic price variation based on current price
        const basePrice = currentResponse.price
        const variation = (Math.random() - 0.5) * 4 // ±2 USD variation
        const price = Math.max(basePrice + variation, 0.1) // Ensure price stays positive
        
        history.push({
          timestamp: Math.floor(date.getTime() / 1000),
          metal: 'XAG',
          currency: 'USD',
          exchange: 'FOREXCOM',
          symbol: 'FOREXCOM:XAGUSD',
          prev_close_price: price - 0.1,
          open_price: price + 0.05,
          low_price: price - 0.2,
          high_price: price + 0.3,
          open_time: Math.floor(date.getTime() / 1000),
          price: Math.round(price * 100) / 100
        })
      }
      
      return history
    } catch (error) {
      console.error('Error fetching silver price history:', error)
      return []
    }
  }

  async getCurrentSilverPriceWithDetails(): Promise<SilverPriceResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/XAG/USD`, {
        headers: {
          'x-access-token': SILVER_API_KEY,
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error fetching detailed silver price:', error)
      // Return fallback data
      return {
        timestamp: Math.floor(Date.now() / 1000),
        metal: 'XAG',
        currency: 'USD',
        exchange: 'FOREXCOM',
        symbol: 'FOREXCOM:XAGUSD',
        prev_close_price: 24.00,
        open_price: 24.20,
        low_price: 23.80,
        high_price: 24.60,
        open_time: Math.floor(Date.now() / 1000),
        price: 24.50
      }
    }
  }
}

export const silverPriceService = new SilverPriceService()

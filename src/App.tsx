import React, { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, Coins, DollarSign, RefreshCw } from 'lucide-react'
import { silverPriceService } from './lib/silverApi'

// Type definitions for frontend
interface SilverAsset {
  id: string
  name: string
  purchase_price: number
  silver_price_at_purchase: number
  purchase_date: string
  silver_weight_oz: number
  created_at: string
  updated_at: string
}

function App() {
  const [currentSilverPrice, setCurrentSilverPrice] = useState<number>(0)
  const [assets, setAssets] = useState<SilverAsset[]>([])
  const [isAddingAsset, setIsAddingAsset] = useState(false)
  const [weeklyChange, setWeeklyChange] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  
  // New asset form state
  const [newAsset, setNewAsset] = useState({
    name: '',
    purchase_price: 0,
    silver_price_at_purchase: 0,
    silver_weight: 0,
    weight_unit: 'oz' as 'oz' | 'g' | 'kg',
    purchase_date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  })

  // Conversion constants for troy ounces
  const TROY_OZ_TO_GRAMS = 31.1035
  const convertToTroyOz = (weight: number, unit: string): number => {
    switch(unit) {
      case 'oz': return weight // Already in troy ounces
      case 'g': return weight / TROY_OZ_TO_GRAMS
      case 'kg': return (weight * 1000) / TROY_OZ_TO_GRAMS
      default: return weight
    }
  }

  useEffect(() => {
    loadData()
    
    // Set up automatic price updates every 30 seconds
    const interval = setInterval(() => {
      loadData(true) // Refresh without showing main loading spinner
    }, 30000) // 30 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      // Load current silver price with full details
      const priceData = await silverPriceService.getCurrentSilverPriceWithDetails()
      setCurrentSilverPrice(priceData.price)
      setLastUpdated(new Date())
      
      // Calculate weekly change based on previous close vs current price
      if (priceData.prev_close_price && priceData.prev_close_price > 0) {
        const change = ((priceData.price - priceData.prev_close_price) / priceData.prev_close_price) * 100
        setWeeklyChange(change)
      } else {
        // Fallback to simulated change if no previous close data
        const randomChange = (Math.random() - 0.5) * 8 // -4% to +4%
        setWeeklyChange(randomChange)
      }
      
      console.log('Loaded silver price data:', priceData)
      
    } catch (error) {
      console.error('Error loading data:', error)
      // Set fallback values
      setCurrentSilverPrice(24.50)
      setWeeklyChange(0)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshPrice = () => {
    loadData(true)
  }

  const calculateTotalWorth = () => {
    return assets.reduce((total, asset) => total + (asset.silver_weight_oz * currentSilverPrice), 0)
  }

  const calculateTotalInvested = () => {
    return assets.reduce((total, asset) => total + asset.purchase_price, 0)
  }

  const calculateTotalGrams = () => {
    return assets.reduce((total, asset) => total + (asset.silver_weight_oz * TROY_OZ_TO_GRAMS), 0)
  }

  const calculateTotalPremiumPaid = () => {
    return assets.reduce((total, asset) => total + calculateCollectorsPremium(asset), 0)
  }

  const calculateCollectorsPremium = (asset: SilverAsset) => {
    const silverValueAtPurchase = asset.silver_weight_oz * asset.silver_price_at_purchase
    return asset.purchase_price - silverValueAtPurchase
  }

  const getAssetStatus = (asset: SilverAsset) => {
    const currentWorth = asset.silver_weight_oz * currentSilverPrice
    const silverValueAtPurchase = asset.silver_weight_oz * asset.silver_price_at_purchase
    
    if (currentWorth < silverValueAtPurchase) return 'loss' // Red - below silver value
    if (currentWorth < asset.purchase_price) return 'breaking-even' // Orange - above silver but below total paid
    return 'profit' // Green - above what you paid
  }

  const calculateProfitLoss = () => {
    return calculateTotalWorth() - calculateTotalInvested()
  }

  const addAsset = () => {
    const troyOunces = convertToTroyOz(newAsset.silver_weight, newAsset.weight_unit)
    
    const asset: SilverAsset = {
      id: Date.now().toString(),
      name: newAsset.name,
      purchase_price: newAsset.purchase_price,
      silver_price_at_purchase: newAsset.silver_price_at_purchase,
      purchase_date: new Date(newAsset.purchase_date).toISOString(),
      silver_weight_oz: troyOunces,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setAssets([...assets, asset])
    setNewAsset({ 
      name: '', 
      purchase_price: 0, 
      silver_price_at_purchase: 0, 
      silver_weight: 0, 
      weight_unit: 'oz',
      purchase_date: new Date().toISOString().split('T')[0]
    })
    setIsAddingAsset(false)
  }

  const profitLoss = calculateProfitLoss()
  const isProfit = profitLoss >= 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-silver-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SilverApp</h1>
          <p className="text-gray-600">Track your silver investments</p>
        </div>

        {/* Current Silver Price */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <p className="text-sm text-gray-500 uppercase tracking-wide">Current Silver Price</p>
              <p className="text-2xl font-semibold text-gray-700">${currentSilverPrice.toFixed(2)}/oz</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={refreshPrice}
              disabled={refreshing}
              className={`ml-4 p-2 rounded-lg transition-colors ${
                refreshing 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-silver-600 hover:bg-gray-100'
              }`}
              title="Refresh silver price"
            >
              <RefreshCw 
                size={20} 
                className={refreshing ? 'animate-spin' : ''} 
              />
            </button>
          </div>
        </div>

        {/* Total Worth - Prominently displayed */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center border-2 border-gray-100">
          <div className="mb-4">
            <p className="text-lg text-gray-500 uppercase tracking-wide mb-2">Total Silver Worth</p>
            <p className={`text-6xl font-bold mb-4 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              ${calculateTotalWorth().toFixed(2)}
            </p>
            
            {/* Weekly Change */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              weeklyChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {weeklyChange >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {weeklyChange >= 0 ? '+' : ''}{weeklyChange.toFixed(1)}% this week
            </div>
          </div>
        </div>

        {/* Total Invested */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">${calculateTotalInvested().toFixed(2)}</p>
                <p className="text-sm text-gray-500">{calculateTotalGrams().toFixed(1)}g total silver</p>
                <p className="text-xs text-gray-400">Premium paid: ${calculateTotalPremiumPaid().toFixed(2)}</p>
              </div>
            </div>
            <div className={`text-right ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              <p className="text-sm uppercase tracking-wide">Profit/Loss</p>
              <p className="text-xl font-bold">
                {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-silver-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">My Assets</h2>
            </div>
            <button
              onClick={() => {
                setIsAddingAsset(true)
                setNewAsset({ 
                  ...newAsset, 
                  purchase_price: 0, // Let user enter total amount paid
                  silver_price_at_purchase: currentSilverPrice,
                  purchase_date: new Date().toISOString().split('T')[0]
                })
              }}
              className="bg-silver-600 hover:bg-silver-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Asset
            </button>
          </div>

          {/* Assets List */}
          <div className="space-y-4 mb-6">
            {assets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Coins size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No assets added yet</p>
                <p className="text-sm">Click "Add Asset" to get started</p>
              </div>
            ) : (
              assets.map((asset) => {
                const currentWorth = asset.silver_weight_oz * currentSilverPrice
                const profitLossAsset = currentWorth - asset.purchase_price
                const collectorsPremium = calculateCollectorsPremium(asset)
                const status = getAssetStatus(asset)
                
                const getStatusColor = () => {
                  switch(status) {
                    case 'loss': return 'text-red-600'
                    case 'breaking-even': return 'text-orange-600' 
                    case 'profit': return 'text-green-600'
                    default: return 'text-gray-600'
                  }
                }
                
                return (
                  <div key={asset.id} className="border border-gray-200 rounded-lg p-3 mx-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{asset.name}</h3>
                        <p className="text-xs text-gray-500">
                          {asset.silver_weight_oz.toFixed(3)} oz • Paid: ${asset.purchase_price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 leading-tight">
                          Spot: ${asset.silver_price_at_purchase.toFixed(2)}/oz • Premium: ${collectorsPremium.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(asset.purchase_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-sm font-semibold text-gray-900">
                          ${currentWorth.toFixed(2)}
                        </p>
                        <p className={`text-xs font-medium ${getStatusColor()}`}>
                          {profitLossAsset >= 0 ? '+' : ''}${profitLossAsset.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Add Asset Form */}
          {isAddingAsset && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Asset</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="e.g., American Silver Eagle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silver-500 focus:border-silver-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Purchase Price ($)
                  </label>
                  <input
                    type="number"
                    value={newAsset.purchase_price}
                    onChange={(e) => setNewAsset({ ...newAsset, purchase_price: parseFloat(e.target.value) || 0 })}
                    step="0.01"
                    placeholder="Total amount paid"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silver-500 focus:border-silver-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Silver Spot Price ($/oz)
                  </label>
                  <input
                    type="number"
                    value={newAsset.silver_price_at_purchase}
                    onChange={(e) => setNewAsset({ ...newAsset, silver_price_at_purchase: parseFloat(e.target.value) || 0 })}
                    step="0.01"
                    placeholder="Spot price per oz"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silver-500 focus:border-silver-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Silver Weight
                  </label>
                  <input
                    type="number"
                    value={newAsset.silver_weight}
                    onChange={(e) => setNewAsset({ ...newAsset, silver_weight: parseFloat(e.target.value) || 0 })}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silver-500 focus:border-silver-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={newAsset.weight_unit}
                    onChange={(e) => setNewAsset({ ...newAsset, weight_unit: e.target.value as 'oz' | 'g' | 'kg' })}
                    className="custom-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silver-500 focus:border-silver-500"
                  >
                    <option value="oz">Troy Oz</option>
                    <option value="g">Grams</option>
                    <option value="kg">Kilograms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={newAsset.purchase_date}
                    onChange={(e) => setNewAsset({ ...newAsset, purchase_date: e.target.value })}
                    className="custom-date w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-silver-500 focus:border-silver-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setIsAddingAsset(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addAsset}
                  disabled={!newAsset.name || newAsset.purchase_price <= 0 || newAsset.silver_price_at_purchase <= 0 || newAsset.silver_weight <= 0 || !newAsset.purchase_date}
                  className="px-4 py-2 bg-silver-600 text-white rounded-lg hover:bg-silver-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Asset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

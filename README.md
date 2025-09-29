# 🥈 SilverApp - Silver Investment Tracker

A professional React TypeScript application for tracking your silver investments with real-time pricing, collector's premium calculations, and comprehensive portfolio analysis.

## ✨ Features

- **📊 Real-time Silver Prices** - Live spot prices from GoldAPI.io
- **💰 Portfolio Tracking** - Track total worth, investment, and profit/loss
- **🪙 Collector's Premium** - Calculate premiums paid above spot price
- **⚖️ Multi-Unit Support** - Troy ounces, grams, and kilograms
- **🎯 Smart Color Coding** - Red (loss), Orange (breaking even), Green (profit)
- **🔄 Auto-Updates** - Prices refresh every 30 seconds
- **📅 Purchase History** - Track purchase dates and historical prices
- **📱 Mobile Responsive** - Clean, professional UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional - for data persistence)
- GoldAPI.io account (for live silver prices)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd SilverApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   VITE_SILVER_API_KEY=your-goldapi-key-here
   ```

4. **Set up database (optional)**
   
   Run the SQL schema from `database-schema.sql` in your Supabase dashboard:
   ```bash
   # Copy the contents of database-schema.sql 
   # and run in Supabase SQL Editor
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** > **API**
4. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### GoldAPI.io Setup

1. Go to [goldapi.io](https://goldapi.io)
2. Sign up for free account
3. Get your API key from dashboard
4. Use in `VITE_SILVER_API_KEY`

## 🗄️ Database Schema

The app uses PostgreSQL (via Supabase) with these main tables:

- **`silver_assets`** - Your silver investments
  - Asset name, purchase price, weight, dates
  - Silver spot price at purchase
  - Automatic timestamps

- **`silver_price_history`** - Price tracking (optional)
  - Historical silver prices
  - Market data from API

## 💡 Usage

### Adding Assets

1. Click **"Add Asset"** 
2. Fill in:
   - **Asset Name** (e.g., "American Silver Eagle")
   - **Total Purchase Price** (what you actually paid)
   - **Silver Spot Price** (per troy ounce when bought)
   - **Weight & Unit** (Troy oz, grams, or kg)
   - **Purchase Date**

### Understanding Colors

- 🟢 **Green** - Asset worth more than you paid (profit)
- 🟠 **Orange** - Above silver value but below total paid (breaking even)
- 🔴 **Red** - Below silver content value (loss)

### Collector's Premium

The app automatically calculates:
- **Premium Paid** = Total Paid - (Silver Weight × Spot Price)
- **Total Premium** across all assets
- **Break-even analysis** for collectibles

## 🛠️ Development

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Custom CSS (Tailwind-inspired)
- **API**: GoldAPI.io for silver prices
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

### Build for Production
```bash
npm run build
npm run preview
```

### Project Structure
```
src/
├── App.tsx           # Main application component
├── lib/
│   ├── supabase.ts   # Database configuration
│   └── silverApi.ts  # Silver price API service
├── style.css         # Custom styling
└── main.tsx          # Application entry point
```

## 📱 Features in Detail

### Real-time Updates
- Silver prices update every 30 seconds
- Manual refresh button with loading animation
- Last updated timestamp

### Portfolio Analysis
- Total silver worth (live calculation)
- Total amount invested
- Total silver weight in grams
- Total collector's premiums paid
- Weekly change percentage

### Asset Management
- Add, view, and track individual assets
- Support for coins, bars, and collectibles
- Accurate troy ounce conversions
- Historical purchase data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Supabase Dashboard](https://supabase.com)
- [GoldAPI Documentation](https://goldapi.io/documentation)
- [Vite Documentation](https://vitejs.dev)

---

Made with ❤️ for silver investors 🥈

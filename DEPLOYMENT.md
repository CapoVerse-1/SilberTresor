# 🚀 SilverApp Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env` file in your project root with these exact variable names:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# GoldAPI Configuration  
VITE_SILVER_API_KEY=your-goldapi-key-here
```

### 2. Supabase Setup Steps

1. **Go to [supabase.com](https://supabase.com)**
2. **Create new project**
3. **Get your keys from Settings > API:**
   - **Project URL** → Copy to `VITE_SUPABASE_URL`
   - **Project API Key (anon public)** → Copy to `VITE_SUPABASE_ANON_KEY`

4. **Set up database:**
   - Go to **SQL Editor** in Supabase dashboard
   - Copy entire contents of `database-schema.sql`
   - Paste and run the SQL

### 3. GoldAPI Setup Steps

1. **Go to [goldapi.io](https://goldapi.io)**
2. **Sign up for free account** 
3. **Get API key from dashboard**
4. **Copy to `VITE_SILVER_API_KEY`**

## 🌐 Deploy Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts and add environment variables in Vercel dashboard
```

### Option 2: Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
# Add environment variables in Netlify dashboard
```

### Option 3: Manual Build
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## ⚙️ Important Configuration

### Environment Variables in Production
Make sure to add all three environment variables to your hosting platform:

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY` 
3. `VITE_SILVER_API_KEY`

### Database Migration
Run the SQL from `database-schema.sql` in your Supabase project before going live.

### API Rate Limits
- **GoldAPI Free**: 1,000 requests/month
- **Supabase Free**: 50,000 requests/month

## 🔒 Security Notes

- Never commit `.env` files
- Use environment variables for all API keys
- Supabase anon key is safe for client-side use
- GoldAPI key should be environment variable only

## ✅ Testing Production Build

```bash
npm run build
npm run preview
```

Your SilverApp is now ready for production! 🥈

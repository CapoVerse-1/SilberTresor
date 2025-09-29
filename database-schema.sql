-- Silver Investment Tracking Database Schema
-- Run these SQL commands to create your database structure

-- Table for storing silver assets/investments
CREATE TABLE silver_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    silver_price_at_purchase DECIMAL(8,3) NOT NULL,
    purchase_date DATE NOT NULL,
    silver_weight_oz DECIMAL(10,6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking silver price history (optional)
CREATE TABLE silver_price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_per_oz DECIMAL(8,3) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) DEFAULT 'goldapi',
    exchange VARCHAR(50),
    prev_close_price DECIMAL(8,3),
    open_price DECIMAL(8,3),
    high_price DECIMAL(8,3),
    low_price DECIMAL(8,3)
);

-- Index for faster queries
CREATE INDEX idx_silver_assets_purchase_date ON silver_assets(purchase_date);
CREATE INDEX idx_silver_assets_created_at ON silver_assets(created_at);
CREATE INDEX idx_silver_price_history_timestamp ON silver_price_history(timestamp);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_silver_assets_updated_at 
    BEFORE UPDATE ON silver_assets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample queries you might use:

-- Get all assets with current calculations (you'll need current silver price from your app)
-- SELECT 
--     name,
--     purchase_price,
--     silver_price_at_purchase,
--     purchase_date,
--     silver_weight_oz,
--     (silver_weight_oz * [CURRENT_SILVER_PRICE]) as current_worth,
--     ((silver_weight_oz * [CURRENT_SILVER_PRICE]) - purchase_price) as profit_loss,
--     (purchase_price - (silver_weight_oz * silver_price_at_purchase)) as collectors_premium
-- FROM silver_assets
-- ORDER BY purchase_date DESC;

-- Get total investment summary
-- SELECT 
--     COUNT(*) as total_assets,
--     SUM(purchase_price) as total_invested,
--     SUM(silver_weight_oz) as total_silver_oz,
--     SUM(silver_weight_oz * 31.1035) as total_silver_grams,
--     SUM(purchase_price - (silver_weight_oz * silver_price_at_purchase)) as total_premiums_paid
-- FROM silver_assets;

export type AssetType = 'stock' | 'mf' | 'crypto' | 'etf';

export interface Holding {
  id?: string;
  symbol: string;
  name: string;
  asset_type: AssetType;
  quantity: number;
  avg_buy_price: number;
  current_price?: number;
  portfolio_id?: string;
}

export interface Portfolio {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;        // ← Yeh line add kar do (optional)
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import type { Portfolio } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist' | 'alerts'>('portfolio')
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch Portfolios from Supabase
  useEffect(() => {
    async function fetchPortfolios() {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')

      if (error) console.error('Error fetching portfolios:', error)
      else setPortfolios(data || [])
      
      setLoading(false)
    }

    fetchPortfolios()
  }, [])

  return (
    <div className="w-[460px] min-h-[620px] bg-slate-950 text-slate-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-white">FinTrack</h1>
            <p className="text-emerald-400 text-sm mt-1 font-medium">WEALTH • SIMPLIFIED</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border-b border-slate-700">
        {(['portfolio', 'watchlist', 'alerts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-semibold transition-all
              ${activeTab === tab ? 'border-b-4 border-emerald-400 text-emerald-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            {tab === 'portfolio' ? '📊 Portfolio' : tab === 'watchlist' ? '⭐ Watchlist' : '🛎️ Alerts'}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1">
        {activeTab === 'portfolio' && (
          <div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 mb-6">
              <p className="uppercase text-xs tracking-widest text-slate-400">Total Value</p>
              <p className="text-5xl font-bold mt-2">₹4,28,650</p>
            </div>

            <button 
              onClick={() => alert('Add Portfolio - Next Step')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-semibold mb-6"
            >
              + Create New Portfolio
            </button>

            {loading ? (
              <p>Loading portfolios...</p>
            ) : (
              <div>
                <h3 className="text-slate-300 mb-3">Your Portfolios</h3>
                {portfolios.length === 0 ? (
                  <p className="text-slate-400">No portfolios yet. Create one!</p>
                ) : (
                  portfolios.map(p => (
                    <div key={p.id} className="bg-slate-900 p-4 rounded-2xl mb-3">
                      {p.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

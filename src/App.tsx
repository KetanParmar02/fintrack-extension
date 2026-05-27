import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import type { Portfolio } from './types'

type TabType = 'portfolio' | 'watchlist' | 'alerts'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('portfolio')
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setPortfolios(data || [])
      } catch (err: unknown) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load portfolios')
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  const createSamplePortfolio = async () => {
    try {
      const { error } = await supabase
        .from('portfolios')
        .insert([{
          name: "My Main Portfolio",
          description: "Primary Investment Portfolio for long-term goals"
        }])

      if (error) throw error

      alert("✅ Portfolio Created Successfully!")
      window.location.reload()
    } catch (err: unknown) {
      alert("Error: " + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const toggleTheme = () => setIsDark(!isDark)

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'portfolio', label: 'Portfolio', icon: '📊' },
    { id: 'watchlist', label: 'Watchlist', icon: '⭐' },
    { id: 'alerts', label: 'Alerts', icon: '🛎️' }
  ]

  return (
    <div className={`w-[800px] h-[660px] ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} overflow-hidden flex flex-col shadow-2xl rounded-3xl border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      
      {/* Top Bar */}
      <div className={`h-20 flex items-center px-8 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-md">
            F
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">FinTrack</h1>
            <p className="text-xs opacity-60 -mt-1">Wealth Management</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-6">
          <button onClick={toggleTheme} className="text-2xl hover:scale-110 transition-transform p-2">
            {isDark ? '☀️' : '🌙'}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Ketan Parmar</p>
              <p className="text-xs opacity-60">Gujarat</p>
            </div>
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">KP</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-80 border-r p-6 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white' 
                    : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-10 overflow-auto">
          {activeTab === 'portfolio' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl font-bold">Good morning, Ketan 👋</h2>
                <p className="text-slate-400 mt-1">Here's your portfolio overview</p>
              </div>

              <div className={`rounded-3xl p-12 ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-white border border-slate-200'}`}>
                <p className="uppercase tracking-widest text-sm opacity-70">TOTAL PORTFOLIO VALUE</p>
                <p className="text-7xl font-bold mt-6">₹4,28,650</p>
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-2xl text-base font-medium">↑ ₹12,450 (2.98%)</div>
                  <p className="text-sm opacity-70">Today</p>
                </div>
              </div>

              <button 
                onClick={createSamplePortfolio}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-3xl font-semibold text-xl active:scale-[0.98] transition-all shadow-lg"
              >
                + Create New Portfolio
              </button>

              <div>
                <h3 className="font-semibold text-xl mb-6">Your Portfolios</h3>
                {loading ? (
                  <p className="text-center py-20 text-slate-400">Loading your portfolios...</p>
                ) : error ? (
                  <p className="text-center py-20 text-red-400">Error: {error}</p>
                ) : portfolios.length === 0 ? (
                  <div className="text-center py-20 border border-dashed rounded-3xl">
                    <p className="text-6xl mb-6">📂</p>
                    <p className="text-xl">No portfolios yet</p>
                    <p className="text-sm opacity-60 mt-3">Create your first one above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {portfolios.map((p) => (
                      <div key={p.id} className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white border hover:bg-slate-50'} transition-all`}>
                        <p className="font-semibold text-2xl">{p.name}</p>
                        {p.description && <p className="text-base opacity-70 mt-3 line-clamp-2">{p.description}</p>}
                        <div className="mt-8 text-sm opacity-60">Last updated • Today</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-7xl mb-8">⭐</p>
                <p className="text-3xl font-medium">Watchlist</p>
                <p className="opacity-60 mt-4">Coming Soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-7xl mb-8">🛎️</p>
                <p className="text-3xl font-medium">Price Alerts</p>
                <p className="opacity-60 mt-4">Never miss important movements</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
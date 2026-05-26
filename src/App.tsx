import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist' | 'alerts'>('portfolio')

  return (
    <div className="w-[1000px] min-h-[620px] bg-slate-950 text-slate-200 overflow-hidden flex flex-col">
      {/* Beautiful Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-white">FinTrack</h1>
            <p className="text-emerald-400 text-sm mt-1 font-medium">WEALTH • SIMPLIFIED</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">May 26, 2026</p>
            <p className="text-emerald-400 text-sm font-medium">Market Open</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-900 border-b border-slate-700">
        {(['portfolio', 'watchlist', 'alerts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-semibold transition-all
              ${activeTab === tab 
                ? 'border-b-4 border-emerald-400 text-emerald-400' 
                : 'text-slate-400 hover:text-slate-300'}`}
          >
            {tab === 'portfolio' ? '📊 Portfolio' : 
             tab === 'watchlist' ? '⭐ Watchlist' : '🛎️ Alerts'}
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="p-6 flex-1 space-y-6 overflow-auto">
        {activeTab === 'portfolio' && (
          <>
            {/* Total Value Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl border border-slate-700">
              <p className="uppercase text-xs tracking-widest text-slate-400">Total Portfolio Value</p>
              <p className="text-6xl font-bold text-white mt-3">₹4,28,650</p>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-emerald-400 text-xl">↑ ₹12,450</span>
                <span className="bg-emerald-900 text-emerald-400 px-3 py-1 rounded-full text-sm">+2.98%</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 rounded-2xl p-4 text-center">
                <p className="text-xs text-slate-400">Invested</p>
                <p className="text-xl font-semibold">₹3,85,200</p>
              </div>
              <div className="bg-slate-900 rounded-2xl p-4 text-center">
                <p className="text-xs text-slate-400">Returns</p>
                <p className="text-xl font-semibold text-emerald-400">+11.2%</p>
              </div>
              <div className="bg-slate-900 rounded-2xl p-4 text-center">
                <p className="text-xs text-slate-400">Holdings</p>
                <p className="text-xl font-semibold">12</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-semibold text-lg active:scale-95 transition-all">
                + Add Holding
              </button>
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-semibold text-lg active:scale-95 transition-all">
                📥 Import
              </button>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-slate-300 font-medium mb-4">Recent Holdings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl">
                  <div>
                    <p className="font-medium">Reliance Industries</p>
                    <p className="text-xs text-slate-400">RELIANCE.NS • 8 shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹2,845.60</p>
                    <p className="text-emerald-400 text-xs">+1.8%</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'watchlist' && (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">⭐</p>
            <p className="text-xl text-slate-300">Watchlist</p>
            <p className="text-slate-400 mt-2">Add stocks you want to track</p>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🛎️</p>
            <p className="text-xl text-slate-300">Price Alerts</p>
            <p className="text-slate-400 mt-2">Never miss important price movements</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
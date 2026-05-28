import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Portfolio } from './types'

type TabType = 'portfolio' | 'watchlist' | 'alerts'

const STORAGE_KEY = 'fintrack.portfolios'

const sidebarItems: Array<{
  id: TabType
  label: string
  icon: string
}> = [
  { id: 'portfolio', label: 'Portfolio', icon: '📊' },
  { id: 'watchlist', label: 'Watchlist', icon: '⭐' },
  { id: 'alerts', label: 'Alerts', icon: '🔔' },
]

function readStoredPortfolios(): Portfolio[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as Portfolio[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function mergePortfolios(remote: Portfolio[], local: Portfolio[]) {
  const merged = new Map<string, Portfolio>()

  local.forEach((portfolio) => {
    merged.set(portfolio.id ?? portfolio.name, portfolio)
  })

  remote.forEach((portfolio) => {
    merged.set(portfolio.id ?? portfolio.name, portfolio)
  })

  return Array.from(merged.values())
}

function createTemporaryId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('portfolio')
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => readStoredPortfolios())
  const [loading, setLoading] = useState(true)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios))
    } catch {
      // Ignore storage failures inside the extension popup.
    }
  }, [portfolios])

  async function fetchPortfolios() {
    try {
      setLoading(true)

      const { data, error: fetchError } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setPortfolios((current) => mergePortfolios(data || [], current))
      setSyncMessage('Synced with Supabase')
    } catch (err: unknown) {
      console.error('Fetch error:', err)
      setSyncMessage('Supabase sync unavailable. Showing saved local portfolios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchPortfolios()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const createSamplePortfolio = async () => {
    const tempId = createTemporaryId()
    const nextPortfolio: Portfolio = {
      id: tempId,
      name: `Portfolio ${portfolios.length + 1}`,
      description: 'Starter portfolio',
      currency: 'INR',
      created_at: new Date().toISOString(),
    }

    setIsCreating(true)
    setSyncMessage(null)
    setPortfolios((current) => [nextPortfolio, ...current])

    try {
      const { data, error: insertError } = await supabase
        .from('portfolios')
        .insert([
          {
            name: nextPortfolio.name,
            description: nextPortfolio.description,
            currency: nextPortfolio.currency,
          },
        ])
        .select('*')
        .single()

      if (insertError) throw insertError

      if (data) {
        setPortfolios((current) =>
          current.map((portfolio) => (portfolio.id === tempId ? { ...portfolio, ...data } : portfolio)),
        )
      }

      setSyncMessage('Portfolio saved to Supabase and local cache.')
      void fetchPortfolios()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      console.error('Create error:', err)
      setSyncMessage(`Saved locally only. Supabase rejected the insert: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }

  const toggleSidebar = () => setIsSidebarOpen((current) => !current)

  return (
    <div className="relative h-[580px] w-[420px] min-h-[580px] min-w-[420px] max-w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_38%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] text-white">
      <div
        className={`absolute inset-0 z-10 bg-slate-950/50 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col p-2 sm:p-3">
        <header className="mb-2 flex items-center justify-between rounded-[24px] bg-slate-950/40 px-4 py-3 shadow-[0_12px_30px_rgba(2,6,23,0.25)] backdrop-blur-md">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">FinTrack</p>
            <h2 className="mt-1 text-base font-semibold tracking-tight text-white">Dashboard</h2>
          </div>

          <button
            onClick={toggleSidebar}
            className="rounded-full bg-white/8 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/12"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? 'Close menu' : 'Open menu'}
          </button>
        </header>

        <aside
          className={`absolute left-2 top-2 bottom-2 z-20 flex w-[clamp(14.5rem,80vw,17rem)] flex-col overflow-hidden rounded-[28px] bg-slate-950/95 shadow-[0_24px_60px_rgba(2,6,23,0.55)] ring-1 ring-white/5 backdrop-blur-xl transition-transform duration-300 ease-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+0.75rem)]'
          }`}
        >
          <div className="flex items-center justify-between px-4 pt-4">
            <button
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105"
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              F
            </button>
            <div className="ml-3 flex-1 text-left">
              <p className="text-base font-semibold tracking-tight text-white">FinTrack</p>
              <p className="text-xs text-slate-400">Portfolio tracker</p>
            </div>
          </div>

          <nav className="mt-5 flex-1 space-y-2 px-3">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500/15 text-white ring-1 ring-emerald-400/25'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-3">
            <div className="rounded-[22px] bg-white/5 p-3 ring-1 ring-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Popup mode</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">Compact, fast, and usable on small popup widths.</p>
            </div>
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] bg-slate-950/72 shadow-[0_18px_45px_rgba(2,6,23,0.35)] ring-1 ring-white/5 backdrop-blur-xl">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-start justify-between px-4 pb-3 pt-4 sm:px-5">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Dashboard</p>
                <h2 className="mt-1 text-[clamp(1.1rem,3vw,1.4rem)] font-semibold leading-tight tracking-tight text-white">
                  Good morning, Ketan
                </h2>
              </div>

              <button
                onClick={toggleSidebar}
                className="ml-3 shrink-0 rounded-full bg-white/6 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {isSidebarOpen ? '←' : '→'}
              </button>
            </div>

            <div className="scrollbar-none min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-4 pb-4 sm:px-5">
              {activeTab === 'portfolio' && (
                <>
                  <section className="rounded-[26px] bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.25)] ring-1 ring-emerald-400/15 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">Portfolio overview</p>
                    <p className="mt-2 max-w-[20rem] text-sm leading-6 text-slate-300">
                      A compact view built for the popup, with fast actions and no visual overflow.
                    </p>

                    <div className="mt-4 rounded-[22px] bg-slate-950/65 p-4 ring-1 ring-white/8">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Total portfolio value</p>
                      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-2">
                        <p className="text-[clamp(1.8rem,6vw,2.4rem)] font-semibold leading-none tracking-tight text-white">
                          ₹4,28,650
                        </p>
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                          +2.98%
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">Today: ₹12,450 gain</p>
                    </div>
                  </section>

                  <button
                    onClick={createSamplePortfolio}
                    disabled={isCreating}
                    className="flex w-full items-center justify-center rounded-[22px] bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isCreating ? 'Creating portfolio...' : '+ Create New Portfolio'}
                  </button>

                  {syncMessage && (
                    <div className="rounded-[22px] bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 ring-1 ring-emerald-400/20">
                      <p className="font-medium">Status</p>
                      <p className="mt-1 leading-6">{syncMessage}</p>
                    </div>
                  )}

                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Your portfolios</h3>
                      <span className="text-xs text-slate-500">{portfolios.length} items</span>
                    </div>

                    {loading && (
                      <p className="rounded-[22px] bg-white/5 px-4 py-8 text-center text-sm text-slate-400 ring-1 ring-white/5">
                        Loading portfolios...
                      </p>
                    )}

                    {!loading && portfolios.length === 0 && (
                      <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center">
                        <p className="text-3xl">📂</p>
                        <p className="mt-3 text-sm text-slate-300">No portfolios yet. Create one to begin.</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {portfolios.map((portfolio) => (
                        <article
                          key={portfolio.id ?? portfolio.name}
                          className="rounded-[22px] bg-white/[0.04] p-4 transition hover:bg-white/[0.06] ring-1 ring-white/5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{portfolio.name}</p>
                              {portfolio.description && <p className="mt-1 text-xs leading-5 text-slate-400">{portfolio.description}</p>}
                            </div>
                            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                              {portfolio.currency ?? 'INR'}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'watchlist' && (
                <div className="flex min-h-[18rem] items-center justify-center rounded-[26px] bg-white/[0.04] text-center ring-1 ring-white/5">
                  <div>
                    <p className="text-5xl">⭐</p>
                    <p className="mt-4 text-xl font-semibold">Watchlist</p>
                    <p className="mt-2 text-sm text-slate-400">Coming soon.</p>
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="flex min-h-[18rem] items-center justify-center rounded-[26px] bg-white/[0.04] text-center ring-1 ring-white/5">
                  <div>
                    <p className="text-5xl">🔔</p>
                    <p className="mt-4 text-xl font-semibold">Alerts</p>
                    <p className="mt-2 text-sm text-slate-400">Coming soon.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
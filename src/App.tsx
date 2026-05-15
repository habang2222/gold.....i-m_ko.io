import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronsRight,
  Globe2,
  Landmark,
  LineChart,
  Newspaper,
  Play,
  RefreshCcw,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'
import './App.css'
import { AdSlot } from './components/AdSlot'
import { buildAppContent } from './game/appContent'
import {
  ISA_ANNUAL_LIMIT,
  ISA_TAX_FREE_LIMIT,
  TRANSACTION_TAX_RATE,
  accountEquity,
  advanceDay,
  createInitialGame,
  depositToIsa,
  estimateSell,
  executeTrade,
  formatCompactWon,
  formatMoney,
  formatPercent,
  formatWon,
  getFxRate,
  portfolioValue,
  priceLimits,
  resetGame,
  type AccountType,
  type Company,
  type Exchange,
  type GameState,
  type NewsAgency,
  type NewsItem,
} from './game/market'

const SAVE_KEY = 'jusic-market-sim-v2'
const EXCHANGE_FILTERS: Array<'ALL' | Exchange> = ['ALL', 'KOSPI', 'KOSDAQ', 'NASDAQ', 'NYSE', 'TSE', 'MOTHERS']

function loadGame(): GameState {
  const saved = window.localStorage.getItem(SAVE_KEY)

  if (!saved) return createInitialGame()

  try {
    const parsed = JSON.parse(saved) as Partial<GameState>
    if (!parsed.indices || !parsed.fx || !Array.isArray(parsed.companies) || parsed.companies.length < 40) {
      return createInitialGame()
    }
    return parsed as GameState
  } catch {
    return createInitialGame()
  }
}

function App() {
  const [game, setGame] = useState<GameState>(loadGame)
  const [activeAccount, setActiveAccount] = useState<AccountType>('regular')
  const [quantity, setQuantity] = useState(10)
  const [search, setSearch] = useState('')
  const [exchangeFilter, setExchangeFilter] = useState<'ALL' | Exchange>('ALL')
  const [message, setMessage] = useState('80개 종목 시장이 열렸습니다. 뉴스와 세금 계산기를 같이 보면서 거래해보세요.')

  useEffect(() => {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(game))
  }, [game])

  const selectedCompany = game.companies.find((company) => company.ticker === game.selectedTicker) ?? game.companies[0]
  const account = game.accounts[activeAccount]
  const regularEquity = accountEquity(game.accounts.regular, game.companies, game.fx)
  const isaEquity = accountEquity(game.accounts.isa, game.companies, game.fx)
  const totalEquity = regularEquity + isaEquity
  const invested = portfolioValue(game.accounts.regular, game.companies, game.fx) + portfolioValue(game.accounts.isa, game.companies, game.fx)
  const holding = account.holdings[selectedCompany.ticker]
  const selectedFx = getFxRate(selectedCompany.currency, game.fx)
  const maxBuy = Math.floor(account.cash / Math.max(1, selectedCompany.price * selectedFx * 1.006))
  const maxSell = holding?.quantity ?? 0
  const sellEstimate = estimateSell(game, activeAccount, selectedCompany.ticker, Math.max(1, quantity))
  const content = useMemo(
    () =>
      buildAppContent(
        {
          ...game,
          usdKrw: game.fx.USDKRW,
        },
        activeAccount,
      ),
    [activeAccount, game],
  )
  const rankedCompanies = useMemo(() => {
    const term = search.trim().toLowerCase()

    return [...game.companies]
      .filter((company) => company.alive)
      .filter((company) => exchangeFilter === 'ALL' || company.exchange === exchangeFilter)
      .filter((company) => {
        if (!term) return true
        return `${company.name} ${company.ticker} ${company.sector} ${company.exchange}`.toLowerCase().includes(term)
      })
      .sort((a, b) => Math.abs(b.lastReturn) - Math.abs(a.lastReturn))
      .slice(0, 34)
  }, [exchangeFilter, game.companies, search])
  const sectors = useMemo(() => sectorSummary(game.companies.filter((company) => company.alive)), [game.companies])
  const activeNews = game.news.slice(0, 14)

  function selectTicker(ticker: string) {
    setGame((current) => ({ ...current, selectedTicker: ticker }))
  }

  function runDays(days: number) {
    setGame((current) => {
      let next = current

      for (let index = 0; index < days; index += 1) {
        next = advanceDay(next)
      }

      return next
    })
    setMessage(`${days}거래일이 진행됐습니다. 뉴스사 예측도 함께 채점됐습니다.`)
  }

  function trade(side: 'buy' | 'sell') {
    const result = executeTrade(game, activeAccount, side, selectedCompany.ticker, quantity)

    setGame(result.state)
    setMessage(result.message)
  }

  function transferIsa(amount: number) {
    const result = depositToIsa(game, amount)

    setGame(result.state)
    setMessage(result.message)
  }

  function reset() {
    const next = resetGame()

    setGame(next)
    setQuantity(10)
    setActiveAccount('regular')
    setSearch('')
    setExchangeFilter('ALL')
    setMessage('게임이 초기화되었습니다.')
  }

  return (
    <main className="game-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">
            <LineChart size={24} />
          </div>
          <div>
            <p className="eyebrow">가상 멀티마켓 시뮬레이터</p>
            <h1>Jusic Market</h1>
          </div>
        </div>

        <div className="market-clock" aria-label="시장 현황">
          <div>
            <CalendarDays size={16} />
            <span>{game.date}</span>
          </div>
          <div className={game.mood >= 0 ? 'up' : 'down'}>
            <Activity size={16} />
            <span>심리 {formatPercent(game.mood)}</span>
          </div>
          <div>
            <Banknote size={16} />
            <span>USD {game.fx.USDKRW.toLocaleString('ko-KR')}</span>
          </div>
          <div>
            <Globe2 size={16} />
            <span>JPY {game.fx.JPYKRW.toFixed(2)}</span>
          </div>
        </div>

        <div className="turn-controls">
          <button type="button" className="icon-button" title="1거래일 진행" onClick={() => runDays(1)}>
            <Play size={18} />
          </button>
          <button type="button" className="icon-button wide" title="5거래일 진행" onClick={() => runDays(5)}>
            <ChevronsRight size={18} />
            <span>5D</span>
          </button>
          <button type="button" className="icon-button ghost" title="초기화" onClick={reset}>
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      <AdSlot placement="top" label="시장 브리핑 스폰서" />

      <section className="portfolio-strip" aria-label="계좌 요약">
        <Metric label="총 평가자산" value={formatWon(totalEquity)} icon={<Wallet size={18} />} />
        <Metric label="주식 평가액" value={formatWon(invested)} icon={<BriefcaseBusiness size={18} />} />
        <Metric label="KOSPI/KOSDAQ" value={`${game.indices.kospi.toLocaleString('ko-KR')} / ${game.indices.kosdaq.toLocaleString('ko-KR')}`} icon={<Landmark size={18} />} />
        <Metric label="NASDAQ/NIKKEI" value={`${game.indices.nasdaq.toLocaleString('ko-KR')} / ${game.indices.nikkei.toLocaleString('ko-KR')}`} icon={<BarChart3 size={18} />} />
      </section>

      <section className="dashboard-grid">
        <section className="exchange-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">80개 상장사</p>
              <h2>멀티마켓 보드</h2>
            </div>
            <span className="tax-pill">국내 매도세 {(TRANSACTION_TAX_RATE * 100).toFixed(2)}%</span>
          </div>

          <label className="search-box">
            <Search size={16} />
            <input value={search} placeholder="종목, 섹터, 거래소 검색" onChange={(event) => setSearch(event.target.value)} />
          </label>

          <div className="exchange-tabs">
            {EXCHANGE_FILTERS.map((exchange) => (
              <button
                type="button"
                key={exchange}
                className={exchangeFilter === exchange ? 'active' : ''}
                onClick={() => setExchangeFilter(exchange)}
              >
                {exchange === 'ALL' ? '전체' : exchange}
              </button>
            ))}
          </div>

          <div className="market-table">
            <div className="table-row table-head">
              <span>종목</span>
              <span>가격</span>
              <span>등락</span>
              <span>상태</span>
            </div>
            {rankedCompanies.map((company) => (
              <button
                type="button"
                className={`table-row stock-row ${company.ticker === selectedCompany.ticker ? 'selected' : ''}`}
                key={company.ticker}
                onClick={() => selectTicker(company.ticker)}
              >
                <span>
                  <strong>{company.name}</strong>
                  <small>
                    {company.ticker} · {company.exchange} · {company.sector}
                  </small>
                </span>
                <span>
                  {formatMoney(company.price, company.currency)}
                  <small className="krw-value">{company.currency === 'KRW' ? '' : formatWon(company.price * getFxRate(company.currency, game.fx))}</small>
                </span>
                <span className={company.lastReturn >= 0 ? 'up' : 'down'}>{formatPercent(company.lastReturn)}</span>
                <span className={`status ${statusClass(company.status)}`}>{company.status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="focus-panel panel">
          <div className="focus-header">
            <CompanyBadge company={selectedCompany} />
            <div className="price-stack">
              <span>{formatMoney(selectedCompany.price, selectedCompany.currency)}</span>
              <small>{selectedCompany.currency === 'KRW' ? '원화 종목' : `원화환산 ${formatWon(selectedCompany.price * selectedFx)}`}</small>
              <strong className={selectedCompany.lastReturn >= 0 ? 'up' : 'down'}>
                {selectedCompany.lastReturn >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                {formatPercent(selectedCompany.lastReturn)}
              </strong>
            </div>
          </div>

          <Sparkline company={selectedCompany} />

          <div className="fundamental-grid">
            <MiniStat label="매출 체력" value={`${selectedCompany.revenue.toFixed(2)}조`} />
            <MiniStat label="영업마진" value={`${(selectedCompany.margin * 100).toFixed(1)}%`} />
            <MiniStat label="부채비율" value={`${(selectedCompany.debtRatio * 100).toFixed(0)}%`} />
            <MiniStat label="위험단계" value={`${selectedCompany.distress}/5`} />
          </div>

          <div className={`operation-card ${selectedCompany.distress >= 4 ? 'danger' : ''}`}>
            <div>
              <p className="eyebrow">오늘의 회사 업무</p>
              <strong>{selectedCompany.operation}</strong>
            </div>
            <p>{selectedCompany.description}</p>
          </div>

          <div className="relation-list">
            <p className="eyebrow">미세 상호작용</p>
            {selectedCompany.relations.slice(0, 7).map((relation) => {
              const related = game.companies.find((company) => company.ticker === relation.ticker)

              return (
                <button type="button" key={relation.ticker} onClick={() => selectTicker(relation.ticker)}>
                  <span>{related?.name ?? relation.ticker}</span>
                  <small>{relation.reason}</small>
                  <strong className={relation.weight >= 0 ? 'up' : 'down'}>{Math.round(relation.weight * 100)}%</strong>
                </button>
              )
            })}
          </div>
        </section>

        <aside className="trade-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">주문과 계산기</p>
              <h2>계좌</h2>
            </div>
            <Scale size={20} />
          </div>

          <div className="account-tabs">
            <button type="button" className={activeAccount === 'regular' ? 'active' : ''} onClick={() => setActiveAccount('regular')}>
              일반
            </button>
            <button type="button" className={activeAccount === 'isa' ? 'active' : ''} onClick={() => setActiveAccount('isa')}>
              ISA
            </button>
          </div>

          <div className="cash-box">
            <span>주문 가능</span>
            <strong>{formatWon(account.cash)}</strong>
            <small>보유 {holding ? `${holding.quantity.toLocaleString('ko-KR')}주` : '0주'}</small>
          </div>

          <label className="quantity-input">
            <span>수량</span>
            <input value={quantity} type="number" min="1" onChange={(event) => setQuantity(Number(event.target.value))} />
          </label>

          <div className="quick-buttons">
            <button type="button" onClick={() => setQuantity(Math.max(1, Math.floor(maxBuy * 0.25)))}>
              25%
            </button>
            <button type="button" onClick={() => setQuantity(Math.max(1, Math.floor(maxBuy * 0.5)))}>
              50%
            </button>
            <button type="button" onClick={() => setQuantity(Math.max(1, maxBuy))}>
              매수최대
            </button>
            <button type="button" onClick={() => setQuantity(Math.max(1, maxSell))}>
              매도최대
            </button>
          </div>

          <div className="order-buttons">
            <button type="button" className="buy" onClick={() => trade('buy')}>
              <ArrowUpRight size={18} />
              매수
            </button>
            <button type="button" className="sell" onClick={() => trade('sell')}>
              <ArrowDownRight size={18} />
              매도
            </button>
          </div>

          <p className={`trade-message ${message.includes('부족') || message.includes('초과') ? 'warning' : ''}`}>{message}</p>

          <div className="calculator-box">
            <div className="calc-heading">
              <Banknote size={18} />
              <span>매도 세금 미리보기</span>
            </div>
            <CalcRow label="예상 매도금액" value={formatWon(sellEstimate.grossKrw)} />
            <CalcRow label="세금+수수료" value={formatWon(sellEstimate.totalTaxAndFees)} />
            <CalcRow label="실수령액" value={formatWon(sellEstimate.netKrw)} />
            <CalcRow label="환율 적용" value={`${sellEstimate.fxRate.toLocaleString('ko-KR')}원`} />
          </div>

          <div className="isa-box">
            <div>
              <ShieldCheck size={18} />
              <span>ISA 납입</span>
            </div>
            <strong>
              {formatCompactWon(game.accounts.isa.isaContribution)} / {formatCompactWon(ISA_ANNUAL_LIMIT)}
            </strong>
            <button type="button" onClick={() => transferIsa(1_000_000)}>
              100만원 입금
            </button>
          </div>

          <AdSlot placement="side" label="투자 도구 스폰서" />
        </aside>

        <section className="news-panel panel large-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">뉴스사마다 관점이 다름</p>
              <h2>뉴스 테이프</h2>
            </div>
            <Newspaper size={20} />
          </div>
          <div className="agency-row">
            {game.agencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
          <div className="news-list">
            {activeNews.map((item) => (
              <NewsRow key={item.id} item={item} />
            ))}
          </div>
          <AdSlot placement="news" label="뉴스 테이프 스폰서" />
        </section>

        <section className="sector-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">시장 맵</p>
              <h2>섹터 열지도</h2>
            </div>
            <Sparkles size={20} />
          </div>
          <div className="sector-map">
            {sectors.map((sector) => (
              <button
                type="button"
                key={sector.name}
                className={sector.change >= 0 ? 'positive' : 'negative'}
                style={{ '--size': `${Math.max(32, Math.min(100, sector.weight))}%` } as CSSProperties}
              >
                <span>{sector.name}</span>
                <strong>{formatPercent(sector.change)}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="content-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">주식 앱 콘텐츠</p>
              <h2>도구와 미션</h2>
            </div>
            <Bell size={20} />
          </div>
          <div className="tool-grid">
            {content.toolCards.map((card) => (
              <article key={card.id} className={`tool-card ${card.tone}`}>
                <small>{card.eyebrow}</small>
                <strong>{card.title}</strong>
                <p>{card.description}</p>
                <span>
                  {card.metricLabel}: {card.metricValue}
                </span>
              </article>
            ))}
          </div>
          <div className="alert-list">
            {content.alerts.slice(0, 4).map((alert) => (
              <article key={alert.id} className={`alert-row ${alert.tone}`}>
                <strong>{alert.title}</strong>
                <p>{alert.detail}</p>
                <span>{alert.valueLabel}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="rules-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">제도와 이벤트</p>
              <h2>계산 포인트</h2>
            </div>
            <Building2 size={20} />
          </div>
          <div className="rules-grid">
            <MiniStat label="국내 가격제한폭" value="±30%" />
            <MiniStat label="외국주식 양도세" value="250만원 공제" />
            <MiniStat label="매도 거래세" value="0.20%" />
            <MiniStat label="ISA 비과세 한도" value={formatCompactWon(ISA_TAX_FREE_LIMIT)} />
          </div>
          <div className="limit-box">
            <span>
              {selectedCompany.name} 상한 {formatMoney(priceLimits(selectedCompany.prevClose, selectedCompany.exchange).upper, selectedCompany.currency)}
            </span>
            <span>
              하한 {formatMoney(priceLimits(selectedCompany.prevClose, selectedCompany.exchange).lower, selectedCompany.currency)}
            </span>
          </div>
          <div className="calendar-list">
            {content.calendar.slice(0, 3).map((event) => (
              <article key={event.id}>
                <span>{event.dDayLabel}</span>
                <strong>{event.title}</strong>
                <p>{event.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

function Metric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="metric">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-stat">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  )
}

function CalcRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="calc-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function CompanyBadge({ company }: { company: Company }) {
  return (
    <div className="company-badge">
      <div className="ticker-mark">{company.ticker.slice(0, 2)}</div>
      <div>
        <p className="eyebrow">
          {company.exchange} · {company.sector} · {company.size === 'large' ? '대형' : '중소형'}
        </p>
        <h2>{company.name}</h2>
      </div>
    </div>
  )
}

function Sparkline({ company }: { company: Company }) {
  const width = 640
  const height = 184
  const prices = company.history.length > 1 ? company.history : [company.price, company.price]
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = Math.max(1, max - min)
  const points = prices
    .map((price, index) => {
      const x = (index / Math.max(1, prices.length - 1)) * width
      const y = height - ((price - min) / range) * (height - 22) - 11

      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const lastUp = prices[prices.length - 1] >= prices[0]

  return (
    <div className="chart-wrap" aria-label={`${company.name} 가격 차트`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={lastUp ? '#1fa971' : '#d84d4d'} stopOpacity="0.34" />
            <stop offset="100%" stopColor={lastUp ? '#1fa971' : '#d84d4d'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,${height} L${points.replaceAll(' ', ' L')} L${width},${height} Z`} fill="url(#chartFill)" />
        <polyline points={points} fill="none" stroke={lastUp ? '#1fa971' : '#d84d4d'} strokeWidth="4" />
      </svg>
    </div>
  )
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <article className={`news-row ${item.tone}`}>
      <div>
        <span>
          {item.date} · {item.source}
        </span>
        <strong>{item.title}</strong>
      </div>
      <p>{item.detail}</p>
    </article>
  )
}

function AgencyCard({ agency }: { agency: NewsAgency }) {
  return (
    <article className="agency-card">
      <span>{agency.name}</span>
      <strong>{Math.round(agency.reliability * 100)}%</strong>
      <small>
        정확도 {Math.round(agency.accuracy * 100)} · 오보 {agency.misses}
      </small>
    </article>
  )
}

function sectorSummary(companies: Company[]) {
  const buckets = new Map<string, { change: number; cap: number }>()

  for (const company of companies) {
    const cap = company.price * company.shares
    const bucket = buckets.get(company.sector) ?? { change: 0, cap: 0 }
    bucket.change += company.lastReturn * cap
    bucket.cap += cap
    buckets.set(company.sector, bucket)
  }

  const maxCap = Math.max(...[...buckets.values()].map((bucket) => bucket.cap), 1)

  return [...buckets.entries()]
    .map(([name, bucket]) => ({
      name,
      change: bucket.change / Math.max(1, bucket.cap),
      weight: (bucket.cap / Math.max(1, maxCap)) * 100,
    }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 12)
}

function statusClass(status: string) {
  if (status.includes('상한') || status.includes('구제')) return 'hot'
  if (status.includes('하한') || status.includes('주의') || status.includes('비상') || status.includes('폐지')) return 'risk'
  if (status.includes('VI') || status.includes('관리') || status.includes('신규')) return 'watch'
  return ''
}

export default App

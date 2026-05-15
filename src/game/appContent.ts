const DIVIDEND_TAX_RATE = 0.154
const ISA_ANNUAL_LIMIT = 20_000_000
const ISA_LOW_TAX_RATE = 0.099
const ISA_TAX_FREE_LIMIT = 2_000_000
const TRANSACTION_TAX_RATE = 0.002

import type { AccountType, Sector } from './market'

export interface AppContentHolding {
  quantity: number
  avgPrice: number
}

export interface AppContentAccount {
  cash: number
  holdings: Record<string, AppContentHolding>
  isaContribution: number
  isaTaxableProfit: number
}

export interface AppContentCompany {
  ticker: string
  name: string
  sector: Sector
  price: number
  shares: number
  beta: number
  revenue: number
  margin: number
  backlog: number
  debtRatio: number
  quality: number
  sentiment: number
  dividendYield: number
  lastReturn: number
  dayVolume: number
  status: string
  operation: string
}

export interface AppContentGameState {
  day: number
  companies: AppContentCompany[]
  accounts: Record<AccountType, AppContentAccount>
  selectedTicker: string
  mood: number
  policyRate: number
  usdKrw: number
  marketHaltRisk: number
}

export type ContentTone = 'good' | 'bad' | 'neutral' | 'watch' | 'risk' | 'limit'
export type ContentAccent = 'green' | 'red' | 'blue' | 'amber' | 'violet' | 'slate'
export type ContentIconName =
  | 'Activity'
  | 'Banknote'
  | 'BarChart3'
  | 'Bell'
  | 'BriefcaseBusiness'
  | 'CalendarDays'
  | 'LineChart'
  | 'Scale'
  | 'Search'
  | 'ShieldCheck'
  | 'Sparkles'
  | 'Wallet'

export interface WatchlistTemplate {
  id: string
  title: string
  subtitle: string
  icon: ContentIconName
  accent: ContentAccent
  tickers: string[]
  signal: string
  rules: string[]
}

export interface WatchlistStock {
  ticker: string
  name: string
  sector: Sector
  priceLabel: string
  changeLabel: string
  tone: ContentTone
  score: number
  reason: string
}

export interface WatchlistContent extends WatchlistTemplate {
  stocks: WatchlistStock[]
}

export type ScreenerMetric =
  | 'backlog'
  | 'beta'
  | 'debtRatio'
  | 'dividendYield'
  | 'dayVolume'
  | 'lastReturn'
  | 'margin'
  | 'marketCap'
  | 'price'
  | 'quality'
  | 'revenue'
  | 'sentiment'

export type ScreenerOperator = 'gte' | 'lte' | 'between'

export interface ScreenerCondition {
  metric: ScreenerMetric
  operator: ScreenerOperator
  value: number
  max?: number
  label: string
}

export interface ScreenerPreset {
  id: string
  title: string
  subtitle: string
  icon: ContentIconName
  accent: ContentAccent
  conditions: ScreenerCondition[]
  sortBy: ScreenerMetric
  sortDirection: 'asc' | 'desc'
  emptyLabel: string
}

export interface ScreenerResult {
  ticker: string
  name: string
  sector: Sector
  score: number
  primaryValue: string
  highlights: string[]
}

export type AlertSource = 'market' | 'selectedCompany' | 'anyCompany' | 'portfolio'

export interface AlertRule {
  id: string
  title: string
  detail: string
  icon: ContentIconName
  tone: ContentTone
  source: AlertSource
  metric: ScreenerMetric | 'cashRatio' | 'marketHaltRisk' | 'mood' | 'policyRate' | 'usdKrw'
  operator: ScreenerOperator
  value: number
  max?: number
  actionLabel: string
}

export interface TriggeredAlert extends AlertRule {
  valueLabel: string
  targetLabel: string
  tickers: string[]
}

export type MissionCriterionKind =
  | 'cashRatio'
  | 'holdingCount'
  | 'isaContribution'
  | 'positiveHoldingRatio'
  | 'sectorCount'
  | 'watchlistCoverage'

export interface MissionCriterion {
  kind: MissionCriterionKind
  label: string
  target: number
}

export interface AnalystMission {
  id: string
  title: string
  brief: string
  icon: ContentIconName
  accent: ContentAccent
  rewardLabel: string
  criteria: MissionCriterion[]
}

export interface MissionStatus extends AnalystMission {
  progress: number
  completed: boolean
  checklist: Array<{
    label: string
    currentLabel: string
    progress: number
    completed: boolean
  }>
}

export interface MarketCalendarEvent {
  id: string
  day: number
  date: string
  title: string
  detail: string
  category: '거시' | '기업' | '정책' | '결산' | '테마'
  importance: '보통' | '중요' | '매우 중요'
  icon: ContentIconName
  relatedSectors: Sector[]
  checklist: string[]
}

export interface UpcomingMarketEvent extends MarketCalendarEvent {
  dDayLabel: string
  tone: ContentTone
}

export interface CalculatorField {
  id: string
  label: string
  placeholder: string
  helper: string
}

export interface CalculatorSection {
  title: string
  subtitle: string
  fields: CalculatorField[]
  resultTitle: string
}

export interface CalculatorRow {
  id: string
  label: string
  value: string
  helper: string
  tone: ContentTone
}

export type RiskMetric = 'cashBuffer' | 'concentration' | 'drawdown' | 'fxExposure' | 'weightedBeta'

export interface RiskBadgeRule {
  id: RiskMetric
  title: string
  icon: ContentIconName
  goodLabel: string
  watchLabel: string
  riskLabel: string
  actionLabel: string
}

export interface PortfolioRiskBadge {
  id: RiskMetric
  title: string
  levelLabel: string
  valueLabel: string
  detail: string
  tone: ContentTone
  icon: ContentIconName
  actionLabel: string
}

export type ToolCardMetric =
  | 'alertCount'
  | 'calendarNext'
  | 'fxRate'
  | 'missionProgress'
  | 'riskCount'
  | 'screenerCount'
  | 'taxRate'
  | 'watchlistCount'

export interface ToolCardTemplate {
  id: string
  eyebrow: string
  title: string
  description: string
  icon: ContentIconName
  accent: ContentAccent
  actionLabel: string
  metric: ToolCardMetric
}

export interface AppToolCard extends ToolCardTemplate {
  metricLabel: string
  metricValue: string
  tone: ContentTone
}

export interface AppContentBundle {
  watchlists: WatchlistContent[]
  screenerPresets: ScreenerPreset[]
  alerts: TriggeredAlert[]
  missions: MissionStatus[]
  calendar: UpcomingMarketEvent[]
  calculator: {
    labels: typeof TAX_FX_CALCULATOR_LABELS
    taxRows: CalculatorRow[]
    fxRows: CalculatorRow[]
  }
  riskBadges: PortfolioRiskBadge[]
  toolCards: AppToolCard[]
}

export const WATCHLISTS: WatchlistTemplate[] = [
  {
    id: 'ai-supply-chain',
    title: 'AI 공급망',
    subtitle: '반도체, 검사장비, 클라우드 수요를 한 번에 추적',
    icon: 'LineChart',
    accent: 'blue',
    tickers: ['HBM', 'SEN', 'NEM', 'GUM'],
    signal: '수주잔고와 마진이 동시에 올라가는 종목 우선',
    rules: ['HBM 증설 뉴스', '검사장비 고객 승인', '특수가스 단가', 'AI 서버 투자 심리'],
  },
  {
    id: 'ev-battery',
    title: '전기차 밸류체인',
    subtitle: '완성차, 배터리, 소재, ESS 흐름을 묶어서 확인',
    icon: 'Activity',
    accent: 'green',
    tickers: ['AUR', 'PUR', 'NEM', 'HSO'],
    signal: '환율 상승과 원재료 가격이 마진을 얼마나 누르는지 체크',
    rules: ['EV 출하량', '전해질 단가', 'ESS 프로젝트', '수율 개선'],
  },
  {
    id: 'defense-cashflow',
    title: '방어형 현금흐름',
    subtitle: '배당, 프로젝트 금융, 장기 수주를 보는 안정형 묶음',
    icon: 'ShieldCheck',
    accent: 'slate',
    tickers: ['FIN', 'SEA', 'HSO', 'AUR'],
    signal: '부채비율이 낮고 배당수익률이 유지되는 종목에 가점',
    rules: ['금리 방향', '선수금 보증', '해상풍력 일정', '배당락'],
  },
  {
    id: 'high-beta-growth',
    title: '고베타 성장주',
    subtitle: '급등락이 큰 코스닥 성장주와 테마 장세 감시',
    icon: 'Sparkles',
    accent: 'violet',
    tickers: ['SEN', 'GUM', 'BIO', 'PIX'],
    signal: 'VI 가능성과 투자주의 상태를 반드시 같이 보기',
    rules: ['거래량 급증', '임상 결과', '콘텐츠 흥행', 'AI 제작툴 계약'],
  },
]

export const SCREENER_PRESETS: ScreenerPreset[] = [
  {
    id: 'quality-growth',
    title: '퀄리티 성장',
    subtitle: '마진과 체력이 좋은 성장주',
    icon: 'Search',
    accent: 'blue',
    conditions: [
      { metric: 'quality', operator: 'gte', value: 0.54, label: '품질 점수 54점 이상' },
      { metric: 'margin', operator: 'gte', value: 0.12, label: '영업마진 12% 이상' },
      { metric: 'backlog', operator: 'gte', value: 1, label: '수주잔고 1.0배 이상' },
    ],
    sortBy: 'quality',
    sortDirection: 'desc',
    emptyLabel: '조건을 만족하는 퀄리티 성장주가 없습니다.',
  },
  {
    id: 'turnaround-watch',
    title: '반등 대기',
    subtitle: '가격은 눌렸지만 심리와 체력이 남아 있는 후보',
    icon: 'BarChart3',
    accent: 'amber',
    conditions: [
      { metric: 'lastReturn', operator: 'lte', value: -0.015, label: '오늘 하락' },
      { metric: 'sentiment', operator: 'gte', value: -0.08, label: '심리 훼손 제한적' },
      { metric: 'debtRatio', operator: 'lte', value: 0.85, label: '부채비율 85% 이하' },
    ],
    sortBy: 'lastReturn',
    sortDirection: 'asc',
    emptyLabel: '지금은 뚜렷한 반등 대기 종목이 없습니다.',
  },
  {
    id: 'dividend-defense',
    title: '배당 방어',
    subtitle: '현금흐름과 배당수익률로 변동성 완충',
    icon: 'Wallet',
    accent: 'green',
    conditions: [
      { metric: 'dividendYield', operator: 'gte', value: 0.012, label: '배당수익률 1.2% 이상' },
      { metric: 'beta', operator: 'lte', value: 1.05, label: '베타 1.05 이하' },
      { metric: 'debtRatio', operator: 'lte', value: 0.7, label: '부채비율 70% 이하' },
    ],
    sortBy: 'dividendYield',
    sortDirection: 'desc',
    emptyLabel: '배당 방어 조건을 만족하는 종목이 없습니다.',
  },
  {
    id: 'theme-heat',
    title: '테마 과열',
    subtitle: '급등, 거래대금, 심리 과열을 빠르게 분리',
    icon: 'Bell',
    accent: 'red',
    conditions: [
      { metric: 'lastReturn', operator: 'gte', value: 0.045, label: '당일 +4.5% 이상' },
      { metric: 'dayVolume', operator: 'gte', value: 80_000_000, label: '거래대금 8천만 이상' },
    ],
    sortBy: 'lastReturn',
    sortDirection: 'desc',
    emptyLabel: '아직 과열로 볼 만한 테마가 없습니다.',
  },
]

export const ALERT_RULES: AlertRule[] = [
  {
    id: 'market-mood-risk',
    title: '시장 심리 냉각',
    detail: '심리 지수가 빠르게 식으면 고베타 종목 비중을 먼저 줄여보세요.',
    icon: 'Activity',
    tone: 'risk',
    source: 'market',
    metric: 'mood',
    operator: 'lte',
    value: -0.035,
    actionLabel: '방어 점검',
  },
  {
    id: 'fx-pressure',
    title: '환율 압박',
    detail: 'USD/KRW 상승은 수입 원재료 비중이 큰 종목의 마진을 흔들 수 있습니다.',
    icon: 'Banknote',
    tone: 'watch',
    source: 'market',
    metric: 'usdKrw',
    operator: 'gte',
    value: 1400,
    actionLabel: '환율 계산',
  },
  {
    id: 'halt-watch',
    title: '시장경보 확률 상승',
    detail: '급등락 종목이 늘면 VI와 투자주의 상태를 같이 확인하세요.',
    icon: 'Bell',
    tone: 'risk',
    source: 'market',
    metric: 'marketHaltRisk',
    operator: 'gte',
    value: 0.07,
    actionLabel: '경보 보기',
  },
  {
    id: 'selected-breakout',
    title: '선택 종목 급등',
    detail: '추격 매수 전 상한가까지 남은 폭과 거래대금을 확인하세요.',
    icon: 'LineChart',
    tone: 'good',
    source: 'selectedCompany',
    metric: 'lastReturn',
    operator: 'gte',
    value: 0.08,
    actionLabel: '가격제한폭 확인',
  },
  {
    id: 'selected-drawdown',
    title: '선택 종목 급락',
    detail: '하락이 커질수록 평균단가보다 손실 제한 규칙을 먼저 보세요.',
    icon: 'Scale',
    tone: 'bad',
    source: 'selectedCompany',
    metric: 'lastReturn',
    operator: 'lte',
    value: -0.06,
    actionLabel: '손실 점검',
  },
  {
    id: 'portfolio-cash-low',
    title: '현금 버퍼 부족',
    detail: '현금 비중이 낮으면 다음 거래일 변동성에 대응할 여지가 작아집니다.',
    icon: 'Wallet',
    tone: 'watch',
    source: 'portfolio',
    metric: 'cashRatio',
    operator: 'lte',
    value: 0.08,
    actionLabel: '현금 확보',
  },
  {
    id: 'any-limit-move',
    title: '급등락 종목 발생',
    detail: '상한가, 하한가, VI 후보는 뉴스와 연관주를 같이 확인하세요.',
    icon: 'Sparkles',
    tone: 'limit',
    source: 'anyCompany',
    metric: 'lastReturn',
    operator: 'between',
    value: 0.12,
    max: 1,
    actionLabel: '테마 추적',
  },
]

export const ANALYST_MISSIONS: AnalystMission[] = [
  {
    id: 'first-diversification',
    title: '초보 애널리스트: 분산 장부',
    brief: '한 종목 승부보다 여러 섹터를 담아 변동성을 줄입니다.',
    icon: 'BriefcaseBusiness',
    accent: 'blue',
    rewardLabel: '리서치 점수 +120',
    criteria: [
      { kind: 'holdingCount', label: '보유 종목 3개 이상', target: 3 },
      { kind: 'sectorCount', label: '보유 섹터 3개 이상', target: 3 },
    ],
  },
  {
    id: 'isa-starter',
    title: '세제 계좌 세팅',
    brief: 'ISA 납입을 시작하고 세후 수익률 관점으로 포트폴리오를 봅니다.',
    icon: 'ShieldCheck',
    accent: 'green',
    rewardLabel: '세금 이해도 +1',
    criteria: [
      { kind: 'isaContribution', label: 'ISA 100만원 이상 납입', target: 1_000_000 },
      { kind: 'cashRatio', label: '현금 비중 10% 이상 유지', target: 0.1 },
    ],
  },
  {
    id: 'watchlist-builder',
    title: '관심종목 큐레이터',
    brief: '테마별 종목을 충분히 훑고 매수 후보를 좁힙니다.',
    icon: 'Search',
    accent: 'violet',
    rewardLabel: '관찰 슬롯 +2',
    criteria: [
      { kind: 'watchlistCoverage', label: '관심 테마 종목 5개 이상 보유 또는 추적', target: 5 },
      { kind: 'positiveHoldingRatio', label: '수익권 보유 비율 50% 이상', target: 0.5 },
    ],
  },
  {
    id: 'risk-manager',
    title: '리스크 매니저',
    brief: '큰 기회보다 먼저 살아남는 계좌 구조를 만듭니다.',
    icon: 'Scale',
    accent: 'amber',
    rewardLabel: '리스크 배지 해금',
    criteria: [
      { kind: 'cashRatio', label: '현금 비중 15% 이상', target: 0.15 },
      { kind: 'sectorCount', label: '섹터 4개 이상 분산', target: 4 },
    ],
  },
]

export const MARKET_CALENDAR: MarketCalendarEvent[] = [
  {
    id: 'opening-week',
    day: 0,
    date: '2026-05-18',
    title: '시뮬레이션 개장',
    detail: '첫 거래일에는 종목별 기준가와 섹터 민감도를 확인하는 것이 핵심입니다.',
    category: '기업',
    importance: '보통',
    icon: 'CalendarDays',
    relatedSectors: ['반도체', '자동차', '금융'],
    checklist: ['관심종목 선택', '계좌 유형 확인', '가격제한폭 확인'],
  },
  {
    id: 'boks-rate-minutes',
    day: 2,
    date: '2026-05-20',
    title: '한국은행 의사록 공개',
    detail: '금리 문구 변화는 금융, 성장주, 배당주의 밸류에이션에 영향을 줍니다.',
    category: '거시',
    importance: '중요',
    icon: 'Banknote',
    relatedSectors: ['금융', 'AI소프트웨어', '바이오'],
    checklist: ['정책금리 확인', '성장주 베타 점검', '배당 방어 후보 확인'],
  },
  {
    id: 'chip-export-data',
    day: 4,
    date: '2026-05-22',
    title: '반도체 잠정 수출 데이터',
    detail: 'AI 서버용 메모리와 소재주의 수주 기대가 같이 움직일 수 있습니다.',
    category: '테마',
    importance: '매우 중요',
    icon: 'LineChart',
    relatedSectors: ['반도체', '소재', 'AI소프트웨어'],
    checklist: ['HBM 가격 반응', '네온소재 연관주', '검사장비 거래대금'],
  },
  {
    id: 'ev-subsidy-plan',
    day: 6,
    date: '2026-05-26',
    title: '전기차 보조금 개편안',
    detail: '완성차 판매와 배터리 수익성 기대가 동시에 재평가됩니다.',
    category: '정책',
    importance: '중요',
    icon: 'Activity',
    relatedSectors: ['자동차', '배터리', '소재'],
    checklist: ['완성차 주문잔고', '배터리 마진', '환율 민감도'],
  },
  {
    id: 'game-launch-index',
    day: 8,
    date: '2026-05-28',
    title: '신작 게임 사전예약 지표',
    detail: '콘텐츠 흥행 기대가 게임콘텐츠와 AI 제작툴 관련주를 흔듭니다.',
    category: '기업',
    importance: '보통',
    icon: 'Sparkles',
    relatedSectors: ['게임콘텐츠', 'AI소프트웨어'],
    checklist: ['픽셀엔터 거래량', '구름소프트 연관주', '급등락 경보'],
  },
  {
    id: 'quarterly-close',
    day: 12,
    date: '2026-06-03',
    title: '분기 실적 프리뷰',
    detail: '마진과 부채비율이 나쁜 종목은 기대감보다 숫자가 먼저 압박합니다.',
    category: '결산',
    importance: '매우 중요',
    icon: 'BarChart3',
    relatedSectors: ['반도체', '배터리', '조선방산', '금융'],
    checklist: ['영업마진 상위 종목', '부채비율 점검', '배당수익률 비교'],
  },
]

export const TAX_FX_CALCULATOR_LABELS = {
  tax: {
    title: '세금 미리보기',
    subtitle: '매도 거래세와 배당 과세를 계좌별로 비교합니다.',
    resultTitle: '예상 세후 금액',
    fields: [
      {
        id: 'account',
        label: '계좌',
        placeholder: '일반 / ISA',
        helper: 'ISA는 비과세 한도와 저율과세 구간을 따로 봅니다.',
      },
      {
        id: 'sellAmount',
        label: '매도금액',
        placeholder: '예: 1,000,000',
        helper: '거래세는 매도금액 기준으로 계산합니다.',
      },
      {
        id: 'profit',
        label: '실현손익',
        placeholder: '예: 120,000',
        helper: '소액주주 국내 상장주 매매차익은 게임 규칙상 비과세입니다.',
      },
    ],
  },
  fx: {
    title: '환율 민감도',
    subtitle: 'USD/KRW 변화가 원화 환산 금액과 수입 원가에 주는 압력을 봅니다.',
    resultTitle: '원화 환산',
    fields: [
      {
        id: 'usdAmount',
        label: '달러 금액',
        placeholder: '예: 1,000',
        helper: '원재료, 클라우드 비용, 수출 매출을 같은 방식으로 환산합니다.',
      },
      {
        id: 'usdKrw',
        label: '현재 환율',
        placeholder: '시장 환율',
        helper: '게임 상단의 USD/KRW 값을 기본값으로 사용합니다.',
      },
      {
        id: 'shock',
        label: '환율 충격',
        placeholder: '±3%',
        helper: '스트레스 테스트용 상하단 범위를 만듭니다.',
      },
    ],
  },
} satisfies Record<'fx' | 'tax', CalculatorSection>

export const PORTFOLIO_RISK_BADGE_RULES: RiskBadgeRule[] = [
  {
    id: 'cashBuffer',
    title: '현금 버퍼',
    icon: 'Wallet',
    goodLabel: '여유',
    watchLabel: '주의',
    riskLabel: '부족',
    actionLabel: '현금 비중 조절',
  },
  {
    id: 'concentration',
    title: '집중도',
    icon: 'BriefcaseBusiness',
    goodLabel: '분산',
    watchLabel: '쏠림',
    riskLabel: '과집중',
    actionLabel: '비중 재배치',
  },
  {
    id: 'weightedBeta',
    title: '베타',
    icon: 'Activity',
    goodLabel: '완만',
    watchLabel: '높음',
    riskLabel: '매우 높음',
    actionLabel: '고베타 축소',
  },
  {
    id: 'drawdown',
    title: '평가손익',
    icon: 'BarChart3',
    goodLabel: '안정',
    watchLabel: '점검',
    riskLabel: '손실 확대',
    actionLabel: '손절 기준 확인',
  },
  {
    id: 'fxExposure',
    title: '환율 노출',
    icon: 'Banknote',
    goodLabel: '낮음',
    watchLabel: '중간',
    riskLabel: '높음',
    actionLabel: '환율 민감도 보기',
  },
]

export const APP_TOOL_CARDS: ToolCardTemplate[] = [
  {
    id: 'watchlists',
    eyebrow: '관심종목',
    title: '테마 워치리스트',
    description: 'AI, 배터리, 방어주, 고베타 성장주를 앱 탭처럼 넘겨 봅니다.',
    icon: 'LineChart',
    accent: 'blue',
    actionLabel: '워치리스트 열기',
    metric: 'watchlistCount',
  },
  {
    id: 'screener',
    eyebrow: '검색',
    title: '조건검색 프리셋',
    description: '퀄리티, 반등, 배당, 과열 조건을 즉시 적용합니다.',
    icon: 'Search',
    accent: 'violet',
    actionLabel: '조건 적용',
    metric: 'screenerCount',
  },
  {
    id: 'alerts',
    eyebrow: '알림',
    title: '시장 경보 센터',
    description: '환율, 심리, 급등락, 현금 부족 알림을 한 곳에 모읍니다.',
    icon: 'Bell',
    accent: 'red',
    actionLabel: '알림 확인',
    metric: 'alertCount',
  },
  {
    id: 'missions',
    eyebrow: '리서치',
    title: '애널리스트 미션',
    description: '분산, 세제 계좌, 관심종목, 리스크 관리 목표를 추적합니다.',
    icon: 'Sparkles',
    accent: 'amber',
    actionLabel: '미션 보기',
    metric: 'missionProgress',
  },
  {
    id: 'calendar',
    eyebrow: '일정',
    title: '시장 캘린더',
    description: '금리, 수출, 정책, 실적 이벤트를 거래일 기준으로 준비합니다.',
    icon: 'CalendarDays',
    accent: 'green',
    actionLabel: '일정 확인',
    metric: 'calendarNext',
  },
  {
    id: 'calculator',
    eyebrow: '계산기',
    title: '세금·환율 계산',
    description: '거래세, ISA 한도, USD/KRW 충격을 빠르게 비교합니다.',
    icon: 'Scale',
    accent: 'slate',
    actionLabel: '계산하기',
    metric: 'taxRate',
  },
  {
    id: 'risk',
    eyebrow: '계좌',
    title: '리스크 배지',
    description: '현금, 집중도, 베타, 손익, 환율 노출을 배지로 정리합니다.',
    icon: 'ShieldCheck',
    accent: 'green',
    actionLabel: '배지 확인',
    metric: 'riskCount',
  },
  {
    id: 'fx',
    eyebrow: '환율',
    title: 'USD/KRW 레이더',
    description: '원화 약세가 소재, 배터리, 클라우드 비용에 주는 압력을 봅니다.',
    icon: 'Banknote',
    accent: 'blue',
    actionLabel: '환율 보기',
    metric: 'fxRate',
  },
]

export function buildAppContent(game: AppContentGameState, accountType: AccountType = 'regular'): AppContentBundle {
  return {
    watchlists: buildWatchlists(game.companies),
    screenerPresets: SCREENER_PRESETS,
    alerts: getTriggeredAlerts(game, accountType),
    missions: getAnalystMissionStatus(game, accountType),
    calendar: getUpcomingMarketEvents(game),
    calculator: {
      labels: TAX_FX_CALCULATOR_LABELS,
      taxRows: buildTaxCalculatorRows(game, accountType),
      fxRows: buildFxCalculatorRows(game),
    },
    riskBadges: getPortfolioRiskBadges(game, accountType),
    toolCards: buildAppToolCards(game, accountType),
  }
}

export function buildWatchlists(companies: AppContentCompany[]): WatchlistContent[] {
  const companyByTicker = new Map(companies.map((company) => [company.ticker, company]))

  return WATCHLISTS.map((watchlist) => ({
    ...watchlist,
    stocks: watchlist.tickers
      .map((ticker) => companyByTicker.get(ticker))
      .filter((company): company is AppContentCompany => Boolean(company))
      .map((company) => ({
        ticker: company.ticker,
        name: company.name,
        sector: company.sector,
        priceLabel: formatWon(company.price),
        changeLabel: formatPercent(company.lastReturn),
        tone: returnTone(company.lastReturn),
        score: watchlistScore(company),
        reason: watchlistReason(company),
      })),
  }))
}

export function getScreenerPreset(presetId: string): ScreenerPreset | undefined {
  return SCREENER_PRESETS.find((preset) => preset.id === presetId)
}

export function getScreenerResults(companies: AppContentCompany[], presetId: string, limit = 6): ScreenerResult[] {
  const preset = getScreenerPreset(presetId) ?? SCREENER_PRESETS[0]

  return companies
    .filter((company) => preset.conditions.every((condition) => matchesCondition(companyMetric(company, condition.metric), condition)))
    .map((company) => ({
      ticker: company.ticker,
      name: company.name,
      sector: company.sector,
      score: screenerScore(company, preset),
      primaryValue: formatMetricValue(preset.sortBy, companyMetric(company, preset.sortBy)),
      highlights: preset.conditions.map((condition) => condition.label),
    }))
    .sort((a, b) => (preset.sortDirection === 'asc' ? a.score - b.score : b.score - a.score))
    .slice(0, limit)
}

export function getTriggeredAlerts(game: AppContentGameState, accountType: AccountType = 'regular'): TriggeredAlert[] {
  return ALERT_RULES.flatMap((rule) => {
    const trigger = evaluateAlertRule(game, accountType, rule)

    if (!trigger) return []

    return [trigger]
  })
}

export function getAnalystMissionStatus(game: AppContentGameState, accountType: AccountType = 'regular'): MissionStatus[] {
  return ANALYST_MISSIONS.map((mission) => {
    const checklist = mission.criteria.map((criterion) => missionCriterionStatus(game, accountType, criterion))
    const progress = Math.round(
      checklist.reduce((sum, item) => sum + item.progress, 0) / Math.max(1, checklist.length),
    )

    return {
      ...mission,
      progress,
      completed: checklist.every((item) => item.completed),
      checklist,
    }
  })
}

export function getUpcomingMarketEvents(game: AppContentGameState, limit = 5): UpcomingMarketEvent[] {
  return MARKET_CALENDAR.filter((event) => event.day >= game.day)
    .sort((a, b) => a.day - b.day)
    .slice(0, limit)
    .map((event) => {
      const dayGap = event.day - game.day

      return {
        ...event,
        dDayLabel: dayGap === 0 ? '오늘' : `D+${dayGap}`,
        tone: event.importance === '매우 중요' ? 'risk' : event.importance === '중요' ? 'watch' : 'neutral',
      }
    })
}

export function buildTaxCalculatorRows(
  game: AppContentGameState,
  accountType: AccountType = 'regular',
  sellAmount = 1_000_000,
  dividendAmount = 100_000,
): CalculatorRow[] {
  const account = game.accounts[accountType]
  const transactionTax = Math.floor(sellAmount * TRANSACTION_TAX_RATE)
  const dividendTax =
    accountType === 'isa'
      ? Math.floor(Math.max(0, account.isaTaxableProfit + dividendAmount - ISA_TAX_FREE_LIMIT) * ISA_LOW_TAX_RATE)
      : Math.floor(dividendAmount * DIVIDEND_TAX_RATE)
  const isaRoom = Math.max(0, ISA_ANNUAL_LIMIT - game.accounts.isa.isaContribution)

  return [
    {
      id: 'transaction-tax',
      label: '매도 거래세',
      value: formatWon(transactionTax),
      helper: `${formatCompactWon(sellAmount)} 매도 기준 ${(TRANSACTION_TAX_RATE * 100).toFixed(2)}%`,
      tone: 'neutral',
    },
    {
      id: 'dividend-tax',
      label: accountType === 'isa' ? 'ISA 배당 과세' : '배당소득세',
      value: formatWon(dividendTax),
      helper: accountType === 'isa' ? '비과세 한도 초과분에 저율과세 적용' : '일반 계좌 배당세 15.4% 적용',
      tone: accountType === 'isa' ? 'good' : 'watch',
    },
    {
      id: 'isa-room',
      label: 'ISA 납입 여유',
      value: formatCompactWon(isaRoom),
      helper: `연간 한도 ${formatCompactWon(ISA_ANNUAL_LIMIT)} 중 남은 금액`,
      tone: isaRoom > 0 ? 'good' : 'risk',
    },
  ]
}

export function buildFxCalculatorRows(game: AppContentGameState, usdAmount = 1_000, shock = 0.03): CalculatorRow[] {
  const baseWon = usdAmount * game.usdKrw
  const upWon = usdAmount * game.usdKrw * (1 + shock)
  const downWon = usdAmount * game.usdKrw * (1 - shock)

  return [
    {
      id: 'base-fx',
      label: '현재 환산액',
      value: formatWon(baseWon),
      helper: `$${usdAmount.toLocaleString('ko-KR')} × ${game.usdKrw.toLocaleString('ko-KR')}원`,
      tone: 'neutral',
    },
    {
      id: 'fx-up',
      label: '환율 상승 시',
      value: formatWon(upWon),
      helper: `USD/KRW +${(shock * 100).toFixed(0)}% 스트레스`,
      tone: 'watch',
    },
    {
      id: 'fx-down',
      label: '환율 하락 시',
      value: formatWon(downWon),
      helper: `USD/KRW -${(shock * 100).toFixed(0)}% 완화`,
      tone: 'good',
    },
  ]
}

export function getPortfolioRiskBadges(
  game: AppContentGameState,
  accountType: AccountType = 'regular',
): PortfolioRiskBadge[] {
  return PORTFOLIO_RISK_BADGE_RULES.map((rule) => buildRiskBadge(rule, game, accountType))
}

export function buildAppToolCards(game: AppContentGameState, accountType: AccountType = 'regular'): AppToolCard[] {
  const alerts = getTriggeredAlerts(game, accountType)
  const missions = getAnalystMissionStatus(game, accountType)
  const riskBadges = getPortfolioRiskBadges(game, accountType)
  const nextEvent = getUpcomingMarketEvents(game, 1)[0]

  return APP_TOOL_CARDS.map((card) => {
    const metric = toolCardMetric(card.metric, game, alerts, missions, riskBadges, nextEvent)

    return {
      ...card,
      metricLabel: metric.label,
      metricValue: metric.value,
      tone: metric.tone,
    }
  })
}

function evaluateAlertRule(
  game: AppContentGameState,
  accountType: AccountType,
  rule: AlertRule,
): TriggeredAlert | undefined {
  if (rule.source === 'market') {
    const value = marketMetric(game, rule.metric)

    if (!matchesCondition(value, rule)) return undefined

    return {
      ...rule,
      valueLabel: formatAlertValue(rule.metric, value),
      targetLabel: '시장',
      tickers: [],
    }
  }

  if (rule.source === 'selectedCompany') {
    const company = selectedCompany(game)
    const value = companyMetric(company, rule.metric as ScreenerMetric)

    if (!matchesCondition(value, rule)) return undefined

    return {
      ...rule,
      valueLabel: formatAlertValue(rule.metric, value),
      targetLabel: company.name,
      tickers: [company.ticker],
    }
  }

  if (rule.source === 'anyCompany') {
    const companies = game.companies.filter((company) =>
      matchesCondition(Math.abs(companyMetric(company, rule.metric as ScreenerMetric)), rule),
    )

    if (companies.length === 0) return undefined

    return {
      ...rule,
      valueLabel: `${companies.length}개 종목`,
      targetLabel: companies.map((company) => company.name).join(', '),
      tickers: companies.map((company) => company.ticker),
    }
  }

  const value = portfolioMetric(game, accountType, rule.metric)

  if (!matchesCondition(value, rule)) return undefined

  return {
    ...rule,
    valueLabel: formatAlertValue(rule.metric, value),
    targetLabel: accountType === 'isa' ? 'ISA 계좌' : '일반 계좌',
    tickers: Object.keys(game.accounts[accountType].holdings),
  }
}

function buildRiskBadge(
  rule: RiskBadgeRule,
  game: AppContentGameState,
  accountType: AccountType,
): PortfolioRiskBadge {
  const snapshot = portfolioSnapshot(game, accountType)

  switch (rule.id) {
    case 'cashBuffer': {
      const tone = snapshot.cashRatio < 0.08 ? 'risk' : snapshot.cashRatio < 0.15 ? 'watch' : 'good'

      return {
        id: rule.id,
        title: rule.title,
        levelLabel: riskLabel(rule, tone),
        valueLabel: formatPercent(snapshot.cashRatio),
        detail: '하락장 대응에 쓸 수 있는 현금 비중입니다.',
        tone,
        icon: rule.icon,
        actionLabel: rule.actionLabel,
      }
    }
    case 'concentration': {
      const tone = snapshot.topPositionRatio > 0.45 ? 'risk' : snapshot.topPositionRatio > 0.3 ? 'watch' : 'good'

      return {
        id: rule.id,
        title: rule.title,
        levelLabel: riskLabel(rule, tone),
        valueLabel: formatPercent(snapshot.topPositionRatio),
        detail: '가장 큰 보유 종목이 계좌에서 차지하는 비중입니다.',
        tone,
        icon: rule.icon,
        actionLabel: rule.actionLabel,
      }
    }
    case 'weightedBeta': {
      const tone = snapshot.weightedBeta > 1.25 ? 'risk' : snapshot.weightedBeta > 1.05 ? 'watch' : 'good'

      return {
        id: rule.id,
        title: rule.title,
        levelLabel: riskLabel(rule, tone),
        valueLabel: `${snapshot.weightedBeta.toFixed(2)}x`,
        detail: '시장 변동에 계좌가 얼마나 크게 흔들리는지 보는 값입니다.',
        tone,
        icon: rule.icon,
        actionLabel: rule.actionLabel,
      }
    }
    case 'drawdown': {
      const tone = snapshot.unrealizedReturn < -0.08 ? 'risk' : snapshot.unrealizedReturn < -0.03 ? 'watch' : 'good'

      return {
        id: rule.id,
        title: rule.title,
        levelLabel: riskLabel(rule, tone),
        valueLabel: formatPercent(snapshot.unrealizedReturn),
        detail: '평균단가 대비 현재 보유 주식의 평가손익률입니다.',
        tone,
        icon: rule.icon,
        actionLabel: rule.actionLabel,
      }
    }
    case 'fxExposure': {
      const tone = snapshot.fxExposure > 0.5 ? 'risk' : snapshot.fxExposure > 0.25 ? 'watch' : 'good'

      return {
        id: rule.id,
        title: rule.title,
        levelLabel: riskLabel(rule, tone),
        valueLabel: formatPercent(snapshot.fxExposure),
        detail: '환율 변화에 민감한 소재, 배터리, 클라우드 관련 비중입니다.',
        tone,
        icon: rule.icon,
        actionLabel: rule.actionLabel,
      }
    }
  }
}

function missionCriterionStatus(
  game: AppContentGameState,
  accountType: AccountType,
  criterion: MissionCriterion,
) {
  const current = missionCriterionValue(game, accountType, criterion.kind)
  const progress = Math.min(100, Math.round((current / Math.max(criterion.target, 0.0001)) * 100))

  return {
    label: criterion.label,
    currentLabel: formatMissionValue(criterion.kind, current),
    progress,
    completed: current >= criterion.target,
  }
}

function missionCriterionValue(game: AppContentGameState, accountType: AccountType, kind: MissionCriterionKind) {
  const account = game.accounts[accountType]
  const holdings = Object.entries(account.holdings).filter(([, holding]) => holding.quantity > 0)
  const heldCompanies = holdings
    .map(([ticker]) => game.companies.find((company) => company.ticker === ticker))
    .filter((company): company is AppContentCompany => Boolean(company))

  switch (kind) {
    case 'cashRatio':
      return portfolioSnapshot(game, accountType).cashRatio
    case 'holdingCount':
      return holdings.length
    case 'isaContribution':
      return game.accounts.isa.isaContribution
    case 'positiveHoldingRatio':
      return positiveHoldingRatio(game, accountType)
    case 'sectorCount':
      return new Set(heldCompanies.map((company) => company.sector)).size
    case 'watchlistCoverage':
      return new Set(WATCHLISTS.flatMap((watchlist) => watchlist.tickers).filter((ticker) => account.holdings[ticker])).size
  }
}

function toolCardMetric(
  metric: ToolCardMetric,
  game: AppContentGameState,
  alerts: TriggeredAlert[],
  missions: MissionStatus[],
  riskBadges: PortfolioRiskBadge[],
  nextEvent?: UpcomingMarketEvent,
): { label: string; value: string; tone: ContentTone } {
  switch (metric) {
    case 'alertCount':
      return {
        label: '활성 알림',
        value: `${alerts.length}개`,
        tone: alerts.length > 2 ? 'risk' : alerts.length > 0 ? 'watch' : 'good',
      }
    case 'calendarNext':
      return {
        label: nextEvent?.dDayLabel ?? '일정 없음',
        value: nextEvent?.title ?? '완료',
        tone: nextEvent?.tone ?? 'neutral',
      }
    case 'fxRate':
      return {
        label: 'USD/KRW',
        value: game.usdKrw.toLocaleString('ko-KR'),
        tone: game.usdKrw >= 1400 ? 'watch' : 'neutral',
      }
    case 'missionProgress': {
      const completed = missions.filter((mission) => mission.completed).length

      return {
        label: '완료 미션',
        value: `${completed}/${missions.length}`,
        tone: completed === missions.length ? 'good' : 'watch',
      }
    }
    case 'riskCount': {
      const riskCount = riskBadges.filter((badge) => badge.tone === 'risk').length

      return {
        label: '위험 배지',
        value: `${riskCount}개`,
        tone: riskCount > 0 ? 'risk' : 'good',
      }
    }
    case 'screenerCount':
      return {
        label: '프리셋',
        value: `${SCREENER_PRESETS.length}개`,
        tone: 'neutral',
      }
    case 'taxRate':
      return {
        label: '매도 거래세',
        value: `${(TRANSACTION_TAX_RATE * 100).toFixed(2)}%`,
        tone: 'neutral',
      }
    case 'watchlistCount':
      return {
        label: '테마',
        value: `${WATCHLISTS.length}개`,
        tone: 'neutral',
      }
  }
}

function screenerScore(company: AppContentCompany, preset: ScreenerPreset) {
  const raw = companyMetric(company, preset.sortBy)
  const direction = preset.sortDirection === 'asc' ? -1 : 1
  const conditionBonus = preset.conditions.reduce((sum, condition) => {
    return sum + (matchesCondition(companyMetric(company, condition.metric), condition) ? 12 : 0)
  }, 0)

  return Math.round(raw * direction * 100 + conditionBonus)
}

function watchlistScore(company: AppContentCompany) {
  const returnScore = Math.min(22, Math.abs(company.lastReturn) * 220)
  const qualityScore = company.quality * 32
  const backlogScore = Math.min(24, company.backlog * 16)
  const marginScore = Math.min(22, company.margin * 120)

  return Math.round(clamp(returnScore + qualityScore + backlogScore + marginScore, 0, 100))
}

function watchlistReason(company: AppContentCompany) {
  if (company.status !== '정상') return company.status
  if (company.lastReturn >= 0.05) return '강한 수급'
  if (company.lastReturn <= -0.04) return '저가 점검'
  if (company.backlog >= 1.15) return '수주잔고 우위'
  if (company.dividendYield >= 0.015) return '배당 방어'
  return company.operation
}

function companyMetric(company: AppContentCompany, metric: ScreenerMetric) {
  switch (metric) {
    case 'backlog':
      return company.backlog
    case 'beta':
      return company.beta
    case 'debtRatio':
      return company.debtRatio
    case 'dividendYield':
      return company.dividendYield
    case 'dayVolume':
      return company.dayVolume
    case 'lastReturn':
      return company.lastReturn
    case 'margin':
      return company.margin
    case 'marketCap':
      return company.price * company.shares
    case 'price':
      return company.price
    case 'quality':
      return company.quality
    case 'revenue':
      return company.revenue
    case 'sentiment':
      return company.sentiment
  }
}

function marketMetric(game: AppContentGameState, metric: AlertRule['metric']) {
  switch (metric) {
    case 'marketHaltRisk':
      return game.marketHaltRisk
    case 'mood':
      return game.mood
    case 'policyRate':
      return game.policyRate
    case 'usdKrw':
      return game.usdKrw
    default:
      return 0
  }
}

function portfolioMetric(game: AppContentGameState, accountType: AccountType, metric: AlertRule['metric']) {
  const snapshot = portfolioSnapshot(game, accountType)

  switch (metric) {
    case 'cashRatio':
      return snapshot.cashRatio
    case 'beta':
      return snapshot.weightedBeta
    default:
      return 0
  }
}

function matchesCondition(value: number, condition: { operator: ScreenerOperator; value: number; max?: number }) {
  if (condition.operator === 'gte') return value >= condition.value
  if (condition.operator === 'lte') return value <= condition.value
  return value >= condition.value && value <= (condition.max ?? condition.value)
}

function portfolioSnapshot(game: AppContentGameState, accountType: AccountType) {
  const account = game.accounts[accountType]
  const equity = accountEquity(account, game.companies)
  const stockValue = portfolioValue(account, game.companies)
  const holdings = Object.entries(account.holdings)
    .map(([ticker, holding]) => {
      const company = game.companies.find((item) => item.ticker === ticker)
      const value = (company?.price ?? 0) * holding.quantity
      const cost = holding.avgPrice * holding.quantity

      return { company, value, cost }
    })
    .filter((item) => item.company && item.value > 0)
  const topPositionRatio = holdings.reduce((max, item) => Math.max(max, item.value / Math.max(1, equity)), 0)
  const weightedBeta =
    holdings.reduce((sum, item) => sum + (item.company?.beta ?? 0) * (item.value / Math.max(1, stockValue)), 0) || 0
  const totalCost = holdings.reduce((sum, item) => sum + item.cost, 0)
  const unrealizedReturn = totalCost > 0 ? (stockValue - totalCost) / totalCost : 0
  const fxSensitiveSectors: Sector[] = ['소재', '배터리', 'AI소프트웨어']
  const fxExposure = holdings.reduce((sum, item) => {
    if (!item.company || !fxSensitiveSectors.includes(item.company.sector)) return sum
    return sum + item.value / Math.max(1, equity)
  }, 0)

  return {
    cashRatio: account.cash / Math.max(1, equity),
    fxExposure,
    topPositionRatio,
    unrealizedReturn,
    weightedBeta,
  }
}

function positiveHoldingRatio(game: AppContentGameState, accountType: AccountType) {
  const holdings = Object.entries(game.accounts[accountType].holdings).filter(([, holding]) => holding.quantity > 0)

  if (holdings.length === 0) return 0

  const positiveCount = holdings.filter(([ticker, holding]) => {
    const company = game.companies.find((item) => item.ticker === ticker)

    return company ? company.price >= holding.avgPrice : false
  }).length

  return positiveCount / holdings.length
}

function selectedCompany(game: AppContentGameState) {
  return game.companies.find((company) => company.ticker === game.selectedTicker) ?? game.companies[0]
}

function formatMetricValue(metric: ScreenerMetric, value: number) {
  switch (metric) {
    case 'debtRatio':
    case 'dividendYield':
    case 'lastReturn':
    case 'margin':
    case 'sentiment':
      return formatPercent(value)
    case 'marketCap':
      return formatCompactWon(value)
    case 'dayVolume':
    case 'price':
      return formatWon(value)
    case 'backlog':
    case 'beta':
      return `${value.toFixed(2)}x`
    case 'quality':
      return `${Math.round(value * 100)}점`
    case 'revenue':
      return `${value.toFixed(1)}조`
  }
}

function formatAlertValue(metric: AlertRule['metric'], value: number) {
  if (metric === 'usdKrw') return value.toLocaleString('ko-KR')
  if (metric === 'cashRatio' || metric === 'marketHaltRisk' || metric === 'mood' || metric === 'lastReturn') {
    return formatPercent(value)
  }
  return formatMetricValue(metric as ScreenerMetric, value)
}

function formatMissionValue(kind: MissionCriterionKind, value: number) {
  if (kind === 'cashRatio' || kind === 'positiveHoldingRatio') return formatPercent(value)
  if (kind === 'isaContribution') return formatCompactWon(value)
  return `${Math.round(value).toLocaleString('ko-KR')}개`
}

function returnTone(value: number): ContentTone {
  if (value >= 0.12) return 'limit'
  if (value >= 0) return 'good'
  if (value <= -0.08) return 'risk'
  return 'bad'
}

function riskLabel(rule: RiskBadgeRule, tone: ContentTone) {
  if (tone === 'risk') return rule.riskLabel
  if (tone === 'watch') return rule.watchLabel
  return rule.goodLabel
}

function portfolioValue(account: AppContentAccount, companies: AppContentCompany[]) {
  return Object.entries(account.holdings).reduce((sum, [ticker, holding]) => {
    const company = companies.find((item) => item.ticker === ticker)
    return sum + (company?.price ?? 0) * holding.quantity
  }, 0)
}

function accountEquity(account: AppContentAccount, companies: AppContentCompany[]) {
  return account.cash + portfolioValue(account, companies)
}

function formatWon(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

function formatCompactWon(value: number) {
  if (Math.abs(value) >= 100_000_000) {
    return `${(value / 100_000_000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}억`
  }

  if (Math.abs(value) >= 10_000) {
    return `${(value / 10_000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만`
  }

  return Math.round(value).toLocaleString('ko-KR')
}

function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

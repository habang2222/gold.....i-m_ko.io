export type Exchange = 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE' | 'TSE' | 'MOTHERS'
export type AccountType = 'regular' | 'isa'
export type Country = 'KR' | 'US' | 'JP'
export type Currency = 'KRW' | 'USD' | 'JPY'
export type CompanySize = 'large' | 'small'

export type Sector =
  | '반도체'
  | '소재'
  | '자동차'
  | 'AI소프트웨어'
  | '바이오'
  | '배터리'
  | '조선방산'
  | '게임콘텐츠'
  | '에너지'
  | '금융'
  | '유통소비'
  | '미디어'
  | '로봇'
  | '우주항공'
  | '물류'
  | '보안'
  | '클라우드'
  | '음식료'

export type NewsTone = 'good' | 'bad' | 'neutral' | 'limit' | 'crisis' | 'rescue' | 'listing' | 'foreign'

export interface Relation {
  ticker: string
  weight: number
  reason: string
}

export interface CommoditySensitivity {
  lithium?: number
  oil?: number
  memory?: number
  freight?: number
  yen?: number
  dollar?: number
}

export interface Company {
  ticker: string
  name: string
  exchange: Exchange
  country: Country
  currency: Currency
  size: CompanySize
  sector: Sector
  tags: string[]
  description: string
  price: number
  prevClose: number
  open: number
  fairPrice: number
  shares: number
  beta: number
  revenue: number
  margin: number
  backlog: number
  debtRatio: number
  quality: number
  sentiment: number
  dividendYield: number
  relations: Relation[]
  history: number[]
  lastReturn: number
  dayVolume: number
  status: string
  operation: string
  distress: number
  badStreak: number
  auditFlag: number
  alive: boolean
  listedDay: number
  commoditySensitivity: CommoditySensitivity
}

export interface Holding {
  quantity: number
  avgPrice: number
  currency: Currency
  avgFx: number
  realizedProfit: number
  dividends: number
}

export interface Account {
  cash: number
  holdings: Record<string, Holding>
  taxesPaid: number
  feesPaid: number
  realizedProfit: number
  dividendsAfterTax: number
  foreignTaxPaid: number
  foreignProfitThisYear: number
  isaContribution: number
  isaTaxableProfit: number
  isaBenefitUsed: number
}

export interface NewsAgency {
  id: string
  name: string
  ticker: string
  stance: '보수' | '성장' | '탐사'
  reliability: number
  accuracy: number
  misses: number
}

export interface NewsItem {
  id: string
  day: number
  date: string
  source: string
  sourceTicker: string
  ticker?: string
  title: string
  detail: string
  tone: NewsTone
  impact: number
  predictedDirection: -1 | 0 | 1
  confidence: number
  truthChecked: boolean
}

export interface MarketIndices {
  kospi: number
  kosdaq: number
  nasdaq: number
  spSmall: number
  nikkei: number
  topix: number
}

export interface FxRates {
  USDKRW: number
  JPYKRW: number
}

export interface CommodityState {
  lithium: number
  oil: number
  memory: number
  freight: number
}

export interface GameState {
  day: number
  date: string
  seed: number
  companies: Company[]
  accounts: Record<AccountType, Account>
  agencies: NewsAgency[]
  news: NewsItem[]
  selectedTicker: string
  watchlist: string[]
  indices: MarketIndices
  fx: FxRates
  commodities: CommodityState
  mood: number
  policyRate: number
  sectorCycles: Record<Sector, number>
  marketHaltRisk: number
}

export interface TradeResult {
  state: GameState
  message: string
  ok: boolean
}

export interface SellEstimate {
  grossLocal: number
  grossKrw: number
  fee: number
  transactionTax: number
  capitalGainsTax: number
  fxFee: number
  totalTaxAndFees: number
  netKrw: number
  profitKrw: number
  fxRate: number
}

interface CompanySeed {
  ticker: string
  name: string
  country: Country
  exchange: Exchange
  currency: Currency
  size: CompanySize
  sector: Sector
  basePrice: number
  shares: number
  revenue: number
  margin: number
  debtRatio: number
  quality: number
  beta: number
  dividendYield: number
  tags: string[]
  description: string
  commoditySensitivity?: CommoditySensitivity
}

interface MacroEvent {
  title: string
  detail: string
  mood: number
  fxUsd: number
  fxJpy: number
  sector: Partial<Record<Sector, number>>
  commodities: Partial<Record<keyof CommodityState, number>>
}

export const COMMISSION_RATE = 0.00015
export const FOREIGN_COMMISSION_RATE = 0.0007
export const FX_FEE_RATE = 0.002
export const TRANSACTION_TAX_RATE = 0.002
export const DIVIDEND_TAX_RATE = 0.154
export const FOREIGN_CAPITAL_GAINS_TAX_RATE = 0.22
export const FOREIGN_GAIN_DEDUCTION = 2_500_000
export const ISA_ANNUAL_LIMIT = 20_000_000
export const ISA_TAX_FREE_LIMIT = 2_000_000
export const ISA_LOW_TAX_RATE = 0.099
export const STARTING_CASH_KRW = 500_000
export const BOOSTED_RESTART_CASH_KRW = 1_000_000
export const BANKRUPT_CASH_THRESHOLD_KRW = 1_000

const START_DATE = '2026-05-18'

const SECTORS: Sector[] = [
  '반도체',
  '소재',
  '자동차',
  'AI소프트웨어',
  '바이오',
  '배터리',
  '조선방산',
  '게임콘텐츠',
  '에너지',
  '금융',
  '유통소비',
  '미디어',
  '로봇',
  '우주항공',
  '물류',
  '보안',
  '클라우드',
  '음식료',
]

const STARTING_INDICES: MarketIndices = {
  kospi: 2718.44,
  kosdaq: 842.31,
  nasdaq: 16832.62,
  spSmall: 1397.21,
  nikkei: 38640.22,
  topix: 2711.08,
}

const STARTING_FX: FxRates = {
  USDKRW: 1368,
  JPYKRW: 9.08,
}

const STARTING_COMMODITIES: CommodityState = {
  lithium: 100,
  oil: 100,
  memory: 100,
  freight: 100,
}

const AGENCIES: NewsAgency[] = [
  { id: 'anchor', name: '앵커마켓', ticker: 'AMN', stance: '보수', reliability: 0.72, accuracy: 0.58, misses: 0 },
  { id: 'pulse', name: '펄스와이어', ticker: 'PUL', stance: '성장', reliability: 0.47, accuracy: 0.5, misses: 0 },
  { id: 'ledger', name: '레저스코프', ticker: 'LED', stance: '탐사', reliability: 0.64, accuracy: 0.55, misses: 0 },
]

const LARGE_COMPANY_SEEDS: CompanySeed[] = [
  seed('HBM', '한빛메모리', 'KR', 'KOSPI', 'KRW', 'large', '반도체', 84200, 7200000, 8.9, 0.22, 0.42, 0.72, 1.1, 0.018, ['hbm', 'ai-server', 'foundry'], 'AI 서버용 HBM과 첨단 패키징을 동시에 가진 대형 반도체사', { memory: 0.8, dollar: 0.28 }),
  seed('AUR', '아우라모빌리티', 'KR', 'KOSPI', 'KRW', 'large', '자동차', 62400, 4400000, 6.7, 0.1, 0.64, 0.58, 0.94, 0.021, ['ev', 'mobility', 'export'], '전기차와 상용차, 자율주행 구독 서비스를 묶어 파는 완성차 회사', { lithium: -0.42, dollar: 0.22 }),
  seed('PUR', '푸른배터리', 'KR', 'KOSPI', 'KRW', 'large', '배터리', 118500, 2900000, 5.1, 0.11, 0.82, 0.5, 1.22, 0.006, ['battery', 'ess', 'ev'], 'LFP와 전고체 파일럿 라인을 동시에 돌리는 2차전지 기업', { lithium: -0.75, dollar: 0.18 }),
  seed('SEA', '해온조선', 'KR', 'KOSPI', 'KRW', 'large', '조선방산', 35800, 5800000, 4.8, 0.08, 0.72, 0.57, 0.84, 0.012, ['ship', 'defense', 'lng'], 'LNG선, 특수선, 해상풍력 설치선을 수주하는 중후장대 기업', { freight: 0.35, dollar: 0.28 }),
  seed('FIN', '다온증권', 'KR', 'KOSPI', 'KRW', 'large', '금융', 12840, 6300000, 1.7, 0.13, 0.88, 0.48, 0.96, 0.04, ['brokerage', 'ipo', 'pf'], '리테일 브로커리지와 IPO 주관, 프로젝트 금융을 하는 증권사'),
  seed('GUM', '구름소프트', 'KR', 'KOSDAQ', 'KRW', 'large', 'AI소프트웨어', 27600, 2200000, 0.9, 0.21, 0.18, 0.64, 1.34, 0, ['ai-agent', 'cloud', 'enterprise'], '기업용 AI 에이전트와 데이터센터 운영 도구를 제공하는 소프트웨어사', { memory: 0.16 }),
  seed('HSO', '해솔에너지', 'KR', 'KOSPI', 'KRW', 'large', '에너지', 21350, 4900000, 2.2, 0.1, 0.67, 0.54, 0.76, 0.025, ['renewable', 'ess', 'power'], '태양광, ESS, 전력거래 플랫폼을 가진 에너지 인프라 회사', { oil: -0.18 }),
  seed('BIO', '셀바이오랩', 'KR', 'KOSDAQ', 'KRW', 'large', '바이오', 42100, 1700000, 0.42, -0.07, 0.36, 0.46, 1.58, 0, ['oncology', 'cdmo', 'clinical'], '면역항암제 후보물질과 CDMO 위탁생산을 병행하는 바이오텍'),
  seed('ORC', '오르카클라우드', 'US', 'NASDAQ', 'USD', 'large', '클라우드', 142.4, 18000000, 13.4, 0.24, 0.28, 0.75, 1.18, 0.002, ['cloud', 'ai-server', 'subscription'], 'AI 추론용 클라우드와 개발자 플랫폼을 운영하는 미국 대형 기술주', { memory: -0.18, dollar: -0.1 }),
  seed('NVX', '노바엑셀', 'US', 'NASDAQ', 'USD', 'large', '반도체', 238.8, 13200000, 16.1, 0.32, 0.22, 0.82, 1.36, 0.004, ['gpu', 'hbm', 'ai-server'], '가속기 칩과 네트워크 칩을 파는 미국 AI 반도체 대표주', { memory: 0.48 }),
  seed('RIV', '리버모터스', 'US', 'NYSE', 'USD', 'large', '자동차', 64.2, 9000000, 7.6, 0.06, 0.72, 0.5, 1.12, 0, ['ev', 'battery', 'fleet'], '전기 픽업과 상업용 밴을 생산하는 미국 전기차 기업', { lithium: -0.34, oil: -0.09 }),
  seed('MED', '메디온테라', 'US', 'NASDAQ', 'USD', 'large', '바이오', 91.7, 5100000, 3.1, 0.18, 0.31, 0.62, 1.04, 0.007, ['obesity', 'clinical', 'pharma'], '비만 치료제와 자가면역 파이프라인을 가진 미국 바이오 대형주'),
  seed('KAI', '카이로보틱스', 'JP', 'TSE', 'JPY', 'large', '로봇', 4280, 8200000, 4.9, 0.14, 0.38, 0.66, 0.92, 0.016, ['robot', 'factory', 'export'], '공장 자동화 로봇과 서보모터를 생산하는 일본 제조사', { yen: -0.22 }),
  seed('SUK', '스미카소재', 'JP', 'TSE', 'JPY', 'large', '소재', 3120, 7600000, 3.4, 0.12, 0.44, 0.6, 0.88, 0.018, ['chemical', 'battery-material', 'semicap'], '반도체 세정액과 배터리 바인더를 동시에 공급하는 일본 소재사', { lithium: -0.2, yen: -0.12 }),
  seed('NIK', '니카전자', 'JP', 'TSE', 'JPY', 'large', '유통소비', 15600, 2500000, 9.2, 0.09, 0.33, 0.68, 0.72, 0.022, ['consumer', 'camera', 'export'], '카메라, 센서, 프리미엄 가전으로 알려진 일본 전자기업', { yen: -0.18 }),
  seed('AMN', '앵커마켓뉴스', 'KR', 'KOSDAQ', 'KRW', 'large', '미디어', 7800, 4800000, 0.62, 0.16, 0.21, 0.62, 0.78, 0.012, ['news', 'media', 'conservative'], '기관투자자 독자층이 강한 보수적 시장 뉴스 회사'),
  seed('PUL', '펄스와이어', 'KR', 'KOSDAQ', 'KRW', 'large', '미디어', 11800, 3600000, 0.44, 0.19, 0.34, 0.48, 1.25, 0.004, ['news', 'media', 'rumor'], '속보와 성장주 루머에 강하지만 오보 리스크도 큰 뉴스 회사'),
  seed('LED', '레저스코프', 'KR', 'KOSDAQ', 'KRW', 'large', '미디어', 9650, 3200000, 0.38, 0.12, 0.18, 0.57, 0.96, 0.006, ['news', 'media', 'forensic'], '회계와 공시를 집요하게 파고드는 탐사형 금융 미디어'),
  seed('AST', '아스트라스페이스', 'US', 'NYSE', 'USD', 'large', '우주항공', 54.8, 7600000, 2.5, 0.05, 0.66, 0.52, 1.38, 0, ['space', 'defense', 'launch'], '소형 위성과 발사체 재사용 서비스를 제공하는 미국 우주기업', { oil: -0.1 }),
  seed('YMT', '야마토핀테크', 'JP', 'TSE', 'JPY', 'large', '금융', 2710, 9400000, 2.7, 0.18, 0.58, 0.57, 0.82, 0.026, ['fintech', 'payment', 'bank'], '일본 지역은행망과 결제 앱을 연결한 핀테크 금융사', { yen: 0.08 }),
]

const SMALL_COMPANY_SEEDS: CompanySeed[] = [
  seed('SEN', '센서웍스', 'KR', 'KOSDAQ', 'KRW', 'small', '반도체', 18750, 2500000, 1.4, 0.17, 0.58, 0.55, 1.45, 0.002, ['sensor', 'semicap', 'hbm'], '웨이퍼 검사장비와 고속 센서 모듈을 만드는 성장주', { memory: 0.22 }),
  seed('NEM', '네온소재', 'KR', 'KOSDAQ', 'KRW', 'small', '소재', 9320, 3100000, 1.8, 0.15, 0.49, 0.52, 1.28, 0.008, ['gas', 'chemical', 'battery-material'], '네온가스와 포토레지스트 원재료, 전해질을 공급하는 소재사', { lithium: -0.16, memory: 0.2 }),
  seed('PIX', '픽셀엔터', 'KR', 'KOSDAQ', 'KRW', 'small', '게임콘텐츠', 14620, 3600000, 0.76, 0.18, 0.23, 0.5, 1.34, 0.004, ['game', 'ip', 'ai-tool'], '라이브 서비스 게임과 버추얼 아이돌 IP를 운영하는 콘텐츠 기업'),
  seed('RAY', '레이저팩토리', 'KR', 'KOSDAQ', 'KRW', 'small', '반도체', 22400, 1800000, 0.84, 0.16, 0.53, 0.5, 1.48, 0, ['laser', 'semicap', 'display'], '노광 보조 레이저와 디스플레이 절단 장비를 납품한다', { memory: 0.16 }),
  seed('MTR', '모터링크', 'KR', 'KOSDAQ', 'KRW', 'small', '자동차', 6850, 5400000, 0.58, 0.07, 0.7, 0.42, 1.18, 0.002, ['motor', 'ev', 'parts'], '전기차 구동모터와 감속기 부품을 만드는 납품사', { lithium: -0.12 }),
  seed('ECO', '에코분리막', 'KR', 'KOSDAQ', 'KRW', 'small', '배터리', 17100, 2600000, 0.92, 0.1, 0.77, 0.46, 1.52, 0, ['battery', 'separator', 'ess'], '고내열 분리막과 ESS용 안전필름을 생산한다', { lithium: -0.2 }),
  seed('DOK', '독도방산', 'KR', 'KOSDAQ', 'KRW', 'small', '조선방산', 11350, 2800000, 0.66, 0.09, 0.62, 0.48, 1.1, 0.006, ['defense', 'radar', 'ship'], '함정 레이더와 통신장비를 공급하는 방산 부품사', { dollar: 0.18 }),
  seed('MEDK', '메디키트', 'KR', 'KOSDAQ', 'KRW', 'small', '바이오', 8230, 3300000, 0.26, -0.03, 0.28, 0.4, 1.65, 0, ['diagnostic', 'clinical', 'export'], '진단키트와 임상 샘플 분석 서비스를 운영한다'),
  seed('FOO', '푸드링크', 'KR', 'KOSDAQ', 'KRW', 'small', '음식료', 6120, 4100000, 0.48, 0.08, 0.44, 0.44, 0.76, 0.018, ['food', 'distribution', 'consumer'], '프랜차이즈 식자재와 간편식을 공급하는 내수 소비주', { freight: -0.1 }),
  seed('LOG', '로지스퀘어', 'KR', 'KOSDAQ', 'KRW', 'small', '물류', 7450, 3800000, 0.71, 0.06, 0.68, 0.43, 0.98, 0.01, ['logistics', 'export', 'warehouse'], '스마트 창고와 수출 물류 대행을 하는 물류 기업', { freight: 0.26, oil: -0.18 }),
  seed('SEC', '시큐어레이어', 'KR', 'KOSDAQ', 'KRW', 'small', '보안', 15300, 1900000, 0.52, 0.2, 0.16, 0.58, 1.18, 0, ['security', 'cloud', 'enterprise'], '클라우드 접근제어와 침해탐지 솔루션을 판다'),
  seed('RBT', '라온로보틱스', 'KR', 'KOSDAQ', 'KRW', 'small', '로봇', 19800, 2100000, 0.64, 0.08, 0.51, 0.5, 1.44, 0, ['robot', 'factory', 'parts'], '협동로봇과 물류 피킹 로봇을 생산하는 회사'),
  seed('CLD', '클라우드나인', 'KR', 'KOSDAQ', 'KRW', 'small', '클라우드', 13500, 2300000, 0.57, 0.17, 0.22, 0.57, 1.28, 0, ['cloud', 'ai-agent', 'subscription'], '중견기업용 SaaS와 프라이빗 클라우드를 제공한다'),
  seed('AIR', '에어로넥스', 'KR', 'KOSDAQ', 'KRW', 'small', '우주항공', 24100, 1500000, 0.38, 0.02, 0.63, 0.43, 1.62, 0, ['space', 'satellite', 'defense'], '초소형 위성 탑재체와 지상국 장비를 만든다'),
  seed('RET', '리테일봄', 'KR', 'KOSDAQ', 'KRW', 'small', '유통소비', 4890, 6200000, 0.86, 0.04, 0.71, 0.38, 0.82, 0.012, ['retail', 'consumer', 'online'], '오프라인 잡화점과 라이브커머스를 병행하는 유통주'),
  seed('HYD', '하이드로셀', 'KR', 'KOSDAQ', 'KRW', 'small', '에너지', 9270, 2900000, 0.43, 0.04, 0.76, 0.4, 1.22, 0, ['hydrogen', 'renewable', 'plant'], '수전해 장치와 그린수소 플랜트 부품을 만든다', { oil: -0.06 }),
  seed('MAT', '마이크로텍', 'US', 'NASDAQ', 'USD', 'small', '반도체', 18.6, 6200000, 0.92, 0.11, 0.43, 0.49, 1.54, 0, ['semicap', 'sensor', 'ai-server'], '미국 팹리스용 테스트 소켓과 고주파 부품을 공급한다', { memory: 0.18 }),
  seed('CYP', '사이퍼쉴드', 'US', 'NASDAQ', 'USD', 'small', '보안', 27.4, 4100000, 0.74, 0.19, 0.24, 0.58, 1.36, 0, ['security', 'cloud', 'enterprise'], '제로트러스트 보안과 API 방화벽을 제공하는 미국 보안주'),
  seed('GRO', '그로서리봇', 'US', 'NYSE', 'USD', 'small', '유통소비', 13.2, 9800000, 1.1, 0.04, 0.62, 0.39, 1.04, 0, ['retail', 'robot', 'warehouse'], '무인 식료품 매장과 물류 자동화 솔루션을 운영한다', { oil: -0.12 }),
  seed('HEL', '헬릭스온코', 'US', 'NASDAQ', 'USD', 'small', '바이오', 32.5, 3600000, 0.18, -0.14, 0.34, 0.36, 1.86, 0, ['oncology', 'clinical', 'pharma'], '초기 항암 바이오텍으로 임상 결과에 주가가 크게 흔들린다'),
  seed('BND', '브로드노드', 'US', 'NASDAQ', 'USD', 'small', '클라우드', 44.1, 2800000, 1.2, 0.16, 0.33, 0.54, 1.32, 0, ['cloud', 'edge', 'subscription'], '엣지 데이터센터와 CDN 서비스를 파는 미국 클라우드 중소형주', { memory: -0.08 }),
  seed('SPC', '스페이스캐스크', 'US', 'NYSE', 'USD', 'small', '우주항공', 9.8, 11200000, 0.31, -0.02, 0.81, 0.32, 1.92, 0, ['space', 'launch', 'defense'], '소형 발사체 재사용을 시도하는 고위험 우주항공주', { oil: -0.1 }),
  seed('LIO', '리튬오크', 'US', 'NYSE', 'USD', 'small', '소재', 22.7, 4900000, 0.66, 0.12, 0.57, 0.44, 1.46, 0, ['lithium', 'battery-material', 'mine'], '리튬 염호 개발권을 가진 미국 소재주', { lithium: 0.7 }),
  seed('PAY', '페이튜브', 'US', 'NASDAQ', 'USD', 'small', '금융', 38.9, 5200000, 1.6, 0.17, 0.5, 0.52, 1.08, 0, ['fintech', 'payment', 'consumer'], '크리에이터 결제와 소액대출을 결합한 핀테크 기업'),
  seed('DRN', '드론포트', 'US', 'NASDAQ', 'USD', 'small', '물류', 16.3, 5700000, 0.42, -0.01, 0.74, 0.35, 1.72, 0, ['drone', 'logistics', 'defense'], '드론 배송망과 군수 정찰 드론을 함께 개발한다', { oil: -0.08 }),
  seed('SOL', '솔라플레어', 'US', 'NYSE', 'USD', 'small', '에너지', 24.8, 6100000, 1.4, 0.08, 0.69, 0.46, 1.22, 0, ['renewable', 'power', 'ess'], '상업용 태양광과 ESS 프로젝트를 묶어 판매한다', { lithium: -0.18 }),
  seed('VIR', '버추얼문', 'US', 'NASDAQ', 'USD', 'small', '게임콘텐츠', 19.2, 6400000, 0.58, 0.11, 0.29, 0.46, 1.48, 0, ['game', 'ip', 'ai-tool'], 'AI NPC와 가상 콘서트 플랫폼을 운영하는 콘텐츠 기업'),
  seed('CAF', '카페로켓', 'US', 'NYSE', 'USD', 'small', '음식료', 28.1, 4300000, 1.3, 0.09, 0.58, 0.5, 0.82, 0.008, ['food', 'consumer', 'retail'], '프리미엄 커피 체인과 원두 구독 서비스를 운영한다', { freight: -0.1 }),
  seed('JPR', '재팬프리즘', 'JP', 'MOTHERS', 'JPY', 'small', 'AI소프트웨어', 920, 9300000, 0.41, 0.13, 0.24, 0.47, 1.36, 0, ['ai-agent', 'subscription', 'enterprise'], '일본 중소기업용 AI 문서 자동화 서비스를 판다', { yen: 0.03 }),
  seed('MIR', '미라이센서', 'JP', 'MOTHERS', 'JPY', 'small', '반도체', 1480, 7200000, 0.69, 0.12, 0.46, 0.5, 1.3, 0.004, ['sensor', 'semicap', 'camera'], '이미지 센서 검사장비와 광학 부품을 만드는 일본 성장주', { yen: -0.08 }),
  seed('TOK', '도쿄셀', 'JP', 'MOTHERS', 'JPY', 'small', '배터리', 1180, 8500000, 0.52, 0.05, 0.73, 0.38, 1.5, 0, ['battery', 'separator', 'ev'], '소형 전고체 셀과 전해질 첨가제를 실험하는 회사', { lithium: -0.22 }),
  seed('ZEN', '젠로보틱스', 'JP', 'MOTHERS', 'JPY', 'small', '로봇', 1740, 6700000, 0.61, 0.07, 0.54, 0.44, 1.34, 0, ['robot', 'factory', 'warehouse'], '음식점 서빙 로봇과 공장 AMR을 공급한다', { yen: -0.1 }),
  seed('KIR', '키리사메게임즈', 'JP', 'MOTHERS', 'JPY', 'small', '게임콘텐츠', 1320, 7800000, 0.48, 0.16, 0.22, 0.49, 1.4, 0, ['game', 'ip', 'mobile'], '모바일 RPG와 캐릭터 라이선스를 보유한 일본 게임사'),
  seed('HOK', '홋카이도푸드', 'JP', 'TSE', 'JPY', 'small', '음식료', 2460, 5100000, 0.92, 0.08, 0.41, 0.52, 0.72, 0.018, ['food', 'export', 'consumer'], '유제품과 냉동식품을 아시아에 수출하는 음식료 회사', { freight: -0.12, yen: -0.08 }),
  seed('KOB', '고베로지스', 'JP', 'TSE', 'JPY', 'small', '물류', 1980, 5800000, 1.0, 0.06, 0.62, 0.45, 0.86, 0.012, ['logistics', 'export', 'warehouse'], '항만 창고와 콜드체인 물류를 운영한다', { freight: 0.22, oil: -0.18 }),
  seed('NEX', '넥스파마', 'JP', 'MOTHERS', 'JPY', 'small', '바이오', 720, 10200000, 0.2, -0.09, 0.31, 0.34, 1.72, 0, ['clinical', 'pharma', 'diagnostic'], '퇴행성 질환 후보물질을 가진 일본 바이오텍'),
  seed('FJI', '후지클라우드', 'JP', 'TSE', 'JPY', 'small', '클라우드', 2840, 4600000, 1.1, 0.15, 0.36, 0.55, 0.94, 0.01, ['cloud', 'edge', 'enterprise'], '지방 제조사를 위한 프라이빗 클라우드와 백업 서비스를 판다'),
  seed('SAK', '사쿠라리테일', 'JP', 'TSE', 'JPY', 'small', '유통소비', 1680, 6900000, 1.4, 0.05, 0.59, 0.42, 0.76, 0.016, ['retail', 'consumer', 'online'], '편의점형 잡화 체인과 온라인몰을 운영한다'),
  seed('ION', '아이온막스', 'KR', 'KOSDAQ', 'KRW', 'small', '소재', 10450, 2700000, 0.58, 0.11, 0.55, 0.45, 1.36, 0, ['battery-material', 'chemical', 'separator'], '이온전도성 코팅액과 고분자 소재를 납품한다', { lithium: -0.2 }),
  seed('QNT', '퀀트브릿지', 'KR', 'KOSDAQ', 'KRW', 'small', '금융', 7210, 3900000, 0.34, 0.2, 0.19, 0.51, 1.18, 0.006, ['fintech', 'brokerage', 'ai-agent'], '로보어드바이저와 퀀트 API를 제공하는 금융기술사'),
  seed('WAV', '웨이브스튜디오', 'KR', 'KOSDAQ', 'KRW', 'small', '미디어', 5340, 5200000, 0.29, 0.1, 0.37, 0.42, 1.16, 0, ['media', 'ip', 'streaming'], '숏폼 드라마와 IP 제작을 하는 중소 미디어사'),
  seed('TRC', '트랙션AI', 'KR', 'KOSDAQ', 'KRW', 'small', 'AI소프트웨어', 16800, 2200000, 0.44, 0.18, 0.2, 0.54, 1.5, 0, ['ai-agent', 'robot', 'subscription'], '영업 자동화 AI와 콜센터 에이전트를 공급한다'),
  seed('CRB', '카본세이프', 'KR', 'KOSDAQ', 'KRW', 'small', '에너지', 11850, 2600000, 0.37, 0.03, 0.69, 0.39, 1.32, 0, ['renewable', 'carbon', 'plant'], '탄소포집 설비와 배출권 컨설팅을 제공한다'),
  seed('MDS', '메디스캔', 'KR', 'KOSDAQ', 'KRW', 'small', '바이오', 12950, 2100000, 0.31, 0.02, 0.35, 0.43, 1.42, 0, ['diagnostic', 'ai-tool', 'clinical'], 'AI 영상판독 소프트웨어와 병원 검사 서비스를 판다'),
  seed('GLA', '글라스기판', 'KR', 'KOSDAQ', 'KRW', 'small', '반도체', 27600, 1400000, 0.72, 0.09, 0.67, 0.46, 1.66, 0, ['glass-substrate', 'hbm', 'semicap'], '차세대 패키징용 유리기판을 시범 양산한다', { memory: 0.26 }),
  seed('TUR', '터빈마린', 'KR', 'KOSDAQ', 'KRW', 'small', '조선방산', 15100, 2300000, 0.69, 0.07, 0.64, 0.44, 1.06, 0.004, ['ship', 'lng', 'parts'], '선박용 터빈 부품과 LNG 펌프를 만든다', { dollar: 0.18, freight: 0.12 }),
  seed('BEE', '비콘커머스', 'KR', 'KOSDAQ', 'KRW', 'small', '유통소비', 3980, 7500000, 0.46, 0.03, 0.82, 0.34, 1.08, 0, ['retail', 'online', 'consumer'], '초저가 온라인몰을 운영하지만 재고 부담이 큰 회사'),
  seed('MOB', '모빌페이', 'KR', 'KOSDAQ', 'KRW', 'small', '금융', 10950, 2700000, 0.58, 0.12, 0.48, 0.47, 1.2, 0, ['payment', 'fintech', 'mobility'], '주차장 결제와 전기차 충전 결제를 연결한 핀테크사'),
  seed('KBO', '케이본드', 'KR', 'KOSDAQ', 'KRW', 'small', '금융', 5520, 4400000, 0.42, 0.08, 0.93, 0.33, 1.18, 0.012, ['pf', 'bond', 'brokerage'], '부동산 PF와 사모채권 중개 비중이 높은 금융주'),
  seed('JEL', '젤리팝게임즈', 'KR', 'KOSDAQ', 'KRW', 'small', '게임콘텐츠', 6720, 3900000, 0.37, 0.14, 0.21, 0.45, 1.46, 0, ['game', 'mobile', 'ip'], '캐주얼 퍼즐게임과 캐릭터 굿즈를 판매한다'),
  seed('PHO', '포톤쉴드', 'KR', 'KOSDAQ', 'KRW', 'small', '보안', 18700, 1700000, 0.36, 0.16, 0.18, 0.52, 1.36, 0, ['security', 'quantum', 'enterprise'], '양자암호 모듈과 보안칩을 개발하는 회사'),
  seed('NUR', '뉴럴팩토리', 'US', 'NASDAQ', 'USD', 'small', 'AI소프트웨어', 51.4, 3200000, 0.88, 0.12, 0.4, 0.5, 1.62, 0, ['ai-agent', 'factory', 'robot'], '제조 현장용 AI 코파일럿을 공급하는 미국 소프트웨어주', { memory: -0.12 }),
  seed('QCK', '퀵하버', 'US', 'NYSE', 'USD', 'small', '물류', 12.6, 8700000, 0.74, 0.03, 0.78, 0.34, 1.28, 0, ['logistics', 'freight', 'warehouse'], '항만 적체 해소 소프트웨어와 단거리 운송망을 운영한다', { freight: 0.32, oil: -0.22 }),
  seed('MNT', '마운틴디펜스', 'US', 'NYSE', 'USD', 'small', '조선방산', 33.2, 4200000, 1.0, 0.1, 0.52, 0.48, 1.08, 0.006, ['defense', 'radar', 'space'], '레이더 부품과 위성통신 장비를 납품하는 방산주'),
  seed('OAT', '오트밀랩스', 'US', 'NASDAQ', 'USD', 'small', '음식료', 15.1, 6600000, 0.51, 0.06, 0.61, 0.41, 0.98, 0, ['food', 'consumer', 'health'], '대체 단백질 스낵과 구독형 건강식을 판매한다', { freight: -0.08 }),
  seed('EVG', '에버그리드', 'US', 'NYSE', 'USD', 'small', '에너지', 41.7, 3900000, 1.8, 0.11, 0.65, 0.53, 0.94, 0.012, ['power', 'grid', 'renewable'], '전력망 장비와 분산형 전원 관리 시스템을 공급한다', { oil: -0.08 }),
  seed('AKI', '아키하바라칩', 'JP', 'MOTHERS', 'JPY', 'small', '반도체', 860, 11800000, 0.32, 0.08, 0.58, 0.38, 1.56, 0, ['semicap', 'sensor', 'hbm'], '중고 반도체 장비 리퍼비시와 테스트 보드를 판다', { memory: 0.18, yen: -0.06 }),
  seed('UMI', '우미바이오', 'JP', 'MOTHERS', 'JPY', 'small', '바이오', 540, 14000000, 0.12, -0.16, 0.42, 0.3, 1.9, 0, ['clinical', 'oncology', 'pharma'], '임상 초기 단계라 자금조달 뉴스에 크게 흔들린다'),
  seed('REN', '렌고에너지', 'JP', 'MOTHERS', 'JPY', 'small', '에너지', 940, 9600000, 0.33, 0.02, 0.76, 0.35, 1.38, 0, ['renewable', 'hydrogen', 'power'], '소형 수소 충전 설비와 재생에너지 EPC를 한다', { oil: -0.05 }),
  seed('SENJ', '센주모빌', 'JP', 'MOTHERS', 'JPY', 'small', '자동차', 1260, 7800000, 0.48, 0.04, 0.69, 0.37, 1.32, 0, ['ev', 'parts', 'motor'], '초소형 전기차와 배달용 삼륜차 부품을 만든다', { lithium: -0.18, yen: -0.06 }),
  seed('MATJ', '마츠리미디어', 'JP', 'MOTHERS', 'JPY', 'small', '미디어', 760, 9000000, 0.27, 0.09, 0.33, 0.43, 1.26, 0, ['media', 'streaming', 'ip'], '버추얼 탤런트와 팬덤 커머스를 운영하는 일본 미디어주'),
  seed('HIK', '히카리보안', 'JP', 'MOTHERS', 'JPY', 'small', '보안', 1540, 5600000, 0.44, 0.17, 0.25, 0.5, 1.18, 0, ['security', 'cloud', 'enterprise'], '중소기업용 엔드포인트 보안과 백업 서비스를 제공한다'),
  seed('ORI', '오리온플랜트', 'JP', 'TSE', 'JPY', 'small', '조선방산', 2180, 5200000, 0.84, 0.07, 0.64, 0.45, 0.86, 0.012, ['ship', 'plant', 'lng'], '해양 플랜트 밸브와 선박용 제어장치를 만든다', { freight: 0.14, yen: -0.08 }),
  seed('MOMO', '모모페이', 'JP', 'MOTHERS', 'JPY', 'small', '금융', 1120, 8800000, 0.52, 0.13, 0.49, 0.46, 1.12, 0, ['payment', 'fintech', 'consumer'], '지방 상점용 QR 결제와 쿠폰 서비스를 운영한다'),
  seed('KURA', '쿠라푸드', 'JP', 'TSE', 'JPY', 'small', '음식료', 2360, 4800000, 0.78, 0.07, 0.48, 0.47, 0.74, 0.014, ['food', 'consumer', 'retail'], '냉동 도시락과 편의점 PB 식품을 납품한다', { freight: -0.1 }),
]

const MACRO_EVENTS: MacroEvent[] = [
  {
    title: 'AI 투자 과열 논쟁',
    detail: '미국 장 마감 뒤 대형 클라우드 업체의 설비투자 가이던스가 엇갈렸다. HBM 수요는 유지됐지만 서버 리스 가격이 빠르게 떨어졌다는 지적도 나왔다.',
    mood: -0.004,
    fxUsd: 3,
    fxJpy: -0.03,
    sector: { 반도체: -0.012, 클라우드: -0.01, AI소프트웨어: -0.006, 소재: -0.004 },
    commodities: { memory: -3 },
  },
  {
    title: '원화 약세와 수출주 순환매',
    detail: '원화가 다시 약세로 돌아서면서 수출 대형주에는 매수세가 들어왔지만, 외국인 수급이 얇은 코스닥 중소형주는 변동성이 커졌다.',
    mood: 0.002,
    fxUsd: 14,
    fxJpy: 0.04,
    sector: { 자동차: 0.006, 조선방산: 0.008, 반도체: 0.004, 바이오: -0.004 },
    commodities: { freight: 2 },
  },
  {
    title: '리튬 가격 반등',
    detail: '중국 광산 감산설이 나오며 리튬 가격이 반등했다. 소재주는 웃었지만 배터리 셀 업체의 마진 추정치는 다시 낮아졌다.',
    mood: -0.002,
    fxUsd: 4,
    fxJpy: 0.02,
    sector: { 소재: 0.012, 배터리: -0.014, 자동차: -0.006 },
    commodities: { lithium: 6 },
  },
  {
    title: '미국 소비 둔화',
    detail: '미국 소매판매가 예상보다 부진했다. 성장주 할인율 부담은 낮아졌지만, 소비재와 광고 의존 콘텐츠 기업에는 보수적인 주문이 나왔다.',
    mood: -0.009,
    fxUsd: -5,
    fxJpy: 0.05,
    sector: { 유통소비: -0.016, 게임콘텐츠: -0.01, 금융: -0.006, 클라우드: 0.004 },
    commodities: { oil: -3 },
  },
  {
    title: '방산 수출 협상 재개',
    detail: '동유럽 특수선과 레이더 패키지 협상이 재개됐다는 보도가 나왔다. 본계약 전까지는 숫자가 비어 있지만, 선수금 보증과 부품주가 동시에 움직였다.',
    mood: 0.006,
    fxUsd: 2,
    fxJpy: 0,
    sector: { 조선방산: 0.02, 금융: 0.004, 우주항공: 0.008 },
    commodities: { freight: 1 },
  },
  {
    title: '일본 엔화 강세',
    detail: '일본은행의 정책 정상화 발언으로 엔화가 강세를 보였다. 일본 내수주는 안정적이었지만 수출 제조주의 원화 환산 매력은 둔화됐다.',
    mood: 0,
    fxUsd: -3,
    fxJpy: 0.22,
    sector: { 로봇: -0.004, 소재: -0.002, 유통소비: 0.004, 금융: 0.006 },
    commodities: {},
  },
  {
    title: '프로그램 차익실현',
    detail: '전날 급등 업종에서 프로그램 매도가 쏟아졌다. 펀더멘털 악재는 아니지만 호가가 얇은 종목은 작은 주문에도 가격이 밀렸다.',
    mood: -0.018,
    fxUsd: 5,
    fxJpy: 0.03,
    sector: { 반도체: -0.01, AI소프트웨어: -0.014, 바이오: -0.012, 게임콘텐츠: -0.01 },
    commodities: {},
  },
  {
    title: '금리 인하 기대 재점화',
    detail: '물가 지표가 안정되며 성장주 할인율 부담이 완화됐다. 다만 부채가 높은 기업에는 조달비용 하락이 실제 손익으로 확인되어야 한다는 평가가 붙었다.',
    mood: 0.012,
    fxUsd: -9,
    fxJpy: -0.04,
    sector: { AI소프트웨어: 0.012, 바이오: 0.01, 금융: 0.008, 클라우드: 0.01 },
    commodities: { oil: -1 },
  },
]

export function createInitialGame(startingCash = STARTING_CASH_KRW): GameState {
  const rng = createRng(20260518)
  const companies = buildCompanyUniverse(rng)

  return {
    day: 1,
    date: START_DATE,
    seed: rng.seed,
    companies,
    accounts: {
      regular: createAccount(startingCash),
      isa: createAccount(0),
    },
    agencies: AGENCIES.map((agency) => ({ ...agency })),
    news: [
      {
        id: 'start',
        day: 1,
        date: START_DATE,
        source: '거래소공시',
        sourceTicker: 'AMN',
        title: '모의거래소 80개 종목 동시 개장',
        detail:
          '국내 대형주 20개와 중소형주 60개, 미국과 일본 가상 종목이 함께 거래를 시작했다. 첫 자금은 50만원으로 제한되며, 해외 종목은 환율과 현지 장 분위기가 원화 평가액에 반영된다. 뉴스사의 예측 정확도도 별도 종목 가격에 영향을 준다.',
        tone: 'neutral',
        impact: 0,
        predictedDirection: 0,
        confidence: 0.6,
        truthChecked: true,
      },
    ],
    selectedTicker: 'HBM',
    watchlist: ['HBM', 'PUR', 'NVX', 'KAI', 'PUL'],
    indices: { ...STARTING_INDICES },
    fx: { ...STARTING_FX },
    commodities: { ...STARTING_COMMODITIES },
    mood: -0.004,
    policyRate: 2.75,
    sectorCycles: Object.fromEntries(SECTORS.map((sector) => [sector, 0])) as Record<Sector, number>,
    marketHaltRisk: 0.08,
  }
}

export function advanceDay(input: GameState): GameState {
  const rng = createRng(input.seed)
  const date = nextTradingDate(input.date)
  const macro = sample(MACRO_EVENTS, rng)
  const fx = nextFx(input.fx, macro, rng)
  const commodities = nextCommodities(input.commodities, macro, rng)
  const sectorCycles = nextSectorCycles(input.sectorCycles, macro, rng)
  const mood = clamp(input.mood * 0.45 + macro.mood + (rng() - 0.55) * 0.024, -0.08, 0.08)
  const companyByTicker = new Map(input.companies.map((company) => [company.ticker, company]))
  const operationalReturns: Record<string, number> = {}
  const eventNotes: NewsItem[] = []

  let companies = input.companies.map((company) => {
    if (!company.alive) {
      return { ...company, lastReturn: 0, dayVolume: 0, status: '상장폐지' }
    }

    const operation = createOperation(company, rng)
    const commodityImpact = commodityReturnImpact(company, input.commodities, commodities)
    const fxImpact = fxReturnImpact(company, input.fx, fx)
    const pressure = valuationPressure(company)
    const pullback = overheatPullback(company, rng)
    const executionEdge = (company.quality - 0.52) * 0.018 + (company.margin - 0.08) * 0.045 - company.debtRatio * 0.008
    const sectorImpact = sectorCycles[company.sector] * sectorSensitivity(company)
    const randomShock = (rng() - 0.52) * volatility(company)
    const distressDrag = company.distress >= 3 ? -0.018 * company.distress : company.distress >= 2 ? -0.012 : 0
    const rawOwnReturn =
      mood * company.beta +
      sectorImpact +
      operation.impact +
      commodityImpact +
      fxImpact +
      pressure +
      pullback +
      executionEdge +
      randomShock +
      distressDrag

    operationalReturns[company.ticker] = rawOwnReturn

    const revenue = clamp(company.revenue * (1 + operation.impact * 0.12 + sectorImpact * 0.04), 0.03, 24)
    const margin = clamp(company.margin + operation.impact * 0.07 + commodityImpact * 0.08 + (rng() - 0.5) * 0.012, -0.32, 0.42)
    const backlog = clamp(company.backlog + operation.impact * 0.18 + sectorImpact * 0.08 + (rng() - 0.5) * 0.02, 0.12, 2.2)
    const fairPrice = clamp(company.fairPrice * (1 + operation.impact * 0.09 + (margin - company.margin) * 0.2), company.price * 0.25, company.price * 3.2)
    const sentiment = clamp(company.sentiment * 0.58 + rawOwnReturn * 1.9 + mood * 0.7, -1.2, 1.2)
    const badStreak = operation.impact < -0.018 || margin < -0.06 ? company.badStreak + 1 : Math.max(0, company.badStreak - 1)
    const auditFlag = clamp(company.auditFlag + (badStreak >= 3 && rng() < 0.16 ? 1 : 0) - (operation.impact > 0.03 && rng() < 0.1 ? 1 : 0), 0, 5)

    return {
      ...company,
      revenue,
      margin,
      backlog,
      fairPrice,
      sentiment,
      badStreak,
      auditFlag,
      operation: operation.summary,
    }
  })

  companies = companies.map((company) => {
    if (!company.alive) return company

    const relationImpact = company.relations.reduce((sum, relation) => {
      const related = companyByTicker.get(relation.ticker)
      if (!related?.alive) return sum
      return sum + (operationalReturns[relation.ticker] ?? 0) * relation.weight
    }, 0)
    const rawReturn = clamp(operationalReturns[company.ticker] + relationImpact, -0.46, 0.46)
    const { lower, upper } = priceLimits(company.prevClose, company.exchange)
    const limitedPrice = clamp(company.prevClose * (1 + rawReturn), lower, upper)
    const price = snapToTick(limitedPrice, company.currency)
    const lastReturn = price / company.prevClose - 1
    const reachedLimit = Math.abs(lastReturn) > 0.295 && company.country === 'KR'
    const dayVolume = Math.round(
      company.shares *
        clamp(Math.abs(lastReturn) * (0.32 + rng() * 1.45) + 0.004 + Math.abs(company.sentiment) * 0.012, 0.002, 0.42),
    )
    const distress = nextDistress(company, lastReturn, rng)
    const status = statusFor(company, lastReturn, distress, reachedLimit)

    if (shouldWriteCompanyNews(company, lastReturn, distress, rng)) {
      eventNotes.push(createCompanyArticle(company, date, input.day + 1, lastReturn, distress, rng))
    }

    return {
      ...company,
      open: company.price,
      prevClose: price,
      price,
      lastReturn,
      dayVolume,
      distress,
      status,
      history: [...company.history.slice(-89), price],
    }
  })

  const riskResult = applyDistressEvents(companies, date, input.day + 1, rng)
  companies = riskResult.companies
  eventNotes.push(...riskResult.news)

  const accuracyResult = applyNewsAccuracy(input.news, companies, input.agencies, date, input.day + 1)
  companies = accuracyResult.companies
  eventNotes.push(...accuracyResult.news)

  const listing = maybeCreateListing(companies, input.day + 1, rng)
  if (listing) {
    companies = [...companies, listing.company]
    eventNotes.push(createListingArticle(listing.company, date, input.day + 1, rng))
  }

  const accounts = applyDividendsIfNeeded(input.day + 1, input.accounts, companies, fx)
  const indices = nextIndices(input.indices, companies)
  const macroArticle = createMacroArticle(macro, date, input.day + 1, rng)
  const selectedTicker = companies.some((company) => company.ticker === input.selectedTicker && company.alive)
    ? input.selectedTicker
    : companies.find((company) => company.alive)?.ticker ?? input.selectedTicker

  return {
    ...input,
    day: input.day + 1,
    date,
    seed: rng.seed,
    companies,
    accounts,
    agencies: accuracyResult.agencies,
    news: [macroArticle, ...eventNotes, ...input.news.map((news) => ({ ...news, truthChecked: news.truthChecked || news.day < input.day }))].slice(0, 160),
    selectedTicker,
    indices,
    fx,
    commodities,
    mood,
    sectorCycles,
    marketHaltRisk: clamp(input.marketHaltRisk * 0.78 + Math.abs(mood) * 1.5 + (rng() - 0.5) * 0.035, 0.02, 0.42),
  }
}

export function executeTrade(
  state: GameState,
  accountType: AccountType,
  side: 'buy' | 'sell',
  ticker: string,
  quantityInput: number,
): TradeResult {
  const quantity = Math.floor(quantityInput)

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { state, ok: false, message: '수량을 1주 이상 입력하세요.' }
  }

  const company = state.companies.find((item) => item.ticker === ticker)
  if (!company || !company.alive) {
    return { state, ok: false, message: '거래 가능한 종목이 아닙니다.' }
  }

  const account = state.accounts[accountType]
  const fxRate = getFxRate(company.currency, state.fx)
  const tradeValueLocal = company.price * quantity
  const tradeValueKrw = tradeValueLocal * fxRate
  const feeRate = company.country === 'KR' ? COMMISSION_RATE : FOREIGN_COMMISSION_RATE
  const fee = Math.ceil(tradeValueKrw * feeRate)
  const fxFee = company.country === 'KR' ? 0 : Math.ceil(tradeValueKrw * FX_FEE_RATE)
  const holding = account.holdings[ticker] ?? {
    quantity: 0,
    avgPrice: 0,
    currency: company.currency,
    avgFx: fxRate,
    realizedProfit: 0,
    dividends: 0,
  }

  if (side === 'buy') {
    const totalCost = tradeValueKrw + fee + fxFee
    if (account.cash < totalCost) {
      return { state, ok: false, message: '주문 가능 현금이 부족합니다.' }
    }

    const nextQuantity = holding.quantity + quantity
    const nextAvgPrice = (holding.avgPrice * holding.quantity + tradeValueLocal) / nextQuantity
    const nextAvgFx = (holding.avgFx * holding.quantity + fxRate * quantity) / nextQuantity
    const nextHolding = { ...holding, quantity: nextQuantity, avgPrice: nextAvgPrice, avgFx: nextAvgFx }
    const nextAccount = {
      ...account,
      cash: account.cash - totalCost,
      feesPaid: account.feesPaid + fee + fxFee,
      holdings: { ...account.holdings, [ticker]: nextHolding },
    }

    return {
      state: patchAccount(state, accountType, nextAccount),
      ok: true,
      message: `${company.name} ${quantity.toLocaleString('ko-KR')}주 매수 체결`,
    }
  }

  if (holding.quantity < quantity) {
    return { state, ok: false, message: '보유 수량이 부족합니다.' }
  }

  const estimate = estimateSell(state, accountType, ticker, quantity)
  const realizedProfit = estimate.profitKrw - estimate.fee - estimate.fxFee - estimate.transactionTax - estimate.capitalGainsTax
  const nextQuantity = holding.quantity - quantity
  const nextHoldings = { ...account.holdings }

  if (nextQuantity <= 0) {
    delete nextHoldings[ticker]
  } else {
    nextHoldings[ticker] = {
      ...holding,
      quantity: nextQuantity,
      realizedProfit: holding.realizedProfit + realizedProfit,
    }
  }

  const nextAccount = {
    ...account,
    cash: account.cash + estimate.netKrw,
    taxesPaid: account.taxesPaid + estimate.transactionTax + estimate.capitalGainsTax,
    foreignTaxPaid: account.foreignTaxPaid + estimate.capitalGainsTax,
    feesPaid: account.feesPaid + estimate.fee + estimate.fxFee,
    realizedProfit: account.realizedProfit + realizedProfit,
    foreignProfitThisYear:
      company.country === 'KR' ? account.foreignProfitThisYear : account.foreignProfitThisYear + Math.max(0, estimate.profitKrw),
    isaTaxableProfit: accountType === 'isa' ? account.isaTaxableProfit + Math.max(0, realizedProfit) : account.isaTaxableProfit,
    holdings: nextHoldings,
  }

  return {
    state: patchAccount(state, accountType, nextAccount),
    ok: true,
    message: `${company.name} ${quantity.toLocaleString('ko-KR')}주 매도 체결`,
  }
}

export function depositToIsa(state: GameState, amountInput: number): TradeResult {
  const amount = Math.floor(amountInput)
  const regular = state.accounts.regular
  const isa = state.accounts.isa
  const availableLimit = ISA_ANNUAL_LIMIT - isa.isaContribution

  if (amount <= 0) {
    return { state, ok: false, message: '입금액을 확인하세요.' }
  }

  if (amount > regular.cash) {
    return { state, ok: false, message: '일반 계좌 현금이 부족합니다.' }
  }

  if (amount > availableLimit) {
    return { state, ok: false, message: 'ISA 연간 납입한도를 초과합니다.' }
  }

  return {
    state: {
      ...state,
      accounts: {
        regular: { ...regular, cash: regular.cash - amount },
        isa: { ...isa, cash: isa.cash + amount, isaContribution: isa.isaContribution + amount },
      },
    },
    ok: true,
    message: `ISA에 ${formatWon(amount)} 입금`,
  }
}

export function estimateSell(state: GameState, accountType: AccountType, ticker: string, quantityInput: number): SellEstimate {
  const company = state.companies.find((item) => item.ticker === ticker)
  const account = state.accounts[accountType]
  const holding = account.holdings[ticker]
  const quantity = Math.max(0, Math.min(Math.floor(quantityInput), holding?.quantity ?? 0))

  if (!company || !holding || quantity <= 0) {
    return {
      grossLocal: 0,
      grossKrw: 0,
      fee: 0,
      transactionTax: 0,
      capitalGainsTax: 0,
      fxFee: 0,
      totalTaxAndFees: 0,
      netKrw: 0,
      profitKrw: 0,
      fxRate: company ? getFxRate(company.currency, state.fx) : 1,
    }
  }

  const fxRate = getFxRate(company.currency, state.fx)
  const grossLocal = company.price * quantity
  const grossKrw = grossLocal * fxRate
  const feeRate = company.country === 'KR' ? COMMISSION_RATE : FOREIGN_COMMISSION_RATE
  const fee = Math.ceil(grossKrw * feeRate)
  const fxFee = company.country === 'KR' ? 0 : Math.ceil(grossKrw * FX_FEE_RATE)
  const transactionTax = company.country === 'KR' ? Math.floor(grossKrw * TRANSACTION_TAX_RATE) : 0
  const costKrw = holding.avgPrice * holding.avgFx * quantity
  const profitKrw = grossKrw - costKrw
  const foreignTaxable =
    company.country === 'KR'
      ? 0
      : Math.max(0, account.foreignProfitThisYear + profitKrw - FOREIGN_GAIN_DEDUCTION) -
        Math.max(0, account.foreignProfitThisYear - FOREIGN_GAIN_DEDUCTION)
  const capitalGainsTax =
    accountType === 'isa'
      ? Math.floor(Math.max(0, profitKrw) * ISA_LOW_TAX_RATE * 0.5)
      : Math.floor(foreignTaxable * FOREIGN_CAPITAL_GAINS_TAX_RATE)
  const totalTaxAndFees = fee + fxFee + transactionTax + capitalGainsTax

  return {
    grossLocal,
    grossKrw,
    fee,
    transactionTax,
    capitalGainsTax,
    fxFee,
    totalTaxAndFees,
    netKrw: grossKrw - totalTaxAndFees,
    profitKrw,
    fxRate,
  }
}

export function resetGame(startingCash = STARTING_CASH_KRW): GameState {
  return createInitialGame(startingCash)
}

export function portfolioValue(account: Account, companies: Company[], fx: FxRates = STARTING_FX) {
  return Object.entries(account.holdings).reduce((sum, [ticker, holding]) => {
    const company = companies.find((item) => item.ticker === ticker)
    return sum + (company?.price ?? 0) * holding.quantity * getFxRate(holding.currency, fx)
  }, 0)
}

export function accountEquity(account: Account, companies: Company[], fx: FxRates = STARTING_FX) {
  return account.cash + portfolioValue(account, companies, fx)
}

export function priceLimits(basePrice: number, exchange: Exchange = 'KOSPI') {
  const limit = exchange === 'KOSPI' || exchange === 'KOSDAQ' ? 0.3 : exchange === 'MOTHERS' || exchange === 'TSE' ? 0.22 : 0.5
  const tick = tickSize(basePrice, exchange === 'NASDAQ' || exchange === 'NYSE' ? 'USD' : exchange === 'TSE' || exchange === 'MOTHERS' ? 'JPY' : 'KRW')
  const range = Math.floor((basePrice * limit) / tick) * tick

  return {
    lower: snapToTick(Math.max(tick, basePrice - range), exchange === 'NASDAQ' || exchange === 'NYSE' ? 'USD' : exchange === 'TSE' || exchange === 'MOTHERS' ? 'JPY' : 'KRW'),
    upper: snapToTick(basePrice + range, exchange === 'NASDAQ' || exchange === 'NYSE' ? 'USD' : exchange === 'TSE' || exchange === 'MOTHERS' ? 'JPY' : 'KRW'),
    range,
  }
}

export function tickSize(price: number, currency: Currency = 'KRW') {
  if (currency === 'USD') return price < 1 ? 0.001 : 0.01
  if (currency === 'JPY') return price < 1000 ? 1 : price < 5000 ? 5 : 10
  if (price < 2000) return 1
  if (price < 5000) return 5
  if (price < 20000) return 10
  if (price < 50000) return 50
  if (price < 200000) return 100
  if (price < 500000) return 500
  return 1000
}

export function snapToTick(price: number, currency: Currency = 'KRW') {
  const tick = tickSize(price, currency)
  const snapped = Math.max(tick, Math.round(price / tick) * tick)
  return currency === 'USD' ? Number(snapped.toFixed(2)) : Math.round(snapped)
}

export function getFxRate(currency: Currency, fx: FxRates) {
  if (currency === 'USD') return fx.USDKRW
  if (currency === 'JPY') return fx.JPYKRW
  return 1
}

export function formatWon(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function formatMoney(value: number, currency: Currency) {
  if (currency === 'KRW') return formatWon(value)
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'ja-JP', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(value)
}

export function formatCompactWon(value: number) {
  if (Math.abs(value) >= 100_000_000) {
    return `${(value / 100_000_000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}억`
  }

  if (Math.abs(value) >= 10_000) {
    return `${(value / 10_000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만`
  }

  return Math.round(value).toLocaleString('ko-KR')
}

export function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`
}

function seed(
  ticker: string,
  name: string,
  country: Country,
  exchange: Exchange,
  currency: Currency,
  size: CompanySize,
  sector: Sector,
  basePrice: number,
  shares: number,
  revenue: number,
  margin: number,
  debtRatio: number,
  quality: number,
  beta: number,
  dividendYield: number,
  tags: string[],
  description: string,
  commoditySensitivity: CommoditySensitivity = {},
): CompanySeed {
  return {
    ticker,
    name,
    country,
    exchange,
    currency,
    size,
    sector,
    basePrice,
    shares,
    revenue,
    margin,
    debtRatio,
    quality,
    beta,
    dividendYield,
    tags,
    description,
    commoditySensitivity,
  }
}

function createAccount(cash: number): Account {
  return {
    cash,
    holdings: {},
    taxesPaid: 0,
    feesPaid: 0,
    realizedProfit: 0,
    dividendsAfterTax: 0,
    foreignTaxPaid: 0,
    foreignProfitThisYear: 0,
    isaContribution: 0,
    isaTaxableProfit: 0,
    isaBenefitUsed: 0,
  }
}

function buildCompanyUniverse(rng: Rng) {
  const companies = [...LARGE_COMPANY_SEEDS, ...SMALL_COMPANY_SEEDS].map((item, index) => {
    const sentiment = (rng() - 0.58) * 0.22
    const price = snapToTick(item.basePrice, item.currency)

    return {
      ticker: item.ticker,
      name: item.name,
      exchange: item.exchange,
      country: item.country,
      currency: item.currency,
      size: item.size,
      sector: item.sector,
      tags: item.tags,
      description: item.description,
      price,
      prevClose: price,
      open: price,
      fairPrice: price * (0.86 + rng() * 0.3),
      shares: item.shares,
      beta: item.beta,
      revenue: item.revenue,
      margin: item.margin,
      backlog: clamp(0.78 + rng() * 0.58 + item.quality * 0.2, 0.35, 1.8),
      debtRatio: item.debtRatio,
      quality: item.quality,
      sentiment,
      dividendYield: item.dividendYield,
      relations: [],
      history: [price],
      lastReturn: 0,
      dayVolume: 0,
      status: item.size === 'small' && item.beta > 1.55 ? '변동성' : '정상',
      operation: `${item.tags[0]} 관련 일일 업무 점검`,
      distress: item.margin < -0.08 || item.debtRatio > 0.85 ? 1 : 0,
      badStreak: 0,
      auditFlag: item.debtRatio > 0.9 ? 1 : 0,
      alive: true,
      listedDay: 1 - Math.floor(index / 2),
      commoditySensitivity: item.commoditySensitivity ?? {},
    } satisfies Company
  })

  return wireRelations(companies, rng)
}

function wireRelations(companies: Company[], rng: Rng) {
  return companies.map((company) => {
    const scored = companies
      .filter((candidate) => candidate.ticker !== company.ticker)
      .map((candidate) => {
        const commonTags = company.tags.filter((tag) => candidate.tags.includes(tag)).length
        const sameSector = company.sector === candidate.sector ? 2 : 0
        const cross =
          (company.tags.includes('ev') && candidate.tags.includes('battery')) ||
          (company.tags.includes('battery') && candidate.tags.includes('ev')) ||
          (company.tags.includes('hbm') && candidate.tags.includes('ai-server')) ||
          (company.tags.includes('ship') && candidate.tags.includes('defense')) ||
          (company.tags.includes('cloud') && candidate.tags.includes('security'))
            ? 1.8
            : 0
        const countryBridge = company.country !== candidate.country && commonTags > 0 ? 0.7 : 0
        const rival = commonTags >= 2 && company.country === candidate.country && company.size === candidate.size ? -0.55 : 0

        return {
          candidate,
          score: commonTags * 1.2 + sameSector + cross + countryBridge + rival + rng() * 0.7,
          rival,
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, company.size === 'large' ? 7 : 5)

    return {
      ...company,
      relations: scored.map(({ candidate, rival }) => ({
        ticker: candidate.ticker,
        weight: Number(((rival < 0 ? -1 : 1) * (0.018 + rng() * (company.size === 'large' ? 0.045 : 0.07))).toFixed(3)),
        reason: relationReason(company, candidate, rival < 0),
      })),
    }
  })
}

function relationReason(company: Company, candidate: Company, rival: boolean) {
  if (rival) return '동일 시장 경쟁'
  if (company.tags.includes('ev') && candidate.tags.includes('battery')) return '배터리 조달'
  if (company.tags.includes('battery') && candidate.tags.includes('battery-material')) return '소재 단가'
  if (company.tags.includes('hbm') && candidate.tags.includes('ai-server')) return 'AI 서버 수요'
  if (company.tags.includes('semicap') && candidate.tags.includes('hbm')) return '장비 발주'
  if (company.tags.includes('cloud') && candidate.tags.includes('security')) return '클라우드 보안 투자'
  if (company.tags.includes('ship') && candidate.tags.includes('defense')) return '방산 수주 기대'
  if (company.country !== candidate.country) return '해외 동종업계 온도'
  return `${candidate.sector} 밸류체인`
}

function nextFx(fx: FxRates, macro: MacroEvent, rng: Rng): FxRates {
  return {
    USDKRW: Math.round(clamp(fx.USDKRW + macro.fxUsd + (rng() - 0.5) * 18, 1180, 1580)),
    JPYKRW: Number(clamp(fx.JPYKRW + macro.fxJpy + (rng() - 0.5) * 0.18, 7.2, 11.2).toFixed(2)),
  }
}

function nextCommodities(input: CommodityState, macro: MacroEvent, rng: Rng): CommodityState {
  return {
    lithium: clamp(input.lithium * 0.985 + 1.5 + (macro.commodities.lithium ?? 0) + (rng() - 0.5) * 5, 45, 190),
    oil: clamp(input.oil * 0.99 + 1 + (macro.commodities.oil ?? 0) + (rng() - 0.5) * 4, 55, 160),
    memory: clamp(input.memory * 0.99 + 1 + (macro.commodities.memory ?? 0) + (rng() - 0.5) * 6, 40, 210),
    freight: clamp(input.freight * 0.99 + 1 + (macro.commodities.freight ?? 0) + (rng() - 0.5) * 4, 55, 180),
  }
}

function nextSectorCycles(input: Record<Sector, number>, macro: MacroEvent, rng: Rng): Record<Sector, number> {
  return Object.fromEntries(
    SECTORS.map((sector) => [
      sector,
      clamp((input[sector] ?? 0) * 0.62 + (macro.sector[sector] ?? 0) + (rng() - 0.53) * 0.018, -0.08, 0.08),
    ]),
  ) as Record<Sector, number>
}

function createOperation(company: Company, rng: Rng) {
  const templates = operationTemplates(company)
  const base = rng() - 0.53 + (company.quality - 0.52) * 0.26 + company.margin * 0.14 - company.debtRatio * 0.09 - company.distress * 0.035
  const impact = clamp(base * (company.size === 'large' ? 0.065 : 0.095), -0.16, 0.14)
  const good = impact > 0.012
  const bad = impact < -0.012
  const pool = good ? templates.good : bad ? templates.bad : templates.mixed

  return { impact, summary: sample(pool, rng) }
}

function operationTemplates(company: Company) {
  const subject = company.tags[0] ?? company.sector

  return {
    good: [
      `${subject} 프로젝트에서 납기와 원가가 동시에 개선됐다`,
      `주요 고객사 검증이 예상보다 빨리 끝나며 다음 분기 매출 인식 가능성이 커졌다`,
      `재고 부담을 낮춘 상태에서 신규 주문 문의가 늘었다`,
    ],
    mixed: [
      `${subject} 사업부의 매출은 버텼지만 원가와 환율 변수가 함께 커졌다`,
      `신규 계약 논의는 이어졌지만 확정 공시 전까지 실적 추정 폭이 넓어졌다`,
      `출하는 정상화됐지만 일부 고객사의 재고 조정이 확인됐다`,
    ],
    bad: [
      `${subject} 라인에서 품질 재검사가 발생해 납품 일정이 밀렸다`,
      `원재료와 외주비 부담이 동시에 올라 단기 마진 훼손 우려가 커졌다`,
      `주요 고객사의 발주 속도가 늦어지며 재고 회전율이 악화됐다`,
    ],
  }
}

function commodityReturnImpact(company: Company, before: CommodityState, after: CommodityState) {
  return (Object.keys(after) as Array<keyof CommodityState>).reduce((sum, key) => {
    const sensitivity = company.commoditySensitivity[key] ?? 0
    const change = (after[key] - before[key]) / before[key]
    return sum + change * sensitivity
  }, 0)
}

function fxReturnImpact(company: Company, before: FxRates, after: FxRates) {
  if (company.country === 'KR') {
    return ((after.USDKRW - before.USDKRW) / before.USDKRW) * (company.commoditySensitivity.dollar ?? 0)
  }

  if (company.currency === 'USD') {
    return ((after.USDKRW - before.USDKRW) / before.USDKRW) * 0.12
  }

  return ((after.JPYKRW - before.JPYKRW) / before.JPYKRW) * (company.commoditySensitivity.yen ?? 0.12)
}

function valuationPressure(company: Company) {
  const gap = company.price / Math.max(0.01, company.fairPrice) - 1
  return clamp(-gap * 0.042, -0.08, 0.08)
}

function overheatPullback(company: Company, rng: Rng) {
  const history = company.history.slice(-5)
  if (history.length < 4) return 0
  const fiveDayReturn = history[history.length - 1] / history[0] - 1
  if (fiveDayReturn > 0.18 && rng() < 0.5) return -0.035 - rng() * 0.055
  if (fiveDayReturn < -0.22 && rng() < 0.38) return 0.025 + rng() * 0.05
  if (company.sentiment > 0.68 && rng() < 0.34) return -0.02 - rng() * 0.04
  return 0
}

function sectorSensitivity(company: Company) {
  const base =
    company.sector === '반도체' || company.sector === 'AI소프트웨어' || company.sector === '바이오'
      ? 0.84
      : company.sector === '금융' || company.sector === '음식료'
        ? 0.42
        : 0.62
  return company.size === 'small' ? base * 1.18 : base
}

function volatility(company: Company) {
  const exchangeVol = company.exchange === 'KOSDAQ' || company.exchange === 'MOTHERS' ? 0.098 : company.country === 'KR' ? 0.064 : 0.078
  return exchangeVol + (1 - company.quality) * 0.045 + company.debtRatio * 0.026 + company.distress * 0.012
}

function nextDistress(company: Company, lastReturn: number, rng: Rng) {
  let distress = company.distress
  const score =
    (company.margin < -0.08 ? 2 : company.margin < 0 ? 1 : 0) +
    (company.debtRatio > 0.86 ? 2 : company.debtRatio > 0.68 ? 1 : 0) +
    (company.badStreak >= 4 ? 2 : company.badStreak >= 2 ? 1 : 0) +
    company.auditFlag +
    (lastReturn < -0.12 ? 1 : 0)

  if (score >= 5 && rng() < 0.34) distress += 1
  if (score <= 1 && company.margin > 0.04 && rng() < 0.24) distress -= 1

  return clamp(distress, 0, 5)
}

function statusFor(company: Company, lastReturn: number, distress: number, reachedLimit: boolean) {
  if (!company.alive) return '상장폐지'
  if (distress >= 5) return '거래정지위험'
  if (distress >= 4) return '비상상황'
  if (distress >= 3) return '관리종목'
  if (distress >= 2) return '투자주의'
  if (reachedLimit && lastReturn > 0) return '상한가'
  if (reachedLimit && lastReturn < 0) return '하한가'
  if (Math.abs(lastReturn) > 0.13) return 'VI주의'
  if (company.sentiment > 0.58) return '과열주의'
  return '정상'
}

function shouldWriteCompanyNews(company: Company, lastReturn: number, distress: number, rng: Rng) {
  return Math.abs(lastReturn) > 0.055 || distress >= 3 || company.badStreak >= 3 || rng() < (company.size === 'large' ? 0.13 : 0.045)
}

function createMacroArticle(macro: MacroEvent, date: string, day: number, rng: Rng): NewsItem {
  const agency = sample(AGENCIES, rng)
  const predictedDirection = macro.mood > 0.006 ? 1 : macro.mood < -0.006 ? -1 : 0
  const detailByStance = agency.stance === '성장'
    ? `${macro.detail} 펄스와이어는 이번 재료가 장중에는 과장되더라도 수급이 붙으면 테마가 이틀 이상 이어질 수 있다고 봤다. 다만 숫자로 확인되지 않은 발언과 실제 계약 사이에는 간극이 있어 단기 추격 매수에는 변동성 비용이 붙는다.`
    : agency.stance === '탐사'
      ? `${macro.detail} 레저스코프는 관련 기업의 매출 인식 시점, 재고자산 증가율, 차입금 만기 구조가 서로 맞는지 확인해야 한다고 지적했다. 같은 뉴스라도 현금흐름이 약한 기업에는 오히려 악재가 될 수 있다는 해석이다.`
      : `${macro.detail} 앵커마켓은 당장 방향을 단정하기보다 대형주와 중소형주의 체력 차이를 봐야 한다고 분석했다. 실적 추정치가 같이 올라가지 않는 주가 상승은 다음 거래일 차익실현 매물에 취약하다.`

  return {
    id: `${day}-macro-${agency.id}`,
    day,
    date,
    source: agency.name,
    sourceTicker: agency.ticker,
    title: `${macro.title}, 업종별 해석은 엇갈려`,
    detail: detailByStance,
    tone: predictedDirection > 0 ? 'good' : predictedDirection < 0 ? 'bad' : 'neutral',
    impact: macro.mood,
    predictedDirection,
    confidence: agency.reliability,
    truthChecked: false,
  }
}

function createCompanyArticle(company: Company, date: string, day: number, lastReturn: number, distress: number, rng: Rng): NewsItem {
  const agency = chooseAgencyFor(company, distress, rng)
  const ambiguous = rng() < 0.36
  const predictedDirection = ambiguous ? (rng() < 0.5 ? 1 : -1) : lastReturn > 0.025 ? 1 : lastReturn < -0.025 ? -1 : 0
  const titlePrefix =
    distress >= 4
      ? `${company.name} 비상상황`
      : distress >= 3
        ? `${company.name} 관리종목 우려`
        : lastReturn > 0
          ? `${company.name} 강세 배경`
          : `${company.name} 약세 배경`
  const detail = articleBody(company, agency, lastReturn, distress, ambiguous)

  return {
    id: `${day}-${company.ticker}-${agency.id}-${Math.round(rng() * 100000)}`,
    day,
    date,
    source: agency.name,
    sourceTicker: agency.ticker,
    ticker: company.ticker,
    title: `${titlePrefix}, ${company.operation}`,
    detail,
    tone: distress >= 4 ? 'crisis' : lastReturn > 0.03 ? 'good' : lastReturn < -0.03 ? 'bad' : 'neutral',
    impact: lastReturn,
    predictedDirection,
    confidence: agency.reliability * (ambiguous ? 0.75 : 1),
    truthChecked: false,
  }
}

function chooseAgencyFor(company: Company, distress: number, rng: Rng) {
  if (distress >= 3 || company.auditFlag >= 2) return AGENCIES[2]
  if (company.beta > 1.35 || company.sector === 'AI소프트웨어' || company.sector === '바이오') return rng() < 0.65 ? AGENCIES[1] : AGENCIES[0]
  return rng() < 0.68 ? AGENCIES[0] : sample(AGENCIES, rng)
}

function articleBody(company: Company, agency: NewsAgency, lastReturn: number, distress: number, ambiguous: boolean) {
  const move = lastReturn > 0 ? '상승' : '하락'
  const base = `${company.name} 주가는 ${formatPercent(lastReturn)} ${move}했다. 표면상 재료는 "${company.operation}"이지만, 시장은 이 문장을 곧장 실적으로 번역하지 않고 있다. 매출 체력은 ${company.revenue.toFixed(2)}조, 영업마진은 ${(company.margin * 100).toFixed(1)}%, 부채비율은 ${(company.debtRatio * 100).toFixed(0)}% 수준이다.`
  const stance =
    agency.stance === '성장'
      ? `펄스와이어는 수급이 붙는 구간에서는 펀더멘털보다 기대가 먼저 움직인다고 봤다. 다만 오늘의 주문잔고가 실제 매출로 넘어가는 데 시간이 걸리면 다음날 원재료나 납기 뉴스 하나에도 가격이 되돌려질 수 있다.`
      : agency.stance === '탐사'
        ? `레저스코프는 현금흐름과 재고 회전율을 더 봐야 한다고 적었다. 특히 감사 플래그 ${company.auditFlag}단계와 연속 악재 ${company.badStreak}일이 겹치면 호재성 보도라도 자금조달 리스크를 가릴 수 없다.`
        : `앵커마켓은 업종 대표주와 부품주의 온도 차이를 강조했다. 관련주가 함께 움직이더라도 실제 계약 상대, 환율 민감도, 원재료 단가가 다르면 다음 거래일 방향은 갈릴 수 있다는 분석이다.`
  const risk =
    distress >= 4
      ? `거래소 주변에서는 비상 점검이라는 표현까지 나왔다. 다만 곧바로 파산을 뜻하지는 않는다. 채권단 워크아웃, 유상증자, 자산 매각이 성공하면 급락 뒤 급반등도 가능한 구간이다.`
      : ambiguous
        ? `흥미로운 점은 같은 숫자를 놓고 해석이 갈린다는 것이다. 한쪽은 선반영을 말하고, 다른 쪽은 아직 공시되지 않은 단가 인하를 의심한다.`
        : `단기 방향은 확인됐지만 밸류체인 전파가 얼마나 이어질지는 아직 열려 있다.`

  return `${base} ${stance} ${risk}`
}

function applyDistressEvents(companies: Company[], date: string, day: number, rng: Rng) {
  const news: NewsItem[] = []
  const nextCompanies = companies.map((company) => {
    if (!company.alive || company.distress < 4) return company

    const rescueChance = company.quality * 0.18 + (company.size === 'large' ? 0.14 : 0.04) + (company.sector === '조선방산' ? 0.08 : 0)
    const bankruptcyRisk = company.distress >= 5 && company.badStreak >= 5 && company.debtRatio > 0.76 ? 0.045 + company.auditFlag * 0.018 : 0

    if (rng() < bankruptcyRisk) {
      const price = snapToTick(company.price * (0.08 + rng() * 0.12), company.currency)
      const delisted = { ...company, alive: false, price, prevClose: price, lastReturn: price / company.prevClose - 1, status: '상장폐지', history: [...company.history.slice(-89), price] }
      news.push(createCrisisArticle(delisted, date, day, '상장폐지 심사와 거래정지가 동시에 공시됐다. 악재가 여러 차례 누적된 뒤에야 발생한 사건이라 시장 전체 충격은 제한적이지만, 같은 업종의 고부채 기업에는 신용 스프레드 부담이 번졌다.', 'crisis', rng))
      return delisted
    }

    if (rng() < rescueChance) {
      const method = sample(['채권단 워크아웃', '전환사채 리파이낸싱', '핵심 자산 매각', '전략적 투자자 유치', '정부 조달 물량 우선 배정'], rng)
      const rebound = 0.08 + rng() * 0.16
      const price = snapToTick(clamp(company.price * (1 + rebound), priceLimits(company.prevClose, company.exchange).lower, priceLimits(company.prevClose, company.exchange).upper), company.currency)
      const rescued = {
        ...company,
        price,
        prevClose: price,
        lastReturn: price / company.prevClose - 1,
        debtRatio: clamp(company.debtRatio - 0.08 - rng() * 0.08, 0.08, 1.1),
        margin: clamp(company.margin + 0.02 + rng() * 0.03, -0.28, 0.42),
        distress: Math.max(2, company.distress - 2),
        status: '구제진행',
        badStreak: Math.max(0, company.badStreak - 2),
        history: [...company.history.slice(-89), price],
      }
      news.push(createCrisisArticle(rescued, date, day, `${method} 방안이 공개됐다. 아직 정상화가 확정된 것은 아니지만 단기 유동성 공백이 줄어들 수 있다는 기대가 먼저 가격에 반영됐다.`, 'rescue', rng))
      return rescued
    }

    if (rng() < 0.16) {
      news.push(createCrisisArticle(company, date, day, '거래소 조회공시 요구가 나왔다. 회사는 확정된 사항이 없다고 답했지만, 시장은 자금조달 일정과 단기차입금 만기를 다시 계산하기 시작했다.', 'crisis', rng))
    }

    return company
  })

  return { companies: nextCompanies, news }
}

function createCrisisArticle(company: Company, date: string, day: number, detail: string, tone: NewsTone, rng: Rng): NewsItem {
  const agency = AGENCIES[2]

  return {
    id: `${day}-${company.ticker}-${tone}-${Math.round(rng() * 100000)}`,
    day,
    date,
    source: agency.name,
    sourceTicker: agency.ticker,
    ticker: company.ticker,
    title: `${company.name} ${tone === 'rescue' ? '구제 절차' : '비상 리스크'} 부각`,
    detail,
    tone,
    impact: company.lastReturn,
    predictedDirection: tone === 'rescue' ? 1 : -1,
    confidence: 0.72,
    truthChecked: false,
  }
}

function applyNewsAccuracy(news: NewsItem[], companies: Company[], agencies: NewsAgency[], date: string, day: number) {
  const nextAgencies = agencies.map((agency) => ({ ...agency }))
  const agencyShock = new Map<string, number>()
  const notes: NewsItem[] = []

  for (const article of news) {
    if (article.truthChecked || !article.ticker || article.predictedDirection === 0 || article.day >= day - 1) continue

    const target = companies.find((company) => company.ticker === article.ticker)
    const agency = nextAgencies.find((item) => item.name === article.source)
    if (!target || !agency) continue

    const actualDirection = target.lastReturn > 0.015 ? 1 : target.lastReturn < -0.015 ? -1 : 0
    const correct = actualDirection === article.predictedDirection
    agency.accuracy = clamp(agency.accuracy * 0.92 + (correct ? 0.08 : 0), 0.18, 0.86)
    agency.reliability = clamp(agency.reliability + (correct ? 0.012 : -0.025), 0.22, 0.88)
    agency.misses = correct ? Math.max(0, agency.misses - 1) : agency.misses + 1
    agencyShock.set(agency.ticker, (agencyShock.get(agency.ticker) ?? 0) + (correct ? 0.006 : -0.018))

    if (!correct && agency.misses >= 3) {
      notes.push({
        id: `${day}-${agency.ticker}-miss`,
        day,
        date,
        source: '거래소공시',
        sourceTicker: agency.ticker,
        ticker: agency.ticker,
        title: `${agency.name} 예측 신뢰도 흔들림`,
        detail: `${agency.name}의 최근 기사 방향성이 실제 주가와 여러 차례 어긋나며 구독 유지율과 광고 단가에 대한 의심이 커졌다. 뉴스 회사도 상장사이기 때문에 오보는 곧 실적 리스크로 번진다.`,
        tone: 'bad',
        impact: -0.018,
        predictedDirection: -1,
        confidence: 0.68,
        truthChecked: false,
      })
    }
  }

  const nextCompanies = companies.map((company) => {
    const shock = agencyShock.get(company.ticker) ?? 0
    if (!shock || !company.alive) return company

    const price = snapToTick(company.price * (1 + shock), company.currency)
    return {
      ...company,
      price,
      prevClose: price,
      lastReturn: price / company.open - 1,
      sentiment: clamp(company.sentiment + shock * 4, -1.2, 1.2),
      status: shock < 0 ? '신뢰도하락' : company.status,
      history: [...company.history.slice(0, -1), price],
    }
  })

  return { companies: nextCompanies, agencies: nextAgencies, news: notes }
}

function maybeCreateListing(companies: Company[], day: number, rng: Rng) {
  if (day < 12 || day % 13 !== 0 || rng() > 0.42 || companies.length >= 96) return null

  const sector = sample(SECTORS.filter((item) => item !== '미디어'), rng)
  const country = sample(['KR', 'US', 'JP'] as Country[], rng)
  const currency: Currency = country === 'US' ? 'USD' : country === 'JP' ? 'JPY' : 'KRW'
  const exchange: Exchange = country === 'US' ? 'NASDAQ' : country === 'JP' ? 'MOTHERS' : 'KOSDAQ'
  const ticker = `${country}${sector.slice(0, 1)}${day}`.replace(/[^\dA-Z]/g, '').slice(0, 5) || `IPO${day}`
  const basePrice = currency === 'USD' ? 7 + rng() * 34 : currency === 'JPY' ? 420 + rng() * 1900 : 2200 + rng() * 18000
  const item = seed(
    ticker,
    `${sector}새싹${day}`,
    country,
    exchange,
    currency,
    'small',
    sector,
    basePrice,
    Math.round(1800000 + rng() * 6200000),
    0.12 + rng() * 0.68,
    -0.08 + rng() * 0.22,
    0.22 + rng() * 0.6,
    0.32 + rng() * 0.26,
    1.1 + rng() * 0.75,
    0,
    [sector, 'ipo', country.toLowerCase()],
    `${sector} 분야에서 막 상장한 신생 기업. 공모가 논쟁과 보호예수 물량이 주가 변동성을 키운다.`,
  )
  const price = snapToTick(item.basePrice, currency)
  const company: Company = {
    ...item,
    price,
    prevClose: price,
    open: price,
    fairPrice: price * (0.8 + rng() * 0.4),
    backlog: 0.65 + rng() * 0.55,
    sentiment: 0.16 + rng() * 0.22,
    relations: [],
    history: [price],
    lastReturn: 0,
    dayVolume: 0,
    status: '신규상장',
    operation: '상장 후 첫 기관 미팅',
    distress: 0,
    badStreak: 0,
    auditFlag: 0,
    alive: true,
    listedDay: day,
    commoditySensitivity: item.commoditySensitivity ?? {},
  }

  return { company: wireRelations([...companies, company], rng).find((candidate) => candidate.ticker === company.ticker) ?? company }
}

function createListingArticle(company: Company, date: string, day: number, rng: Rng): NewsItem {
  const agency = rng() < 0.58 ? AGENCIES[1] : AGENCIES[0]

  return {
    id: `${day}-${company.ticker}-listing`,
    day,
    date,
    source: agency.name,
    sourceTicker: agency.ticker,
    ticker: company.ticker,
    title: `${company.name} 신규 상장, 공모가 해석 엇갈려`,
    detail: `${company.name}이 ${company.exchange}에 신규 상장했다. 성장 스토리는 뚜렷하지만 아직 매출 규모가 작고 보호예수 해제 일정이 남아 있다. ${agency.name}은 첫날 거래대금보다 기관 의무보유 확약과 다음 실적 발표의 매출 인식 시점을 더 봐야 한다고 전했다.`,
    tone: 'listing',
    impact: 0,
    predictedDirection: rng() < 0.55 ? 1 : -1,
    confidence: agency.reliability,
    truthChecked: false,
  }
}

function applyDividendsIfNeeded(
  day: number,
  accounts: Record<AccountType, Account>,
  companies: Company[],
  fx: FxRates,
): Record<AccountType, Account> {
  if (day % 21 !== 0) return accounts

  const nextAccounts = structuredClone(accounts)

  for (const company of companies) {
    if (!company.alive || company.dividendYield <= 0 || company.margin <= 0.035) continue

    const dividendPerShare = Math.max(0, company.price * company.dividendYield * 0.25)
    const fxRate = getFxRate(company.currency, fx)
    if (dividendPerShare <= 0) continue

    for (const accountType of ['regular', 'isa'] as const) {
      const account = nextAccounts[accountType]
      const holding = account.holdings[company.ticker]
      if (!holding || holding.quantity <= 0) continue

      const grossDividend = dividendPerShare * holding.quantity * fxRate
      const rate = company.country === 'KR' ? DIVIDEND_TAX_RATE : 0.15
      const tax =
        accountType === 'isa'
          ? Math.floor(Math.max(0, grossDividend + account.isaTaxableProfit - ISA_TAX_FREE_LIMIT) * ISA_LOW_TAX_RATE)
          : Math.floor(grossDividend * rate)
      const netDividend = grossDividend - tax

      account.cash += netDividend
      account.taxesPaid += tax
      account.dividendsAfterTax += netDividend
      account.isaTaxableProfit += accountType === 'isa' ? grossDividend : 0
      holding.dividends += netDividend
    }
  }

  return nextAccounts
}

function patchAccount(state: GameState, accountType: AccountType, account: Account): GameState {
  return {
    ...state,
    accounts: {
      ...state.accounts,
      [accountType]: account,
    },
  }
}

function nextIndices(previous: MarketIndices, companies: Company[]) {
  return {
    kospi: indexLevel(previous.kospi, companies.filter((company) => company.exchange === 'KOSPI')),
    kosdaq: indexLevel(previous.kosdaq, companies.filter((company) => company.exchange === 'KOSDAQ')),
    nasdaq: indexLevel(previous.nasdaq, companies.filter((company) => company.exchange === 'NASDAQ')),
    spSmall: indexLevel(previous.spSmall, companies.filter((company) => company.exchange === 'NYSE')),
    nikkei: indexLevel(previous.nikkei, companies.filter((company) => company.exchange === 'TSE')),
    topix: indexLevel(previous.topix, companies.filter((company) => company.exchange === 'MOTHERS')),
  }
}

function indexLevel(previous: number, companies: Company[]) {
  if (companies.length === 0) return previous

  const weightedReturn =
    companies.reduce((sum, company) => {
      const marketCap = company.price * company.shares
      return sum + company.lastReturn * marketCap
    }, 0) /
    Math.max(
      1,
      companies.reduce((sum, company) => sum + company.price * company.shares, 0),
    )

  return Number((previous * (1 + clamp(weightedReturn, -0.09, 0.09))).toFixed(2))
}

function nextTradingDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  do {
    date.setDate(date.getDate() + 1)
  } while (date.getDay() === 0 || date.getDay() === 6)

  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')
  const nextDay = String(date.getDate()).padStart(2, '0')

  return `${nextYear}-${nextMonth}-${nextDay}`
}

function sample<T>(items: T[], rng: Rng) {
  return items[Math.floor(rng() * items.length)]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

type Rng = (() => number) & { seed: number }

function createRng(initialSeed: number): Rng {
  let seedValue = initialSeed >>> 0
  const rng = (() => {
    seedValue = (seedValue * 1664525 + 1013904223) >>> 0
    rng.seed = seedValue
    return seedValue / 4294967296
  }) as Rng
  rng.seed = seedValue
  return rng
}

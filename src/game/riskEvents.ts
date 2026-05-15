export type Exchange = 'KOSPI' | 'KOSDAQ'

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

export type NewsTone = 'good' | 'bad' | 'neutral' | 'limit'

export interface Relation {
  ticker: string
  weight: number
  reason: string
}

export interface Company {
  ticker: string
  name: string
  exchange: Exchange
  sector: Sector
  description: string
  price: number
  prevClose: number
  open: number
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
}

export interface NewsItem {
  id: string
  day: number
  date: string
  ticker?: string
  title: string
  detail: string
  tone: NewsTone
  impact: number
}

export type RiskSeverity = 'stable' | 'watch' | 'distress' | 'critical'

export type DistressReasonCode =
  | 'negative_margin'
  | 'high_debt'
  | 'low_cash_runway'
  | 'consecutive_bad_news'
  | 'audit_flag'
  | 'thin_backlog'
  | 'poor_quality'
  | 'market_stress'

export type RescuePath =
  | 'creditor_workout'
  | 'rights_offering'
  | 'government_procurement'
  | 'asset_sale'
  | 'white_knight_investment'

export type RescueOutcome = 'success' | 'partial' | 'failed'

export type RiskOutcomeKind =
  | 'none'
  | 'distress_watch'
  | 'rescue_success'
  | 'rescue_partial'
  | 'rescue_failed'
  | 'trading_halt'
  | 'delisting_review'
  | 'bankruptcy'

export type NewListingTheme =
  | 'ai_memory'
  | 'battery_recycling'
  | 'defense_robotics'
  | 'digital_therapeutics'
  | 'green_grid'
  | 'game_platform'

export type RandomSource = () => number

export interface RiskEventContext {
  day: number
  date: string
  mood: number
  policyRate: number
  news: readonly NewsItem[]
}

export interface NewListingContext extends RiskEventContext {
  companies: readonly Company[]
}

export interface DistressReason {
  code: DistressReasonCode
  label: string
  score: number
}

export interface DistressAssessment {
  ticker: string
  score: number
  severity: RiskSeverity
  reasons: DistressReason[]
  cashRunwayMonths: number
  consecutiveBadNews: number
  auditFlagCount: number
  hardFailureCount: number
  rescueCandidate: boolean
  delistingReviewCandidate: boolean
  bankruptcyCandidate: boolean
}

export interface RescueDecision {
  path: RescuePath
  label: string
  outcome: RescueOutcome
  successProbability: number
  roll: number
  detail: string
  patch: CompanyRiskPatch
  priceImpact: number
}

export interface CompanyRiskPatch {
  margin?: number
  backlog?: number
  debtRatio?: number
  quality?: number
  sentiment?: number
  dividendYield?: number
  status?: string
  operation?: string
}

export interface CompanyRiskResolution {
  kind: RiskOutcomeKind
  assessment: DistressAssessment
  rescue?: RescueDecision
  patch: CompanyRiskPatch
  priceImpact: number
  delist: boolean
  title?: string
  detail?: string
  tone: NewsItem['tone']
}

export interface NewListingDecision {
  listed: boolean
  company?: Company
  newsItem?: NewsItem
  probability: number
  roll: number
  reason: string
}

interface RescueProfile {
  label: string
  baseProbability: number
  successDetail: string
  partialDetail: string
  failedDetail: string
  successPatch: CompanyRiskPatch
  partialPatch: CompanyRiskPatch
  failedPatch: CompanyRiskPatch
  successImpact: number
  partialImpact: number
  failedImpact: number
}

interface ListingTemplate {
  theme: NewListingTheme
  ticker: string
  name: string
  exchange: Exchange
  sector: Sector
  description: string
  basePrice: number
  shares: number
  beta: number
  revenue: number
  margin: number
  backlog: number
  debtRatio: number
  quality: number
  sentiment: number
  dividendYield: number
  operation: string
}

const AUDIT_KEYWORDS = [
  '감사',
  '의견거절',
  '한정',
  '계속기업',
  '횡령',
  '배임',
  '분식',
  '회계',
  '관리종목',
  'audit',
  'auditor',
  'going concern',
]

const RESCUE_PROFILES: Record<RescuePath, RescueProfile> = {
  creditor_workout: {
    label: '채권단 워크아웃',
    baseProbability: 0.48,
    successDetail: '채권단이 만기 연장과 이자 유예에 합의해 단기 유동성 압박을 낮췄다.',
    partialDetail: '채권단 지원은 받았지만 일부 차입금은 높은 금리로 재조정됐다.',
    failedDetail: '채권단 협의가 결렬되며 차입금 상환 부담이 그대로 남았다.',
    successPatch: { debtRatio: -0.18, sentiment: 0.12, quality: 0.03, status: '워크아웃' },
    partialPatch: { debtRatio: -0.07, sentiment: -0.02, status: '재무약정' },
    failedPatch: { debtRatio: 0.05, sentiment: -0.18, quality: -0.03, status: '유동성위험' },
    successImpact: 0.08,
    partialImpact: -0.03,
    failedImpact: -0.13,
  },
  rights_offering: {
    label: '유상증자',
    baseProbability: 0.42,
    successDetail: '주주배정 유상증자가 청약률을 채우며 운영자금 공백을 메웠다.',
    partialDetail: '유상증자는 성사됐지만 할인율이 커 주가 희석 부담이 남았다.',
    failedDetail: '유상증자 청약이 미달하며 추가 자금 조달 계획이 흔들렸다.',
    successPatch: { debtRatio: -0.12, sentiment: 0.06, quality: 0.02, dividendYield: -0.003, status: '자본확충' },
    partialPatch: { debtRatio: -0.05, sentiment: -0.08, dividendYield: -0.004, status: '희석부담' },
    failedPatch: { sentiment: -0.2, quality: -0.02, status: '증자실패' },
    successImpact: 0.035,
    partialImpact: -0.08,
    failedImpact: -0.16,
  },
  government_procurement: {
    label: '정부 조달계약',
    baseProbability: 0.36,
    successDetail: '정부 조달 물량이 확정되며 공장 가동률과 수주잔고가 동시에 개선됐다.',
    partialDetail: '조달 우선협상 지위는 얻었지만 본계약 규모는 기대보다 작았다.',
    failedDetail: '정부 조달 심사에서 탈락해 수주 공백을 메우지 못했다.',
    successPatch: { backlog: 0.22, margin: 0.025, sentiment: 0.16, status: '조달수혜' },
    partialPatch: { backlog: 0.08, sentiment: 0.02, status: '조달협상' },
    failedPatch: { backlog: -0.08, sentiment: -0.14, status: '수주공백' },
    successImpact: 0.1,
    partialImpact: 0.01,
    failedImpact: -0.1,
  },
  asset_sale: {
    label: '비핵심 자산 매각',
    baseProbability: 0.55,
    successDetail: '비핵심 자산 매각 대금이 들어오며 차입금 상환 여력이 생겼다.',
    partialDetail: '자산 매각은 진행됐지만 가격이 낮아 유동성 개선 폭이 제한됐다.',
    failedDetail: '자산 매각 협상이 가격 이견으로 중단됐다.',
    successPatch: { debtRatio: -0.15, margin: 0.01, quality: -0.01, sentiment: 0.08, status: '자산매각' },
    partialPatch: { debtRatio: -0.06, quality: -0.02, sentiment: -0.03, status: '구조조정' },
    failedPatch: { sentiment: -0.13, quality: -0.02, status: '매각불발' },
    successImpact: 0.055,
    partialImpact: -0.025,
    failedImpact: -0.11,
  },
  white_knight_investment: {
    label: '백기사 투자',
    baseProbability: 0.3,
    successDetail: '전략적 투자자가 지분 투자와 사업 제휴를 묶어 긴급 자금을 투입했다.',
    partialDetail: '투자 의향서는 확보했지만 실사 조건이 붙어 불확실성이 남았다.',
    failedDetail: '전략적 투자자 실사가 중단되며 매각 기대가 사라졌다.',
    successPatch: { debtRatio: -0.2, backlog: 0.12, quality: 0.06, sentiment: 0.22, status: '백기사투자' },
    partialPatch: { debtRatio: -0.04, sentiment: 0.03, status: '투자실사' },
    failedPatch: { sentiment: -0.22, quality: -0.04, status: '투자철회' },
    successImpact: 0.14,
    partialImpact: -0.015,
    failedImpact: -0.18,
  },
}

const LISTING_TEMPLATES = [
  {
    theme: 'ai_memory',
    ticker: 'AIM',
    name: '에이아이메모리',
    exchange: 'KOSDAQ',
    sector: '반도체',
    description: 'AI 추론 서버용 저전력 메모리 컨트롤러를 설계하는 팹리스',
    basePrice: 16300,
    shares: 2_400_000,
    beta: 1.46,
    revenue: 0.72,
    margin: 0.17,
    backlog: 1.18,
    debtRatio: 0.28,
    quality: 0.53,
    sentiment: 0.12,
    dividendYield: 0,
    operation: '신규 상장 물량 소화',
  },
  {
    theme: 'battery_recycling',
    ticker: 'RCL',
    name: '리셀메탈',
    exchange: 'KOSDAQ',
    sector: '배터리',
    description: '폐배터리에서 리튬과 니켈을 회수해 양극재 업체에 공급하는 재활용 기업',
    basePrice: 12450,
    shares: 3_100_000,
    beta: 1.32,
    revenue: 0.94,
    margin: 0.12,
    backlog: 1.04,
    debtRatio: 0.44,
    quality: 0.49,
    sentiment: 0.08,
    dividendYield: 0,
    operation: '전처리 라인 램프업',
  },
  {
    theme: 'defense_robotics',
    ticker: 'DRB',
    name: '드론방산',
    exchange: 'KOSPI',
    sector: '조선방산',
    description: '정찰 드론과 함정용 무인 시스템을 납품하는 방산 로보틱스 기업',
    basePrice: 28200,
    shares: 2_800_000,
    beta: 0.95,
    revenue: 1.35,
    margin: 0.1,
    backlog: 1.36,
    debtRatio: 0.52,
    quality: 0.57,
    sentiment: 0.1,
    dividendYield: 0.006,
    operation: '초도 양산 검수',
  },
  {
    theme: 'digital_therapeutics',
    ticker: 'DTX',
    name: '디지털테라',
    exchange: 'KOSDAQ',
    sector: '바이오',
    description: '디지털 치료기기와 임상 데이터 플랫폼을 개발하는 헬스케어 소프트웨어사',
    basePrice: 19750,
    shares: 1_900_000,
    beta: 1.52,
    revenue: 0.36,
    margin: -0.05,
    backlog: 0.78,
    debtRatio: 0.31,
    quality: 0.45,
    sentiment: 0.09,
    dividendYield: 0,
    operation: '보험 등재 심사',
  },
  {
    theme: 'green_grid',
    ticker: 'GRD',
    name: '그린그리드',
    exchange: 'KOSPI',
    sector: '에너지',
    description: 'ESS 관제와 전력 수요반응을 묶어 판매하는 전력 플랫폼 기업',
    basePrice: 22100,
    shares: 3_700_000,
    beta: 0.88,
    revenue: 1.18,
    margin: 0.11,
    backlog: 1.11,
    debtRatio: 0.48,
    quality: 0.55,
    sentiment: 0.07,
    dividendYield: 0.009,
    operation: '전력거래 고객 온보딩',
  },
  {
    theme: 'game_platform',
    ticker: 'PLY',
    name: '플레이링크',
    exchange: 'KOSDAQ',
    sector: '게임콘텐츠',
    description: '인디게임 퍼블리싱과 팬 커뮤니티 결제를 운영하는 플랫폼 기업',
    basePrice: 8820,
    shares: 4_200_000,
    beta: 1.4,
    revenue: 0.58,
    margin: 0.15,
    backlog: 0.92,
    debtRatio: 0.22,
    quality: 0.48,
    sentiment: 0.11,
    dividendYield: 0,
    operation: '상장 후 첫 라이브 업데이트',
  },
] satisfies [ListingTemplate, ...ListingTemplate[]]

export function estimateCashRunwayMonths(company: Company, context: Partial<RiskEventContext> = {}) {
  const operatingBuffer = 8 + company.quality * 10 + company.backlog * 4 + Math.max(0, company.margin) * 22
  const lossDrain = Math.max(0, -company.margin) * 90
  const leverageDrain = Math.max(0, company.debtRatio - 0.62) * 22
  const demandDrain = Math.max(0, 0.8 - company.backlog) * 9
  const marketDrain = Math.max(0, -(context.mood ?? 0)) * 38 + Math.max(0, (context.policyRate ?? 2.75) - 3.25) * 1.5

  return roundOne(clamp(operatingBuffer - lossDrain - leverageDrain - demandDrain - marketDrain, 0.5, 36))
}

export function countConsecutiveBadNews(ticker: string, news: readonly NewsItem[], limit = 8) {
  const tickerNews = [...news]
    .filter((item) => item.ticker === ticker)
    .sort((left, right) => right.day - left.day)
    .slice(0, limit)

  let count = 0

  for (const item of tickerNews) {
    if (item.tone === 'bad' || item.impact <= -0.035) {
      count += 1
      continue
    }

    if (item.tone === 'good' || item.impact > 0.025) break
  }

  return count
}

export function countAuditFlags(ticker: string, news: readonly NewsItem[], lookbackDays = 30) {
  const newestDay = news.reduce((maxDay, item) => Math.max(maxDay, item.day), 0)
  const minDay = newestDay - lookbackDays

  return news.filter((item) => {
    if (item.ticker !== ticker || item.day < minDay) return false

    const text = `${item.title} ${item.detail}`.toLowerCase()
    return AUDIT_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()))
  }).length
}

export function assessCompanyDistress(company: Company, context: Partial<RiskEventContext> = {}): DistressAssessment {
  const news = context.news ?? []
  const cashRunwayMonths = estimateCashRunwayMonths(company, context)
  const consecutiveBadNews = countConsecutiveBadNews(company.ticker, news)
  const auditFlagCount = countAuditFlags(company.ticker, news)
  const reasons: DistressReason[] = []

  if (company.margin < 0) {
    reasons.push({
      code: 'negative_margin',
      label: '영업손실',
      score: company.margin < -0.1 ? 22 : 14,
    })
  }

  if (company.debtRatio > 0.78) {
    reasons.push({
      code: 'high_debt',
      label: '높은 부채비율',
      score: company.debtRatio > 0.95 ? 22 : 13,
    })
  }

  if (cashRunwayMonths < 6) {
    reasons.push({
      code: 'low_cash_runway',
      label: '짧은 현금 런웨이',
      score: cashRunwayMonths < 3 ? 22 : 14,
    })
  }

  if (consecutiveBadNews >= 2) {
    reasons.push({
      code: 'consecutive_bad_news',
      label: '연속 악재',
      score: Math.min(22, 7 + consecutiveBadNews * 5),
    })
  }

  if (auditFlagCount > 0) {
    reasons.push({
      code: 'audit_flag',
      label: '감사 또는 회계 리스크',
      score: Math.min(28, 16 + auditFlagCount * 6),
    })
  }

  if (company.backlog < 0.7) {
    reasons.push({
      code: 'thin_backlog',
      label: '수주잔고 부족',
      score: company.backlog < 0.52 ? 11 : 7,
    })
  }

  if (company.quality < 0.42) {
    reasons.push({
      code: 'poor_quality',
      label: '낮은 실행 품질',
      score: company.quality < 0.32 ? 12 : 7,
    })
  }

  if ((context.mood ?? 0) < -0.04 || (context.policyRate ?? 2.75) > 3.75) {
    reasons.push({
      code: 'market_stress',
      label: '시장 자금경색',
      score: 6,
    })
  }

  const score = clamp(Math.round(reasons.reduce((sum, reason) => sum + reason.score, 0)), 0, 100)
  const severity = score >= 72 ? 'critical' : score >= 48 ? 'distress' : score >= 26 ? 'watch' : 'stable'
  const hardFailureCount = [
    company.margin < 0,
    company.debtRatio > 0.82,
    cashRunwayMonths < 6,
    consecutiveBadNews >= 2,
    auditFlagCount > 0,
  ].filter(Boolean).length
  const bankruptcyCandidate =
    hardFailureCount >= 4 &&
    company.margin < 0 &&
    company.debtRatio > 0.82 &&
    cashRunwayMonths < 6 &&
    (consecutiveBadNews >= 2 || auditFlagCount > 0) &&
    score >= 78
  const delistingReviewCandidate = auditFlagCount > 0 && score >= 55

  return {
    ticker: company.ticker,
    score,
    severity,
    reasons,
    cashRunwayMonths,
    consecutiveBadNews,
    auditFlagCount,
    hardFailureCount,
    rescueCandidate: score >= 45 && !bankruptcyCandidate,
    delistingReviewCandidate,
    bankruptcyCandidate,
  }
}

export function chooseRescuePath(company: Company, assessment: DistressAssessment, rng: RandomSource): RescuePath {
  const weights: Array<{ item: RescuePath; weight: number }> = [
    {
      item: 'creditor_workout',
      weight: 1 + Math.max(0, company.debtRatio - 0.68) * 5 + (assessment.cashRunwayMonths < 6 ? 1.4 : 0),
    },
    {
      item: 'rights_offering',
      weight: 0.9 + Math.max(0, company.sentiment + 0.2) * 2 + (company.exchange === 'KOSDAQ' ? 0.4 : 0),
    },
    {
      item: 'government_procurement',
      weight: 0.6 + governmentFit(company.sector) + Math.max(0, company.backlog - 0.85) * 1.4,
    },
    {
      item: 'asset_sale',
      weight: 0.8 + Math.max(0, company.revenue - 1) * 0.35 + Math.max(0, company.debtRatio - 0.75) * 2,
    },
    {
      item: 'white_knight_investment',
      weight: 0.5 + company.quality * 1.2 + Math.max(0, company.backlog - 1) * 1.2,
    },
  ]

  return weightedPick(weights, rng, 'asset_sale')
}

export function resolveRescueAttempt(
  company: Company,
  assessment: DistressAssessment,
  context: Partial<RiskEventContext>,
  rng: RandomSource,
  path = chooseRescuePath(company, assessment, rng),
): RescueDecision {
  const profile = RESCUE_PROFILES[path]
  const marketSupport = clamp((context.mood ?? 0) * 1.8, -0.12, 0.12)
  const severityPenalty = assessment.severity === 'critical' ? 0.12 : assessment.severity === 'distress' ? 0.05 : 0
  const auditPenalty = Math.min(0.18, assessment.auditFlagCount * 0.06)
  const runwayPenalty = assessment.cashRunwayMonths < 3 ? 0.08 : assessment.cashRunwayMonths < 6 ? 0.04 : 0
  const sectorSupport = path === 'government_procurement' ? governmentFit(company.sector) * 0.05 : 0
  const successProbability = clamp(
    profile.baseProbability + company.quality * 0.16 + Math.max(0, company.sentiment) * 0.08 + marketSupport + sectorSupport - severityPenalty - auditPenalty - runwayPenalty,
    0.08,
    0.82,
  )
  const roll = rng()
  const outcome: RescueOutcome = roll <= successProbability ? 'success' : roll <= successProbability + 0.28 ? 'partial' : 'failed'

  if (outcome === 'success') {
    return {
      path,
      label: profile.label,
      outcome,
      successProbability,
      roll,
      detail: profile.successDetail,
      patch: profile.successPatch,
      priceImpact: profile.successImpact,
    }
  }

  if (outcome === 'partial') {
    return {
      path,
      label: profile.label,
      outcome,
      successProbability,
      roll,
      detail: profile.partialDetail,
      patch: profile.partialPatch,
      priceImpact: profile.partialImpact,
    }
  }

  return {
    path,
    label: profile.label,
    outcome,
    successProbability,
    roll,
    detail: profile.failedDetail,
    patch: profile.failedPatch,
    priceImpact: profile.failedImpact,
  }
}

export function resolveCompanyRisk(company: Company, context: RiskEventContext, rng: RandomSource): CompanyRiskResolution {
  const assessment = assessCompanyDistress(company, context)

  if (assessment.severity === 'stable') {
    return emptyResolution(assessment)
  }

  const watchProbability = clamp(assessment.score / 160, 0.12, 0.42)

  if (assessment.severity === 'watch' && rng() > watchProbability) {
    return emptyResolution(assessment)
  }

  if (assessment.severity === 'watch') {
    return {
      kind: 'distress_watch',
      assessment,
      patch: {
        sentiment: -0.04,
        status: '재무주의',
        operation: `${company.operation} 점검`,
      },
      priceImpact: -0.025,
      delist: false,
      title: `${company.name} 재무 건전성 점검`,
      detail: distressDetail(assessment),
      tone: 'bad',
    }
  }

  const rescueAttemptProbability = clamp(0.3 + assessment.score / 140 + Math.max(0, company.quality - 0.45) * 0.25, 0.35, 0.86)
  const rescue = rng() <= rescueAttemptProbability ? resolveRescueAttempt(company, assessment, context, rng) : undefined

  if (rescue?.outcome === 'success') {
    return {
      kind: 'rescue_success',
      assessment,
      rescue,
      patch: rescue.patch,
      priceImpact: rescue.priceImpact,
      delist: false,
      title: `${company.name} ${rescue.label} 성사`,
      detail: rescue.detail,
      tone: 'good',
    }
  }

  if (rescue?.outcome === 'partial') {
    return {
      kind: 'rescue_partial',
      assessment,
      rescue,
      patch: rescue.patch,
      priceImpact: rescue.priceImpact,
      delist: false,
      title: `${company.name} ${rescue.label} 조건부 진행`,
      detail: rescue.detail,
      tone: rescue.priceImpact >= 0 ? 'neutral' : 'bad',
    }
  }

  const bankruptcyProbability = assessment.bankruptcyCandidate
    ? clamp(0.006 + (assessment.score - 78) * 0.002 + assessment.auditFlagCount * 0.012 + assessment.consecutiveBadNews * 0.004, 0.006, 0.075)
    : 0

  if (rescue?.outcome === 'failed' && bankruptcyProbability > 0 && rng() <= bankruptcyProbability) {
    return {
      kind: 'bankruptcy',
      assessment,
      rescue,
      patch: {
        margin: -0.18,
        backlog: -0.18,
        debtRatio: 0.08,
        sentiment: -0.45,
        dividendYield: -company.dividendYield,
        status: '파산',
        operation: '법원 회생 절차 신청',
      },
      priceImpact: -0.3,
      delist: true,
      title: `${company.name} 파산 절차 신청`,
      detail: '영업손실, 높은 부채, 짧은 현금 런웨이, 반복 악재가 겹치며 회생 절차에 들어갔다.',
      tone: 'bad',
    }
  }

  if ((rescue?.outcome === 'failed' || assessment.delistingReviewCandidate) && assessment.auditFlagCount > 0) {
    return {
      kind: 'delisting_review',
      assessment,
      rescue,
      patch: {
        sentiment: -0.32,
        quality: -0.08,
        dividendYield: -company.dividendYield,
        status: '상장심사',
        operation: '거래소 상장적격성 심사 대응',
      },
      priceImpact: -0.22,
      delist: false,
      title: `${company.name} 상장적격성 심사 사유 발생`,
      detail: '감사 또는 회계 리스크가 누적되어 거래소 심사 대상에 올랐다.',
      tone: 'bad',
    }
  }

  if (rescue?.outcome === 'failed') {
    return {
      kind: 'rescue_failed',
      assessment,
      rescue,
      patch: rescue.patch,
      priceImpact: rescue.priceImpact,
      delist: false,
      title: `${company.name} ${rescue.label} 난항`,
      detail: rescue.detail,
      tone: 'bad',
    }
  }

  return {
    kind: 'trading_halt',
    assessment,
    patch: {
      sentiment: -0.18,
      status: '거래정지위험',
      operation: '중요 공시 확인 중',
    },
    priceImpact: -0.12,
    delist: false,
    title: `${company.name} 투자위험 공시`,
    detail: distressDetail(assessment),
    tone: 'bad',
  }
}

export function applyRiskResolution(company: Company, resolution: CompanyRiskResolution): Company | null {
  if (resolution.kind === 'none') return company

  const patched = applyCompanyPatch(company, resolution.patch)

  if (resolution.delist) return null

  return patched
}

export function buildRiskNews(company: Company, resolution: CompanyRiskResolution, context: RiskEventContext): NewsItem[] {
  if (resolution.kind === 'none' || !resolution.title || !resolution.detail) return []

  return [
    {
      id: `${context.day}-${company.ticker}-${resolution.kind}`,
      day: context.day,
      date: context.date,
      ticker: company.ticker,
      title: resolution.title,
      detail: resolution.detail,
      tone: resolution.tone,
      impact: resolution.priceImpact,
    },
  ]
}

export function maybeCreateNewListing(
  context: NewListingContext,
  rng: RandomSource,
  options: { maxCompanies?: number; minDaysBetweenListings?: number } = {},
): NewListingDecision {
  const maxCompanies = options.maxCompanies ?? 16
  const minDaysBetweenListings = options.minDaysBetweenListings ?? 14

  if (context.companies.length >= maxCompanies) {
    return { listed: false, probability: 0, roll: 1, reason: '상장 가능 종목 수 한도 도달' }
  }

  const recentListing = context.news.some(
    (item) => context.day - item.day <= minDaysBetweenListings && (item.title.includes('신규 상장') || item.detail.includes('신규 상장')),
  )

  if (recentListing) {
    return { listed: false, probability: 0, roll: 1, reason: '최근 신규 상장 이벤트 존재' }
  }

  const capacityBoost = (maxCompanies - context.companies.length) * 0.004
  const marketWindow = clamp(context.mood * 0.35 - Math.max(0, context.policyRate - 3) * 0.012, -0.02, 0.04)
  const probability = clamp(0.025 + capacityBoost + marketWindow, 0.008, 0.09)
  const roll = rng()

  if (roll > probability) {
    return { listed: false, probability, roll, reason: 'IPO 창구 대기' }
  }

  const company = createNewListingCompany(context, rng)
  const newsItem: NewsItem = {
    id: `${context.day}-${company.ticker}-listing`,
    day: context.day,
    date: context.date,
    ticker: company.ticker,
    title: `${company.name} 신규 상장`,
    detail: `${company.description}. 공모 이후 첫 거래가 ${company.exchange}에서 시작됐다.`,
    tone: 'good',
    impact: 0.035,
  }

  return {
    listed: true,
    company,
    newsItem,
    probability,
    roll,
    reason: '시장 여건과 종목 수 여유로 신규 상장 승인',
  }
}

export function createNewListingCompany(context: NewListingContext, rng: RandomSource): Company {
  const template = LISTING_TEMPLATES[Math.floor(rng() * LISTING_TEMPLATES.length)] ?? LISTING_TEMPLATES[0]
  const existingTickers = context.companies.map((company) => company.ticker)
  const priceNoise = 1 + (rng() - 0.5) * 0.16 + clamp(context.mood, -0.04, 0.04)
  const price = snapListingPrice(template.basePrice * priceNoise)
  const ticker = uniqueTicker(template.ticker, existingTickers)

  return {
    ticker,
    name: template.name,
    exchange: template.exchange,
    sector: template.sector,
    description: template.description,
    price,
    prevClose: price,
    open: price,
    shares: template.shares,
    beta: template.beta,
    revenue: template.revenue,
    margin: clamp(template.margin + (rng() - 0.5) * 0.035, -0.12, 0.28),
    backlog: clamp(template.backlog + (rng() - 0.5) * 0.16, 0.55, 1.45),
    debtRatio: clamp(template.debtRatio + (rng() - 0.5) * 0.08, 0.12, 0.72),
    quality: clamp(template.quality + (rng() - 0.5) * 0.08, 0.36, 0.68),
    sentiment: clamp(template.sentiment + context.mood * 1.4 + (rng() - 0.5) * 0.08, -0.18, 0.36),
    dividendYield: template.dividendYield,
    relations: relationSeeds(template, context.companies),
    history: [price],
    lastReturn: 0,
    dayVolume: 0,
    status: '신규상장',
    operation: template.operation,
  }
}

function emptyResolution(assessment: DistressAssessment): CompanyRiskResolution {
  return {
    kind: 'none',
    assessment,
    patch: {},
    priceImpact: 0,
    delist: false,
    tone: 'neutral',
  }
}

function applyCompanyPatch(company: Company, patch: CompanyRiskPatch): Company {
  return {
    ...company,
    margin: patch.margin === undefined ? company.margin : clamp(company.margin + patch.margin, -0.2, 0.36),
    backlog: patch.backlog === undefined ? company.backlog : clamp(company.backlog + patch.backlog, 0.25, 1.75),
    debtRatio: patch.debtRatio === undefined ? company.debtRatio : clamp(company.debtRatio + patch.debtRatio, 0.05, 1.25),
    quality: patch.quality === undefined ? company.quality : clamp(company.quality + patch.quality, 0.15, 0.86),
    sentiment: patch.sentiment === undefined ? company.sentiment : clamp(company.sentiment + patch.sentiment, -0.95, 0.95),
    dividendYield: patch.dividendYield === undefined ? company.dividendYield : clamp(company.dividendYield + patch.dividendYield, 0, 0.08),
    status: patch.status ?? company.status,
    operation: patch.operation ?? company.operation,
  }
}

function distressDetail(assessment: DistressAssessment) {
  const labels = assessment.reasons.map((reason) => reason.label).slice(0, 4)
  const reasonText = labels.length > 0 ? labels.join(', ') : '재무 변동성'

  return `${reasonText} 요인이 겹치며 위험 점수 ${assessment.score}점, 추정 현금 런웨이 ${assessment.cashRunwayMonths}개월로 평가됐다.`
}

function governmentFit(sector: Sector) {
  switch (sector) {
    case '조선방산':
      return 1.5
    case '에너지':
    case '반도체':
      return 0.9
    case '바이오':
    case '배터리':
      return 0.6
    case 'AI소프트웨어':
      return 0.4
    case '소재':
    case '자동차':
    case '게임콘텐츠':
    case '금융':
      return 0.1
  }
}

function relationSeeds(template: ListingTemplate, companies: readonly Company[]) {
  return companies
    .filter((company) => company.sector === template.sector || relatedSector(template.sector, company.sector))
    .slice(0, 3)
    .map((company, index) => ({
      ticker: company.ticker,
      weight: [0.18, 0.12, 0.08][index] ?? 0.06,
      reason: `${template.name} 밸류체인 연동`,
    }))
}

function relatedSector(left: Sector, right: Sector) {
  const groups: Sector[][] = [
    ['반도체', '소재', 'AI소프트웨어'],
    ['자동차', '배터리', '에너지'],
    ['조선방산', '금융'],
    ['바이오', 'AI소프트웨어'],
    ['게임콘텐츠', 'AI소프트웨어'],
  ]

  return groups.some((group) => group.includes(left) && group.includes(right))
}

function uniqueTicker(baseTicker: string, existingTickers: readonly string[]) {
  if (!existingTickers.includes(baseTicker)) return baseTicker

  for (let suffix = 2; suffix <= 99; suffix += 1) {
    const ticker = `${baseTicker}${suffix}`
    if (!existingTickers.includes(ticker)) return ticker
  }

  return `${baseTicker}${existingTickers.length + 1}`
}

function weightedPick<T>(weights: Array<{ item: T; weight: number }>, rng: RandomSource, fallback: T) {
  const total = weights.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0)
  let roll = rng() * total

  for (const entry of weights) {
    roll -= Math.max(0, entry.weight)
    if (roll <= 0) return entry.item
  }

  return weights[weights.length - 1]?.item ?? fallback
}

function snapListingPrice(price: number) {
  if (price < 2000) return Math.max(100, Math.round(price))
  if (price < 5000) return Math.round(price / 5) * 5
  if (price < 20000) return Math.round(price / 10) * 10
  if (price < 50000) return Math.round(price / 50) * 50
  return Math.round(price / 100) * 100
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

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

export type ReporterId = 'conservative-market-desk' | 'growth-rumor-wire' | 'forensic-accounting-desk'

export type ReporterViewpoint = 'valuation-first' | 'momentum-rumor' | 'accounting-skeptic'

export interface ReporterDefinition {
  id: ReporterId
  outlet: string
  byline: string
  viewpoint: ReporterViewpoint
  description: string
  reliability: number
  speed: number
  rumorTolerance: number
  skepticism: number
  audienceReach: number
  impactBias: {
    positiveAmplifier: number
    negativeAmplifier: number
    uncertaintyPenalty: number
  }
}

export interface ArticleMetric {
  label: string
  value: string | number
  previous?: string | number
  interpretation?: string
}

export type ArticleEventKind = 'company' | 'macro' | 'distress' | 'listing' | 'foreign-market'
export type ArticleDirection = 'positive' | 'negative' | 'mixed' | 'watch'

export interface ArticleBaseEvent {
  kind: ArticleEventKind
  day: number
  date: string
  actualImpact: number
  id?: string
  titleHint?: string
  visibleImpact?: number
  confidence?: number
  ambiguity?: number
  seed?: number
  tags?: string[]
  tone?: NewsTone
}

export interface CompanyArticleEvent extends ArticleBaseEvent {
  kind: 'company'
  company: Company
  catalyst: string
  direction?: ArticleDirection
  metric?: ArticleMetric
  relatedCompanies?: Company[]
  counterpoint?: string
  managementComment?: string
}

export interface MacroArticleEvent extends ArticleBaseEvent {
  kind: 'macro'
  indicator: string
  summary: string
  policyRate?: number
  usdKrw?: number
  kospi?: number
  kosdaq?: number
  affectedSectors?: Company['sector'][]
  policyRead?: string
}

export type DistressSignal = 'liquidity' | 'audit' | 'covenant' | 'governance' | 'supply-chain' | 'legal'

export interface DistressArticleEvent extends ArticleBaseEvent {
  kind: 'distress'
  company: Company
  signal: DistressSignal
  trigger: string
  severity: number
  denial?: string
  auditorNote?: string
  cashRunwayMonths?: number
  covenantBuffer?: number
}

export type ListingType = 'ipo' | 'transfer' | 'spac' | 'rights'

export interface ListingArticleEvent extends ArticleBaseEvent {
  kind: 'listing'
  companyName: string
  exchange: Company['exchange']
  sector: Company['sector']
  listingType: ListingType
  ticker?: string
  offerPrice?: number
  demandRatio?: number
  lockupRatio?: number
  floatRatio?: number
  sponsor?: string
  useOfProceeds?: string
  comparableCompany?: Company
}

export interface ForeignMarketArticleEvent extends ArticleBaseEvent {
  kind: 'foreign-market'
  region: string
  indexName: string
  move: number
  driver: string
  session?: string
  currencyPair?: string
  currencyMove?: number
  affectedSectors?: Company['sector'][]
  linkedCompanies?: Company[]
}

export type ArticleEvent =
  | CompanyArticleEvent
  | MacroArticleEvent
  | DistressArticleEvent
  | ListingArticleEvent
  | ForeignMarketArticleEvent

export type AccuracyVerdict = 'confirmed' | 'ambiguous' | 'partially-wrong' | 'mostly-wrong'

export interface OutletAccuracyImpact {
  reporterId: ReporterId
  reliability: number
  actualImpact: number
  reportedImpact: number
  perceivedImpact: number
  accuracyImpact: number
  errorMagnitude: number
  confidence: number
  ambiguous: boolean
  partiallyWrong: boolean
  verdict: AccuracyVerdict
  note: string
}

export interface ArticleBuildOptions {
  reporter?: ReporterDefinition
  audienceReach?: number
  maxParagraphs?: number
}

export interface ConstructedNewsArticle {
  eventKind: ArticleEventKind
  reporter: ReporterDefinition
  title: string
  detail: string
  paragraphs: string[]
  accuracy: OutletAccuracyImpact
  newsItem: NewsItem
}

export const NEWS_REPORTERS = {
  'conservative-market-desk': {
    id: 'conservative-market-desk',
    outlet: '한성마켓 데스크',
    byline: '시황부 정태원',
    viewpoint: 'valuation-first',
    description: '기관 수급, 밸류에이션, 확인 공시를 먼저 보는 보수적 시장 데스크',
    reliability: 0.84,
    speed: 0.48,
    rumorTolerance: 0.12,
    skepticism: 0.58,
    audienceReach: 0.62,
    impactBias: {
      positiveAmplifier: 0.72,
      negativeAmplifier: 0.86,
      uncertaintyPenalty: 0.35,
    },
  },
  'growth-rumor-wire': {
    id: 'growth-rumor-wire',
    outlet: '퀵알파 성장속보',
    byline: '모멘텀팀 서리나',
    viewpoint: 'momentum-rumor',
    description: '수주설, 채팅방 온도, 성장주 옵션가치를 빠르게 받아쓰는 루머성 성장 매체',
    reliability: 0.46,
    speed: 0.91,
    rumorTolerance: 0.82,
    skepticism: 0.18,
    audienceReach: 0.78,
    impactBias: {
      positiveAmplifier: 1.46,
      negativeAmplifier: 1.08,
      uncertaintyPenalty: 0.08,
    },
  },
  'forensic-accounting-desk': {
    id: 'forensic-accounting-desk',
    outlet: '장부현미경 리서치',
    byline: '회계분석팀 문해준',
    viewpoint: 'accounting-skeptic',
    description: '현금흐름, 주석, 매출 인식, 차입 약정을 파고드는 포렌식 회계 매체',
    reliability: 0.73,
    speed: 0.39,
    rumorTolerance: 0.2,
    skepticism: 0.86,
    audienceReach: 0.54,
    impactBias: {
      positiveAmplifier: 0.6,
      negativeAmplifier: 1.34,
      uncertaintyPenalty: 0.28,
    },
  },
} satisfies Record<ReporterId, ReporterDefinition>

export const REPORTER_DEFINITIONS = Object.values(NEWS_REPORTERS)

export function getReporterDefinition(reporterId: ReporterId) {
  return NEWS_REPORTERS[reporterId]
}

export function constructCompanyArticle(
  event: CompanyArticleEvent,
  reporterId: ReporterId = 'conservative-market-desk',
  options: ArticleBuildOptions = {},
): ConstructedNewsArticle {
  const reporter = resolveReporter(reporterId, options)
  const accuracy = assessAccuracy(event, reporter)
  const title = event.titleHint ?? companyTitle(event, reporter, accuracy)
  const paragraphs = trimParagraphs(companyParagraphs(event, reporter, accuracy), options.maxParagraphs)

  return buildConstructedArticle(event, reporter, title, paragraphs, accuracy)
}

export function constructMacroArticle(
  event: MacroArticleEvent,
  reporterId: ReporterId = 'conservative-market-desk',
  options: ArticleBuildOptions = {},
): ConstructedNewsArticle {
  const reporter = resolveReporter(reporterId, options)
  const accuracy = assessAccuracy(event, reporter)
  const title = event.titleHint ?? macroTitle(event, reporter, accuracy)
  const paragraphs = trimParagraphs(macroParagraphs(event, reporter, accuracy), options.maxParagraphs)

  return buildConstructedArticle(event, reporter, title, paragraphs, accuracy)
}

export function constructDistressArticle(
  event: DistressArticleEvent,
  reporterId: ReporterId = 'forensic-accounting-desk',
  options: ArticleBuildOptions = {},
): ConstructedNewsArticle {
  const reporter = resolveReporter(reporterId, options)
  const accuracy = assessAccuracy(event, reporter)
  const title = event.titleHint ?? distressTitle(event, reporter, accuracy)
  const paragraphs = trimParagraphs(distressParagraphs(event, reporter, accuracy), options.maxParagraphs)

  return buildConstructedArticle(event, reporter, title, paragraphs, accuracy)
}

export function constructListingArticle(
  event: ListingArticleEvent,
  reporterId: ReporterId = 'growth-rumor-wire',
  options: ArticleBuildOptions = {},
): ConstructedNewsArticle {
  const reporter = resolveReporter(reporterId, options)
  const accuracy = assessAccuracy(event, reporter)
  const title = event.titleHint ?? listingTitle(event, reporter, accuracy)
  const paragraphs = trimParagraphs(listingParagraphs(event, reporter, accuracy), options.maxParagraphs)

  return buildConstructedArticle(event, reporter, title, paragraphs, accuracy)
}

export function constructForeignMarketArticle(
  event: ForeignMarketArticleEvent,
  reporterId: ReporterId = 'conservative-market-desk',
  options: ArticleBuildOptions = {},
): ConstructedNewsArticle {
  const reporter = resolveReporter(reporterId, options)
  const accuracy = assessAccuracy(event, reporter)
  const title = event.titleHint ?? foreignMarketTitle(event, reporter, accuracy)
  const paragraphs = trimParagraphs(foreignMarketParagraphs(event, reporter, accuracy), options.maxParagraphs)

  return buildConstructedArticle(event, reporter, title, paragraphs, accuracy)
}

export function constructArticle(
  event: ArticleEvent,
  reporterId: ReporterId = 'conservative-market-desk',
  options: ArticleBuildOptions = {},
): ConstructedNewsArticle {
  switch (event.kind) {
    case 'company':
      return constructCompanyArticle(event, reporterId, options)
    case 'macro':
      return constructMacroArticle(event, reporterId, options)
    case 'distress':
      return constructDistressArticle(event, reporterId, options)
    case 'listing':
      return constructListingArticle(event, reporterId, options)
    case 'foreign-market':
      return constructForeignMarketArticle(event, reporterId, options)
  }
}

export function constructArticleText(
  event: ArticleEvent,
  reporterId: ReporterId = 'conservative-market-desk',
  options: ArticleBuildOptions = {},
) {
  return constructArticle(event, reporterId, options).detail
}

export function articleToNewsItem(article: ConstructedNewsArticle): NewsItem {
  return article.newsItem
}

function resolveReporter(reporterId: ReporterId, options: ArticleBuildOptions) {
  const reporter = options.reporter ?? NEWS_REPORTERS[reporterId]

  if (options.audienceReach === undefined) return reporter

  return {
    ...reporter,
    audienceReach: clamp01(options.audienceReach),
  }
}

function assessAccuracy(event: ArticleEvent, reporter: ReporterDefinition): OutletAccuracyImpact {
  const ambiguity = clamp01(event.ambiguity ?? defaultAmbiguity(event.kind))
  const eventConfidence = clamp01(event.confidence ?? 0.62)
  const sourceKey = `${event.kind}:${event.id ?? event.day}:${event.seed ?? 0}:${reporter.id}:${eventSubject(event)}`
  const roll = stableNoise(sourceKey)
  const noise = stableNoise(`${sourceKey}:noise`) - 0.5
  const falseRisk = clamp01((1 - reporter.reliability) * 0.42 + reporter.rumorTolerance * 0.18 + ambiguity * 0.24 - eventConfidence * 0.14)
  const partialRisk = clamp01(falseRisk + (1 - reporter.reliability) * 0.35 + ambiguity * 0.28)
  const visibleImpact = event.visibleImpact ?? event.actualImpact
  const eventDirection = Math.sign(visibleImpact || event.actualImpact || 1)
  let verdict: AccuracyVerdict = 'confirmed'
  let reportedImpact: number

  if (roll < falseRisk) {
    verdict = 'mostly-wrong'
    reportedImpact = -visibleImpact * (0.18 + reporter.rumorTolerance * 0.42) + noise * 0.025
  } else if (roll < partialRisk) {
    verdict = 'partially-wrong'
    reportedImpact = visibleImpact * (0.34 + reporter.speed * 0.32) + noise * 0.018
  } else if (ambiguity > 0.55 || eventConfidence < 0.48) {
    verdict = 'ambiguous'
    reportedImpact = visibleImpact * (0.62 + reporter.speed * 0.16) + noise * 0.012
  } else {
    reportedImpact = visibleImpact * (0.88 + reporter.reliability * 0.18) + noise * (1 - reporter.reliability) * 0.018
  }

  const directionBias =
    eventDirection >= 0 ? reporter.impactBias.positiveAmplifier : reporter.impactBias.negativeAmplifier
  const uncertaintyHaircut = 1 - ambiguity * reporter.impactBias.uncertaintyPenalty
  reportedImpact = clamp(reportedImpact * directionBias * uncertaintyHaircut, -0.34, 0.34)

  const perceivedImpact = clamp(reportedImpact * (0.72 + reporter.audienceReach * 0.42), -0.34, 0.34)
  const accuracyImpact = clamp((reportedImpact - event.actualImpact) * reporter.audienceReach, -0.34, 0.34)
  const errorMagnitude = Math.abs(reportedImpact - event.actualImpact)
  const confidence = clamp01(reporter.reliability * 0.7 + eventConfidence * 0.3 - ambiguity * 0.24 - (verdict === 'mostly-wrong' ? 0.18 : 0))
  const ambiguous = verdict === 'ambiguous' || verdict === 'partially-wrong' || verdict === 'mostly-wrong'
  const partiallyWrong = verdict === 'partially-wrong' || verdict === 'mostly-wrong'

  return {
    reporterId: reporter.id,
    reliability: reporter.reliability,
    actualImpact: event.actualImpact,
    reportedImpact,
    perceivedImpact,
    accuracyImpact,
    errorMagnitude,
    confidence,
    ambiguous,
    partiallyWrong,
    verdict,
    note: accuracyNote(verdict, accuracyImpact, confidence),
  }
}

function buildConstructedArticle(
  event: ArticleEvent,
  reporter: ReporterDefinition,
  title: string,
  paragraphs: string[],
  accuracy: OutletAccuracyImpact,
): ConstructedNewsArticle {
  const detail = paragraphs.join(' ')
  const newsItem: NewsItem = {
    id: event.id ?? `${event.day}-${event.kind}-${reporter.id}-${hashToInt(title).toString(36)}`,
    day: event.day,
    date: event.date,
    ticker: eventTicker(event),
    title: `${reporter.outlet} | ${title}`,
    detail,
    tone: event.tone ?? toneFromImpact(accuracy.reportedImpact),
    impact: accuracy.perceivedImpact,
  }

  return {
    eventKind: event.kind,
    reporter,
    title,
    detail,
    paragraphs,
    accuracy,
    newsItem,
  }
}

function companyParagraphs(event: CompanyArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const { company } = event
  const metric = event.metric ? metricSentence(event.metric) : `${company.operation}의 진척이 이번 해석의 출발점이다.`
  const related = event.relatedCompanies?.length
    ? `연관 종목으로는 ${event.relatedCompanies.map((item) => `${item.name}(${item.ticker})`).join(', ')}가 같이 거론된다.`
    : company.relations.length
      ? `기존 민감도 표에서는 ${company.relations.map((item) => `${item.ticker}(${item.reason})`).join(', ')}가 후행 변수로 묶인다.`
      : '직접 비교할 만한 후행 종목은 많지 않다.'
  const counterpoint = event.counterpoint ?? defaultCounterpoint(company, accuracy)
  const management = event.managementComment
    ? `회사 측 설명은 "${event.managementComment}"에 가깝지만, 숫자로 확인되는 시점은 아직 남아 있다.`
    : '회사 측의 공식 확인은 제한적이며, 장중 가격이 먼저 반응한 대목도 있다.'

  return [
    `${reporter.outlet}은 ${company.name}(${company.ticker})의 ${event.catalyst}를 단순 호재나 악재로 단정하기보다 ${reporterFrame(reporter)} 관점에서 다시 읽고 있다. ${metric}`,
    `현재 매출 체력은 ${company.revenue.toFixed(2)}조원, 영업마진은 ${(company.margin * 100).toFixed(1)}%, 수주잔고 지표는 ${company.backlog.toFixed(2)}배다. ${related}`,
    `${management} ${counterpoint} ${ambiguitySentence(accuracy, reporter)}`,
    `${reporter.byline}은 이번 보도의 체감 영향이 ${formatSignedPercent(accuracy.reportedImpact)} 수준으로 읽히지만, 사후 검증 기준으로는 ${formatSignedPercent(accuracy.actualImpact)}에 가까울 수 있다고 기록했다. ${accuracy.note}`,
  ]
}

function macroParagraphs(event: MacroArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const sectors = formatList(event.affectedSectors, '전 업종')
  const rate = event.policyRate === undefined ? '' : ` 기준금리 ${event.policyRate.toFixed(2)}%는 할인율 논쟁을 다시 열었다.`
  const fx = event.usdKrw === undefined ? '' : ` 원/달러 환율은 ${event.usdKrw.toLocaleString('ko-KR')}원 근처에서 수출주와 외국인 수급을 동시에 흔든다.`
  const indexes = [
    event.kospi === undefined ? undefined : `KOSPI ${event.kospi.toLocaleString('ko-KR')}`,
    event.kosdaq === undefined ? undefined : `KOSDAQ ${event.kosdaq.toLocaleString('ko-KR')}`,
  ].filter((item): item is string => Boolean(item))
  const policyRead = event.policyRead ?? '정책 당국의 다음 발언이 방향성보다 변동성을 더 크게 만들 가능성이 있다.'

  return [
    `${event.indicator}를 둘러싼 해석이 장 초반부터 엇갈렸다. ${event.summary} ${reporter.outlet}은 이를 ${reporterFrame(reporter)} 문제로 보고 있으며, 영향권은 ${sectors}까지 넓어진다.`,
    `${indexes.length ? `${indexes.join(', ')} 기준으로도 지수 민감도는 낮지 않다.` : '지수 레벨보다 업종 간 온도 차가 더 도드라진다.'}${rate}${fx}`,
    `${policyRead} 다만 같은 재료라도 현금흐름이 빠른 기업과 기대 매출 위주의 기업이 받는 할인율은 다르게 움직인다.`,
    `이번 보도의 추정 체감 영향은 ${formatSignedPercent(accuracy.reportedImpact)}로 계산됐다. 실제 매크로 충격은 ${formatSignedPercent(accuracy.actualImpact)} 수준일 수 있어, ${accuracy.note} ${ambiguitySentence(accuracy, reporter)}`,
  ]
}

function distressParagraphs(event: DistressArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const { company } = event
  const signal = distressSignalLabel(event.signal)
  const runway = event.cashRunwayMonths === undefined ? '' : ` 현금 활주로는 약 ${event.cashRunwayMonths}개월로 추정된다.`
  const covenant = event.covenantBuffer === undefined ? '' : ` 약정 여유분은 ${formatSignedPercent(event.covenantBuffer)}로 크지 않다.`
  const denial = event.denial
    ? `회사 측은 "${event.denial}"라고 부인했지만, 부인 자체가 회계상 불확실성을 모두 해소하지는 않는다.`
    : '회사 측 공식 부인은 아직 확인되지 않았고, 거래 상대방 확인도 지연되고 있다.'
  const auditor = event.auditorNote
    ? `감사 관련 메모에는 ${event.auditorNote}라는 표현이 남아 있다.`
    : '감사보고서 주석만으로는 위험의 크기를 확정하기 어렵다.'

  return [
    `${reporter.outlet}은 ${company.name}(${company.ticker})에서 ${signal} 신호가 포착됐다고 봤다. 직접 계기는 ${event.trigger}이며, 심각도는 0에서 1 사이 척도에서 ${event.severity.toFixed(2)}로 분류된다.`,
    `부채비율은 ${(company.debtRatio * 100).toFixed(0)}%, 영업마진은 ${(company.margin * 100).toFixed(1)}%다.${runway}${covenant} 숫자만 보면 즉시 부도나 상장폐지를 말할 단계는 아니지만, 차입금 만기와 운전자본 회전이 동시에 나빠지면 주가 할인은 빠르게 커질 수 있다.`,
    `${denial} ${auditor} ${reporterFrame(reporter)} 관점에서는 매출 성장보다 현금 유출의 속도가 핵심이다.`,
    `이번 보도는 체감 충격을 ${formatSignedPercent(accuracy.reportedImpact)}로 제시한다. 다만 실제 가격 영향 추정치는 ${formatSignedPercent(accuracy.actualImpact)}이며, ${accuracy.note} ${ambiguitySentence(accuracy, reporter)}`,
  ]
}

function listingParagraphs(event: ListingArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const price = event.offerPrice === undefined ? '공모가 미정' : `공모가 ${formatWon(event.offerPrice)}`
  const demand = event.demandRatio === undefined ? '수요예측 자료가 제한적' : `수요예측 경쟁률 ${event.demandRatio.toFixed(0)}대 1`
  const lockup = event.lockupRatio === undefined ? '' : ` 보호예수 비율은 ${(event.lockupRatio * 100).toFixed(1)}%다.`
  const float = event.floatRatio === undefined ? '' : ` 유통 가능 물량은 ${(event.floatRatio * 100).toFixed(1)}%로 추정된다.`
  const sponsor = event.sponsor ? `주관사는 ${event.sponsor}다.` : '주관사 평판은 아직 가격에 충분히 반영되지 않았다.'
  const comparable = event.comparableCompany
    ? `비교 대상으로는 ${event.comparableCompany.name}(${event.comparableCompany.ticker})가 자주 언급된다.`
    : `${event.sector} 업종 내 직접 비교군이 좁아 밸류에이션 논쟁이 길어질 수 있다.`

  return [
    `${event.companyName}${event.ticker ? `(${event.ticker})` : ''}의 ${listingTypeLabel(event.listingType)} 이슈가 ${event.exchange} 시장의 새 재료로 떠올랐다. ${price}, ${demand}이라는 숫자가 먼저 돌았고 ${sponsor}`,
    `${lockup}${float} ${comparable} ${reporter.outlet}은 이 상장이 단기 유동성 장세에서는 흥행 기사로 소비되지만, 상장 후 첫 실적 확인 전까지는 가격 발견이 거칠 수 있다고 본다.`,
    `${event.useOfProceeds ? `조달 자금 사용처는 ${event.useOfProceeds}로 제시됐다.` : '조달 자금의 구체적 사용처는 아직 충분히 설명되지 않았다.'} ${reporterFrame(reporter)} 관점에서는 공모 흥행과 본업 수익성의 간극이 핵심 변수다.`,
    `보도상 체감 영향은 ${formatSignedPercent(accuracy.reportedImpact)}로 잡혔다. 그러나 실제 수급 충격은 ${formatSignedPercent(accuracy.actualImpact)}에 가까울 수 있어, ${accuracy.note} ${ambiguitySentence(accuracy, reporter)}`,
  ]
}

function foreignMarketParagraphs(
  event: ForeignMarketArticleEvent,
  reporter: ReporterDefinition,
  accuracy: OutletAccuracyImpact,
) {
  const session = event.session ? `${event.session} 세션에서 ` : ''
  const sectors = formatList(event.affectedSectors, '국내 대형주')
  const linked = event.linkedCompanies?.length
    ? `연동 종목으로는 ${event.linkedCompanies.map((item) => `${item.name}(${item.ticker})`).join(', ')}가 먼저 거론된다.`
    : '직접 연동 종목은 제한적이지만 업종 베타가 높은 종목부터 가격이 흔들릴 수 있다.'
  const currency =
    event.currencyPair && event.currencyMove !== undefined
      ? ` ${event.currencyPair} 움직임은 ${formatSignedPercent(event.currencyMove)}로, 환산 실적과 외국인 매매 모두에 영향을 준다.`
      : ''

  return [
    `${event.region} ${event.indexName}이 ${session}${formatSignedPercent(event.move)} 움직였다. 표면상 이유는 ${event.driver}지만, 국내 시장에서는 ${sectors}의 개장 전 주문부터 반응이 갈렸다.${currency}`,
    `${linked} ${reporter.outlet}은 해외 지표를 그대로 대입하기보다 시차, 환율, 국내 업종 포지션을 나눠 봐야 한다고 설명한다.`,
    `${reporterFrame(reporter)} 관점에서는 해외 장 마감 직후의 첫 가격보다 한국 정규장 10시 이후의 거래대금 확인이 더 중요하다. 단기 갭은 뉴스 속도에 끌리고, 종가는 실제 실적 민감도에 가까워지는 경우가 많다.`,
    `이번 해외시장 보도의 체감 영향은 ${formatSignedPercent(accuracy.reportedImpact)}로 제시됐지만, 실제 국내 영향 추정치는 ${formatSignedPercent(accuracy.actualImpact)}다. ${accuracy.note} ${ambiguitySentence(accuracy, reporter)}`,
  ]
}

function companyTitle(event: CompanyArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const direction = titleDirection(accuracy.reportedImpact)
  const qualifier = reporter.id === 'growth-rumor-wire' && accuracy.ambiguous ? '소문 선반영?' : direction

  return `${event.company.name}, ${event.catalyst} ${qualifier}`
}

function macroTitle(event: MacroArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const direction = titleDirection(accuracy.reportedImpact)
  const suffix = reporter.id === 'forensic-accounting-desk' ? '숫자 검증 필요' : direction

  return `${event.indicator}, ${suffix}`
}

function distressTitle(event: DistressArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const label = distressSignalLabel(event.signal)
  const suffix = reporter.id === 'growth-rumor-wire' && accuracy.partiallyWrong ? '시장 루머 확산' : '위험 점검'

  return `${event.company.name} ${label} ${suffix}`
}

function listingTitle(event: ListingArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const name = event.ticker ? `${event.companyName}(${event.ticker})` : event.companyName
  const read = reporter.id === 'conservative-market-desk' ? '공모가 검증' : titleDirection(accuracy.reportedImpact)

  return `${name} ${listingTypeLabel(event.listingType)} ${read}`
}

function foreignMarketTitle(event: ForeignMarketArticleEvent, reporter: ReporterDefinition, accuracy: OutletAccuracyImpact) {
  const read = reporter.id === 'growth-rumor-wire' ? '개장 전 속보' : titleDirection(accuracy.reportedImpact)

  return `${event.region} ${event.indexName} ${formatSignedPercent(event.move)}, 국내 ${read}`
}

function reporterFrame(reporter: ReporterDefinition) {
  switch (reporter.viewpoint) {
    case 'valuation-first':
      return '실적 가시성과 기관 수급, 이미 반영된 기대치를 맞춰보는'
    case 'momentum-rumor':
      return '빠른 주문 흐름과 아직 공시되지 않은 성장 서사를 우선 반영하는'
    case 'accounting-skeptic':
      return '현금흐름, 주석, 차입 약정이 가격보다 늦게 드러난다는'
  }
}

function defaultCounterpoint(company: Company, accuracy: OutletAccuracyImpact) {
  if (accuracy.reportedImpact >= 0) {
    return `${company.exchange} 내 같은 업종 대비 이미 높아진 기대치가 부담으로 남는다.`
  }

  return `낮아진 기대치 때문에 작은 확인 공시만 나와도 숏커버성 반등이 생길 수 있다.`
}

function ambiguitySentence(accuracy: OutletAccuracyImpact, reporter: ReporterDefinition) {
  if (accuracy.verdict === 'mostly-wrong') {
    return `${reporter.outlet}의 초기 판단에는 반대 방향으로 빗나갈 위험이 남아 있다.`
  }

  if (accuracy.verdict === 'partially-wrong') {
    return '일부 수치가 취재원 발언에 기대고 있어 방향은 맞더라도 강도는 과장됐을 수 있다.'
  }

  if (accuracy.verdict === 'ambiguous') {
    return '핵심 변수의 확인 시점이 달라 해석은 열려 있고, 장중 반응도 두 갈래로 나뉠 수 있다.'
  }

  return '현재까지 확인된 정보와 가격 반응의 방향은 대체로 일치한다.'
}

function accuracyNote(verdict: AccuracyVerdict, accuracyImpact: number, confidence: number) {
  const drift = Math.abs(accuracyImpact) < 0.004 ? '가격 왜곡은 제한적' : `보도 성향에 따른 왜곡 폭은 ${formatSignedPercent(accuracyImpact)}`
  const confidenceText = `신뢰도 점수는 ${(confidence * 100).toFixed(0)}점`

  switch (verdict) {
    case 'confirmed':
      return `${confidenceText}이며, ${drift}으로 추정된다.`
    case 'ambiguous':
      return `${confidenceText}이나, 확인 전제에 따라 ${drift}까지 달라질 수 있다.`
    case 'partially-wrong':
      return `${confidenceText}에 그치며, ${drift}이다. 일부 전제가 틀리면 영향은 빠르게 줄어든다.`
    case 'mostly-wrong':
      return `${confidenceText}으로 낮고, ${drift}이다. 반대 방향 재평가 가능성을 열어둬야 한다.`
  }
}

function metricSentence(metric: ArticleMetric) {
  const previous = metric.previous === undefined ? '' : `, 이전 ${metric.previous}`
  const interpretation = metric.interpretation ? ` ${metric.interpretation}` : ''

  return `${metric.label}은 ${metric.value}${previous}로 제시됐다.${interpretation}`
}

function eventSubject(event: ArticleEvent) {
  switch (event.kind) {
    case 'company':
    case 'distress':
      return event.company.ticker
    case 'macro':
      return event.indicator
    case 'listing':
      return event.ticker ?? event.companyName
    case 'foreign-market':
      return `${event.region}:${event.indexName}`
  }
}

function eventTicker(event: ArticleEvent) {
  switch (event.kind) {
    case 'company':
    case 'distress':
      return event.company.ticker
    case 'listing':
      return event.ticker
    case 'foreign-market':
      return event.linkedCompanies?.length === 1 ? event.linkedCompanies[0].ticker : undefined
    case 'macro':
      return undefined
  }
}

function defaultAmbiguity(kind: ArticleEventKind) {
  switch (kind) {
    case 'company':
      return 0.28
    case 'macro':
      return 0.36
    case 'distress':
      return 0.46
    case 'listing':
      return 0.42
    case 'foreign-market':
      return 0.34
  }
}

function titleDirection(impact: number) {
  if (impact > 0.018) return '재평가'
  if (impact > 0.004) return '긍정 해석'
  if (impact < -0.018) return '할인 확대'
  if (impact < -0.004) return '경계감'
  return '중립권'
}

function toneFromImpact(impact: number): NewsTone {
  if (impact > 0.004) return 'good'
  if (impact < -0.004) return 'bad'
  return 'neutral'
}

function distressSignalLabel(signal: DistressSignal) {
  switch (signal) {
    case 'liquidity':
      return '유동성'
    case 'audit':
      return '감사'
    case 'covenant':
      return '차입 약정'
    case 'governance':
      return '지배구조'
    case 'supply-chain':
      return '공급망'
    case 'legal':
      return '소송'
  }
}

function listingTypeLabel(type: ListingType) {
  switch (type) {
    case 'ipo':
      return '신규상장'
    case 'transfer':
      return '이전상장'
    case 'spac':
      return '스팩합병'
    case 'rights':
      return '유상증자'
  }
}

function formatList(items: readonly string[] | undefined, fallback: string) {
  if (!items?.length) return fallback
  if (items.length === 1) return items[0]

  return `${items.slice(0, -1).join(', ')}와 ${items[items.length - 1]}`
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`
}

function formatWon(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

function trimParagraphs(paragraphs: string[], maxParagraphs?: number) {
  if (maxParagraphs === undefined) return paragraphs

  return paragraphs.slice(0, Math.max(1, maxParagraphs))
}

function stableNoise(key: string) {
  return hashToInt(key) / 0xffffffff
}

function hashToInt(input: string) {
  let hash = 2166136261

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function clamp01(value: number) {
  return clamp(value, 0, 1)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

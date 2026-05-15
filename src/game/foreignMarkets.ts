export const FOREIGN_MARKET_CODES = ['US', 'JP'] as const
export type ForeignMarketCode = (typeof FOREIGN_MARKET_CODES)[number]

export const FOREIGN_CURRENCIES = ['USD', 'JPY'] as const
export type ForeignCurrency = (typeof FOREIGN_CURRENCIES)[number]

export const FOREIGN_INDEX_NAMES = ['NASDAQ', 'S&P Small', 'Nikkei Growth', 'TOPIX Core'] as const
export type ForeignIndexName = (typeof FOREIGN_INDEX_NAMES)[number]

export type ForeignTradeSide = 'buy' | 'sell'

export interface ForeignFxRates {
  USD: number
  JPY: number
}

export interface ForeignTaxRules {
  commissionRate: number
  minimumCommissionKrw: number
  sellTransactionTaxRate: number
  fxSpreadRate: number
  dividendWithholdingTaxRate: number
  dividendDomesticTopUpTaxRate: number
}

export interface ForeignMarketDefinition {
  code: ForeignMarketCode
  name: string
  country: string
  currency: ForeignCurrency
  indexNames: readonly ForeignIndexName[]
  lotSize: number
  priceTick: number
  taxRules: ForeignTaxRules
}

export interface ForeignTradeTaxInput {
  market: ForeignMarketCode
  side: ForeignTradeSide
  price: number
  quantity: number
  fxRates?: Partial<ForeignFxRates>
}

export interface ForeignTradeTaxEstimate {
  market: ForeignMarketCode
  side: ForeignTradeSide
  currency: ForeignCurrency
  quantity: number
  price: number
  fxRate: number
  grossForeign: number
  grossKrw: number
  commissionKrw: number
  transactionTaxKrw: number
  fxSpreadKrw: number
  totalFeesKrw: number
  totalTaxesKrw: number
  totalChargesKrw: number
  cashRequiredKrw: number
  netProceedsKrw: number
}

export interface ForeignDividendTaxInput {
  market: ForeignMarketCode
  grossDividend: number
  fxRates?: Partial<ForeignFxRates>
}

export interface ForeignDividendTaxEstimate {
  market: ForeignMarketCode
  currency: ForeignCurrency
  grossDividendForeign: number
  grossDividendKrw: number
  withholdingTaxForeign: number
  withholdingTaxKrw: number
  domesticTopUpTaxKrw: number
  totalDividendTaxKrw: number
  netDividendKrw: number
  effectiveTaxRate: number
}

export const DEFAULT_USD_KRW = 1368
export const DEFAULT_JPY_KRW = 8.85
export const DEFAULT_JPY_100_KRW = DEFAULT_JPY_KRW * 100

export const DEFAULT_FOREIGN_FX_RATES: ForeignFxRates = {
  USD: DEFAULT_USD_KRW,
  JPY: DEFAULT_JPY_KRW,
}

export const KOREA_FOREIGN_DIVIDEND_TAX_RATE = 0.154
export const US_DIVIDEND_WITHHOLDING_TAX_RATE = 0.15
export const JAPAN_DIVIDEND_WITHHOLDING_TAX_RATE = 0.15315
export const US_DIVIDEND_DOMESTIC_TOP_UP_TAX_RATE = 0.004
export const JAPAN_DIVIDEND_DOMESTIC_TOP_UP_TAX_RATE = 0.00085

export const FOREIGN_MARKETS: Record<ForeignMarketCode, ForeignMarketDefinition> = {
  US: {
    code: 'US',
    name: 'United States',
    country: 'United States',
    currency: 'USD',
    indexNames: ['NASDAQ', 'S&P Small'],
    lotSize: 1,
    priceTick: 0.01,
    taxRules: {
      commissionRate: 0.0008,
      minimumCommissionKrw: 700,
      sellTransactionTaxRate: 0.00003,
      fxSpreadRate: 0.0015,
      dividendWithholdingTaxRate: US_DIVIDEND_WITHHOLDING_TAX_RATE,
      dividendDomesticTopUpTaxRate: US_DIVIDEND_DOMESTIC_TOP_UP_TAX_RATE,
    },
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    country: 'Japan',
    currency: 'JPY',
    indexNames: ['Nikkei Growth', 'TOPIX Core'],
    lotSize: 100,
    priceTick: 1,
    taxRules: {
      commissionRate: 0.001,
      minimumCommissionKrw: 500,
      sellTransactionTaxRate: 0.0005,
      fxSpreadRate: 0.0012,
      dividendWithholdingTaxRate: JAPAN_DIVIDEND_WITHHOLDING_TAX_RATE,
      dividendDomesticTopUpTaxRate: JAPAN_DIVIDEND_DOMESTIC_TOP_UP_TAX_RATE,
    },
  },
}

export const US_MARKET_INDEX_NAMES = FOREIGN_MARKETS.US.indexNames
export const JAPAN_MARKET_INDEX_NAMES = FOREIGN_MARKETS.JP.indexNames

export function isForeignMarketCode(value: string): value is ForeignMarketCode {
  return (FOREIGN_MARKET_CODES as readonly string[]).includes(value)
}

export function getForeignMarket(market: ForeignMarketCode) {
  return FOREIGN_MARKETS[market]
}

export function normalizeForeignFxRates(fxRates: Partial<ForeignFxRates> = {}): ForeignFxRates {
  return {
    USD: positiveAmount(fxRates.USD) || DEFAULT_FOREIGN_FX_RATES.USD,
    JPY: positiveAmount(fxRates.JPY) || DEFAULT_FOREIGN_FX_RATES.JPY,
  }
}

export function getForeignFxRate(currency: ForeignCurrency, fxRates?: Partial<ForeignFxRates>) {
  return normalizeForeignFxRates(fxRates)[currency]
}

export function convertForeignToKrw(amount: number, currency: ForeignCurrency, fxRates?: Partial<ForeignFxRates>) {
  return positiveAmount(amount) * getForeignFxRate(currency, fxRates)
}

export function convertKrwToForeign(amountKrw: number, currency: ForeignCurrency, fxRates?: Partial<ForeignFxRates>) {
  const fxRate = getForeignFxRate(currency, fxRates)

  return positiveAmount(amountKrw) / fxRate
}

export function convertForeignPriceToKrw(
  market: ForeignMarketCode,
  price: number,
  fxRates?: Partial<ForeignFxRates>,
) {
  return roundKrw(convertForeignToKrw(price, FOREIGN_MARKETS[market].currency, fxRates))
}

export function convertKrwToForeignPrice(
  market: ForeignMarketCode,
  krwPrice: number,
  fxRates?: Partial<ForeignFxRates>,
) {
  return convertKrwToForeign(krwPrice, FOREIGN_MARKETS[market].currency, fxRates)
}

export function estimateForeignTradeTaxes(input: ForeignTradeTaxInput): ForeignTradeTaxEstimate {
  const market = FOREIGN_MARKETS[input.market]
  const quantity = Math.max(0, Math.floor(positiveAmount(input.quantity)))
  const price = positiveAmount(input.price)
  const grossForeign = price * quantity
  const fxRate = getForeignFxRate(market.currency, input.fxRates)
  const grossKrw = roundKrw(grossForeign * fxRate)
  const commissionKrw =
    grossKrw > 0 ? Math.max(market.taxRules.minimumCommissionKrw, roundUpKrw(grossKrw * market.taxRules.commissionRate)) : 0
  const transactionTaxKrw =
    input.side === 'sell' ? Math.floor(grossKrw * market.taxRules.sellTransactionTaxRate) : 0
  const fxSpreadKrw = grossKrw > 0 ? roundUpKrw(grossKrw * market.taxRules.fxSpreadRate) : 0
  const totalFeesKrw = commissionKrw + fxSpreadKrw
  const totalTaxesKrw = transactionTaxKrw
  const totalChargesKrw = totalFeesKrw + totalTaxesKrw

  return {
    market: input.market,
    side: input.side,
    currency: market.currency,
    quantity,
    price,
    fxRate,
    grossForeign,
    grossKrw,
    commissionKrw,
    transactionTaxKrw,
    fxSpreadKrw,
    totalFeesKrw,
    totalTaxesKrw,
    totalChargesKrw,
    cashRequiredKrw: input.side === 'buy' ? grossKrw + totalChargesKrw : 0,
    netProceedsKrw: input.side === 'sell' ? Math.max(0, grossKrw - totalChargesKrw) : 0,
  }
}

export function estimateForeignDividendTax(input: ForeignDividendTaxInput): ForeignDividendTaxEstimate {
  const market = FOREIGN_MARKETS[input.market]
  const grossDividendForeign = positiveAmount(input.grossDividend)
  const grossDividendKrw = roundKrw(convertForeignToKrw(grossDividendForeign, market.currency, input.fxRates))
  const withholdingTaxForeign = grossDividendForeign * market.taxRules.dividendWithholdingTaxRate
  const withholdingTaxKrw = Math.floor(convertForeignToKrw(withholdingTaxForeign, market.currency, input.fxRates))
  const domesticTopUpTaxKrw = Math.floor(grossDividendKrw * Math.max(0, market.taxRules.dividendDomesticTopUpTaxRate))
  const totalDividendTaxKrw = withholdingTaxKrw + domesticTopUpTaxKrw
  const netDividendKrw = Math.max(0, grossDividendKrw - totalDividendTaxKrw)
  const effectiveTaxRate = grossDividendKrw > 0 ? totalDividendTaxKrw / grossDividendKrw : 0

  return {
    market: input.market,
    currency: market.currency,
    grossDividendForeign,
    grossDividendKrw,
    withholdingTaxForeign,
    withholdingTaxKrw,
    domesticTopUpTaxKrw,
    totalDividendTaxKrw,
    netDividendKrw,
    effectiveTaxRate,
  }
}

function positiveAmount(value: number | undefined) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0
}

function roundKrw(value: number) {
  return Math.round(value)
}

function roundUpKrw(value: number) {
  return Math.ceil(value)
}

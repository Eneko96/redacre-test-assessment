export type Rates = {
  currency_from: string
  amount_1: number
  currency_to: string
  amount_2: number
  type: string
  consumed_date: string
}

export type Filter = {
  date_from: string
  date_to: string
  type: string
}

export type Tool = {
  from: string[]
  to: string[]
}

export type ExchangeForm = {
  currency_from: string
  amount_1: number
  amount_2: number
  currency_2: string
}

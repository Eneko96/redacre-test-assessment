import { ChangeEvent, useCallback, useState } from 'react'
import { ExchangeForm, Rates } from '../../types/global'
import { retrieveForm } from './utils'

interface UseHeader {
  latest: Rates[]
  ref: React.RefObject<HTMLFormElement>
}

// This is the hook that will be used in the Header component
// It will be used to handle the form submission
// and the state of the form
export const useHeader = ({ latest, ref }: UseHeader) => {
  const [amount, setAmount] = useState(0)
  const [amount2, setAmount2] = useState(0)
  const pushExchange = async ({
    currencyFrom,
    amount1,
    amount2,
    currencyTo,
  }: {
    currencyFrom: string
    amount1: number
    amount2: number
    currencyTo: string
  }) => {
    const data = await fetch('http://127.0.0.1:4500/rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency_from: currencyFrom,
        amount_1: amount1,
        amount_2: amount2,
        currency_to: currencyTo,
      }),
    })
    return await data.status
  }

  // This is the function that will be called whenever the first amount changes
  const handleAmount1 = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const form = ref.current
      if (form) {
        const formData = new FormData(form)
        const dataForm = Object.fromEntries(formData) as unknown as ExchangeForm
        const dataFind = latest.find(
          (item) =>
            item.currency_from === dataForm.currency_from &&
            item.currency_to === dataForm.currency_2.toLowerCase(),
        )
        if (dataFind) {
          setAmount(Number(dataForm.amount_1) * Number(dataFind.amount_2))
          setAmount2(+e.target.value)
        }
      }
    },
    [latest],
  )

  // This is the function that will be called whenever the second amount changes
  const handleAmount2 = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const form = ref.current
      if (form) {
        const formData = new FormData(form)
        const dataForm = Object.fromEntries(formData) as unknown as ExchangeForm
        const dataFind = latest.find(
          (item) =>
            item.currency_from === dataForm.currency_from &&
            item.currency_to === dataForm.currency_2.toLowerCase(),
        )
        if (dataFind) {
          setAmount(+e.target.value)
          if (+e.target.value !== 0) {
            {
              setAmount2(Number(e.target.value) / Number(dataFind.amount_2))
            }
          } else setAmount2(0)
        }
      }
    },
    [latest],
  )

  // This is the function that will be called whenever the currency to dropdown changes
  const handleCurrencyTo = useCallback(() => {
    const form = ref.current
    if (form) {
      const dataForm = retrieveForm(form)
      const dataFind = latest.find(
        (item) =>
          item.currency_from === dataForm.currency_from &&
          item.currency_to === dataForm.currency_2,
      )
      if (dataFind) {
        setAmount(Number(dataForm.amount_1) * Number(dataFind.amount_2))
      }
    }
  }, [latest])

  // This is the function that will be called whenever the currency from dropdown changes
  const handleCurrencyFrom = useCallback(() => {
    const form = ref.current
    if (form) {
      const dataForm = retrieveForm(form)
      const dataFind = latest.find(
        (item) =>
          item.currency_from.toLowerCase() ===
            dataForm.currency_from.toLowerCase() &&
          item.currency_to === dataForm.currency_2.toLowerCase(),
      )
      if (dataFind) {
        setAmount(Number(dataForm.amount_1) * Number(dataFind.amount_2))
      }
    }
  }, [latest])

  return {
    pushExchange,
    handleAmount1,
    handleAmount2,
    handleCurrencyTo,
    handleCurrencyFrom,
    amount,
    amount2,
    setAmount,
    setAmount2,
  }
}

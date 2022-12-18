import { FormEvent, useCallback, useRef } from 'react'
import Dropdown from '../../components/Dropdown'
import Toolbar from '../../components/Toolbar'
import { icons, retrieveForm } from './utils'
import { useHeader } from './useHeader'
import { Rates, Tool } from '../../types/global'
import './styles.css'

// this is the header component
// it will handle the exchange

interface HeaderProps {
  data: Rates[]
  tools: Tool
  latest: Rates[]
  onCreated: () => void
}

export const Header: React.FC<HeaderProps> = ({
  data,
  tools,
  latest,
  onCreated,
}) => {
  const ref = useRef<HTMLFormElement>(null)
  const {
    pushExchange,
    handleAmount1,
    handleAmount2,
    handleCurrencyFrom,
    handleCurrencyTo,
    amount,
    amount2,
  } = useHeader({ latest, ref })

  // handle save
  // it will call the pushExchange function
  // if the response is 201, it will call the onCreated function
  const handleSave = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.target as unknown as HTMLFormElement
      const dataForm = retrieveForm(form)
      const val = await pushExchange({
        currencyFrom: dataForm.currency_from,
        amount1: dataForm.amount_1,
        amount2: dataForm.amount_2,
        currencyTo: dataForm.currency_2,
      })
      if (val === 201) {
        onCreated()
      }
    },
    [latest],
  )

  return (
    <Toolbar title={'Exchange'} onSubmit={handleSave} ref={ref}>
      <Toolbar.Left>
        <div className="header-select">
          <label>Currency from</label>
          <Dropdown
            size="large"
            name="currency_from"
            onChange={handleCurrencyFrom}
            items={
              data && data.length && tools.from.length && tools.from.length
                ? tools.from.map((tool) => ({
                    name: tool,
                    value: tool,
                    icon: icons(tool.toLowerCase()),
                  }))
                : [{ name: 'Loading...', value: 'loading', icon: null }]
            }
          />
        </div>
        <div className="input">
          <label>Amount</label>
          <input name="amount_1" value={amount2} onChange={handleAmount1} />
        </div>
      </Toolbar.Left>
      <Toolbar.Right>
        <div className="header-select">
          <label>Currency to</label>
          <Dropdown
            size="large"
            name="currency_2"
            onChange={handleCurrencyTo}
            items={
              data && data.length && tools.from.length && tools.to.length
                ? tools.to.map((tool) => ({
                    name: tool.toUpperCase(),
                    value: tool,
                    icon: icons(tool.toLowerCase()),
                  }))
                : [{ name: 'Loading...', value: 'loading', icon: null }]
            }
          />
        </div>
        <div className="input">
          <label>Amount</label>
          <input name="amount_2" value={amount} onChange={handleAmount2} />
        </div>
      </Toolbar.Right>
    </Toolbar>
  )
}

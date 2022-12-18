import React, { useEffect } from 'react'
import { classNames } from '../../utils/classNames'
import './styles.css'

type Item = {
  icon?: any
  name: string
  value: string
}

interface DropdownProps {
  items: Item[]
  name?: string
  className?: string
  size?: 'medium' | 'large'
  onChange: (e: any) => void
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  className,
  name,
  onChange,
  size = '',
}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<Item | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)
  const refSelect = React.useRef<HTMLSelectElement>(null)

  // Handle change on select element
  // also will set the value of the toggle
  // and close the dropdown
  const handleChange = (item: Item) => {
    if (refSelect.current) refSelect.current.value = item.value
    setOpen(false)
    setValue(item)
    onChange(item.name)
  }

  // Handle click outside the dropdown
  const handleClickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false)
    }
  }

  // Add event listener on mount for click outside
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={classNames('dropdown', className)}>
      <div
        className={classNames(
          'dropdown-toggle',
          size === 'large' ? 'large' : '',
        )}
        onClick={() => setOpen(!open)}
        tabIndex={0}
      >
        {value ? (
          <>
            {value.icon && <img src={value.icon} alt="ripple" />}
            {value.name}
          </>
        ) : (
          <>
            {items[0].icon && <img src={items[0].icon} alt="ripple" />}
            {items[0].name}
          </>
        )}
      </div>
      <select ref={refSelect} name={name} hidden>
        {items.length &&
          items.map((item) => {
            return <option key={item.name} value={item.value} />
          })}
      </select>
      {open && (
        <div
          className={classNames(
            'dropdown-menu',
            size === 'large' ? 'large' : '',
          )}
        >
          {items.length ? (
            items.map((item) => {
              return (
                <div
                  key={item.name}
                  onClick={() => handleChange(item)}
                  className="dropdown-item"
                >
                  {item.icon && <img src={item.icon} alt="ripple" />}
                  {item.name}
                </div>
              )
            })
          ) : (
            <div className="dropdown-item">Loading...</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dropdown

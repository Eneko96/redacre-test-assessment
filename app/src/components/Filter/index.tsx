import Dropdown from '../Dropdown'
import './styles.css'

interface FilterProps {
  onFilter: (options: any) => void
}
// Simple form with 3 inputs and a submit button
// The submit button will call the onFilter function
// with the data from the form
export const Filter: React.FC<FilterProps> = ({ onFilter }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as unknown as HTMLFormElement
    const formData = new FormData(form)
    const dataForm = Object.fromEntries(formData) as any
    onFilter(dataForm)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="filter-toolset">
        <input type="date" name="date_from" />
        <input type="date" name="date_to" />
        <Dropdown
          items={[
            { name: 'All', value: 'all' },
            { name: 'Live Rate', value: 'Live Rate' },
            { name: 'Exchanged', value: 'Exchanged' },
          ]}
          name="type"
          onChange={() => null}
        />
        <button type="submit" className="filter-toolset-submit">
          Filter
        </button>
      </div>
    </form>
  )
}

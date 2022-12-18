import { Pagination } from '../../components/Pagination'
import Table from '../../components/Table'
import upsort from '../../assets/upsort.svg'
import downsort from '../../assets/downsort.svg'
import { useDataTable } from './useDataTable'
import { Filter, Rates } from '../../types/global'

interface DataTableProps {
  data: Rates[]
  filter: Filter
}

// DataTable component
// This component will show a table with the data
// and will handle the sorting and pagination
export const DataTable: React.FC<DataTableProps> = ({ data, filter }) => {
  const { setSort, sort, sortedData, setPage, pages, pageDivisor } =
    useDataTable({
      data,
      filter,
    })

  const handleSorting = () => setSort(!sort)

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <img
                src={sort ? upsort : downsort}
                alt="upsort"
                style={{ marginRight: '9px' }}
                onClick={handleSorting}
              />
              Date & Time
            </Table.Th>
            <Table.Th>Currency Form</Table.Th>
            <Table.Th>Amount1</Table.Th>
            <Table.Th>Currency To</Table.Th>
            <Table.Th>Amount2</Table.Th>
            <Table.Th>Type</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.length
            ? sortedData()
                .slice(pageDivisor - 1, pageDivisor + 9)
                .map((item: any, index) => (
                  <Table.Tr key={'table-tr-body' + index}>
                    <Table.Td>
                      {new Date(item.consumed_date).toLocaleString()}
                    </Table.Td>
                    <Table.Td>{item.currency_from}</Table.Td>
                    <Table.Td>{item.amount_1}</Table.Td>
                    <Table.Td>{item.currency_to?.toUpperCase()}</Table.Td>
                    <Table.Td>{item.amount_2}</Table.Td>
                    <Table.Td
                      type={item.type === 'Live Rate' ? 'live' : 'exchange'}
                    >
                      {item.type}
                    </Table.Td>
                  </Table.Tr>
                ))
            : null}
        </Table.Tbody>
      </Table>
      <Pagination pages={sortedData().length / 10} onChange={setPage} />
    </>
  )
}

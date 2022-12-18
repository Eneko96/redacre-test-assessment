import { Thead, Tbody, Tr, Th, Td } from './TElements'
import './styles.css'

interface TableProps {
  children: React.ReactNode | React.ReactNode[]
}

interface CompositeTableProps {
  Thead: typeof Thead
  Tbody: typeof Tbody
  Tr: typeof Tr
  Th: typeof Th
  Td: typeof Td
}
// Table created in a HTML like way
// Table.Tbody, Table.Thead, Table.Tr, Table.Th, Table.Td
// are the same as Tbody, Thead, Tr, Th, Td
// but they are nested inside Table
// so they can be used as Table.Tbody, Table.Thead, Table.Tr, Table.Th, Table.Td
// instead of Tbody, Thead, Tr, Th, Td
// and they will be rendered inside Table
// The main point of this is to avoid having to import all the elements
// and work with the components as if they were HTML elements
const Table: React.FC<TableProps> & CompositeTableProps = ({ children }) => {
  return <table>{children}</table>
}

Table.Tbody = Tbody
Table.Thead = Thead
Table.Tr = Tr
Table.Th = Th
Table.Td = Td

export default Table

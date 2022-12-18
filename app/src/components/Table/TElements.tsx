interface TheadProps {
  children: React.ReactNode | React.ReactNode[]
}

export const Thead: React.FC<TheadProps> = ({ children }) => {
  return (
    <thead>
      {children}
    </thead>
  )
}

interface TbodyProps {
  children: React.ReactNode | React.ReactNode[]
}

export const Tbody: React.FC<TbodyProps> = ({ children }) => {
  return (
    <tbody>
      {children}
    </tbody>
  )
}

interface TrProps {
  children: React.ReactNode | React.ReactNode[]
}

export const Tr: React.FC<TrProps> = ({ children }) => {
  return (
    <tr>
      {children}
    </tr>
  )
}

interface ThProps {
  children: React.ReactNode | React.ReactNode[]
}

export const Th: React.FC<ThProps> = ({ children }) => {
  return (
    <th>
      {children}
    </th>
  )
}

interface TdProps {
  children: React.ReactNode | React.ReactNode[]
  type?: 'exchange' | 'live'
}

export const Td: React.FC<TdProps> = ({ children, type }) => {
  const classType = () => {
    if (type === 'exchange') {
      return 'exchange'
    } else if (type === 'live') {
      return 'live'
    }
    return ''
  }
  return (
    <td className={classType()}>
      {children}
    </td>
  )
}

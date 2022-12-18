import React, { useCallback, useMemo, useState } from 'react'
import { Rates } from '../../types/global'

interface Filter {
  date_from: string
  date_to: string
  type: string
}

interface UseDataTable {
  data: Rates[]
  filter: Filter
}
// This hook will be used in the DataTable component
// It will be used to handle the filtering of the data
// and the state of the filter
export const useDataTable = ({ data, filter }: UseDataTable) => {
  const [sort, setSort] = useState(false)
  const [page, setPage] = useState(1)

  // This function will be used to filter the data
  // based on the filter state
  const handleFilter = (filter: Filter) => {
    const { date_from, date_to, type } = filter
    if (!date_from || !date_to) return data
    const filteredData = data.filter((item) => {
      const date = new Date(item.consumed_date).getTime()
      const dateFrom = new Date(date_from).getTime()
      const dateTo = new Date(date_to).getTime()
      if (type === 'all') {
        return date >= dateFrom && date <= dateTo
      }
      return date >= dateFrom && date <= dateTo && item.type === type
    })
    return filteredData
  }

  // This function will be used to sort the data
  // based on the sort state
  const sortData = useMemo(
    () =>
      data.sort((a, b) =>
        sort
          ? new Date(a.consumed_date).getTime() -
            new Date(b.consumed_date).getTime()
          : new Date(b.consumed_date).getTime() -
            new Date(a.consumed_date).getTime(),
      ),
    [data, sort],
  )

  // This function will be used to paginate the data
  // based on the page state
  const sortedData = () => {
    if (sort) return sortData
    if (filter) return handleFilter(filter)
    return data
  }

  // This function will be used to paginate the data
  const pages = useMemo(() => Math.round(data.length / 10), [data])

  // This function spare the data to be displayed
  const pageDivisor = useMemo(() => {
    if (page === 1) {
      return 1
    }
    return (page - 1) * 10
  }, [page])

  return {
    sortedData,
    pageDivisor,
    setSort,
    sort,
    page,
    setPage,
    pages,
  }
}

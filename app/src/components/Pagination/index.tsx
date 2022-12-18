import { useMemo, useState } from 'react'
import { classNames } from '../../utils/classNames'
import './styles.css'
import { LeftIcon } from '../../assets/Left'
import { Right } from '../../assets/Right'

interface PaginationProps {
  pages: number
  className?: string
  onChange: (page: number) => void
  [key: string]: any
}

export const Pagination: React.FC<PaginationProps> = ({
  pages,
  className,
  onChange,
  ...rest
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [active, setActive] = useState(1)
  const pagesAmount: number[] = useMemo(
    () => Array.from({ length: pages }, (_, i) => i + 1),
    [pages],
  )
  const handlePage = (type: 'minus' | 'plus') => {
    if (type === 'minus' && active > 1) {
      setActive((prev) => prev - 1)
      onChange(active - 1)
    } else if (type === 'plus' && active < pages - 1) {
      setActive((prev) => prev + 1)
      onChange(active + 1)
    }
    if (type === 'minus' && currentPage > 1 && active === currentPage + 1) {
      setCurrentPage((prev) => prev - 1)
    } else if (type === 'plus') {
      if (currentPage + 3 < pages - 1 && active > currentPage + 2) {
        setCurrentPage((prev) => prev + 1)
      }
    }
  }

  const handleActive = (page: number) => {
    setActive(page)
    onChange(page)
  }

  return (
    <div className={classNames('pagination', className)} {...rest}>
      <button
        className="pagination-handler"
        onClick={() => handlePage('minus')}
        type="button"
      >
        <LeftIcon />
        Previous
      </button>
      <button
        className={classNames('pagination-page', active === 1 ? 'active' : '')}
        onClick={() => {
          handleActive(pagesAmount[0])
          setCurrentPage(1)
        }}
      >
        {pagesAmount[0]}
      </button>
      {currentPage > 2 && <button className="pagination-handler">...</button>}
      {pagesAmount.slice(currentPage, currentPage + 3).map((page) => {
        if (page === pagesAmount.at(-1) || page === pagesAmount[0]) return null
        return (
          <button
            key={page}
            className={classNames(
              'pagination-page',
              page === active ? 'active' : '',
            )}
            onClick={() => handleActive(page)}
          >
            {page}
          </button>
        )
      })}
      {currentPage + 4 < pages && (
        <button className="pagination-page">...</button>
      )}
      <button
        className={classNames(
          'pagination-page',
          pagesAmount.at(-1) === active ? 'active' : '',
        )}
        onClick={() => {
          handleActive(pagesAmount.at(-1) as number)
          setCurrentPage(pagesAmount.at(-5) as number)
        }}
      >
        {pagesAmount.at(-1)}
      </button>
      <button
        className="pagination-handler"
        onClick={() => handlePage('plus')}
        type="button"
      >
        Next
        <Right />
      </button>
    </div>
  )
}

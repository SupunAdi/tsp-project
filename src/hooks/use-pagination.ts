import { useMemo, useState } from "react"

export function usePagination(total: number, initialSize = 10) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialSize)

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)

  // when pageSize changes we usually jump back to page 1
  const changePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const next = () => setPage((p) => Math.min(pageCount, p + 1))
  const prev = () => setPage((p) => Math.max(1, p - 1))

  const range = useMemo(() => {
    const start = total ? (safePage - 1) * pageSize + 1 : 0
    const end = Math.min(safePage * pageSize, total)
    return { start, end }
  }, [safePage, pageSize, total])

  return { page: safePage, setPage, pageSize, setPageSize: changePageSize, next, prev, pageCount, range }
}

// small helper for compact page list: 1 … (p-1) p (p+1) … last
export function visiblePages(page: number, pageCount: number) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const out: (number | "…")[] = [1]
  if (page > 3) out.push("…")
  for (let p = Math.max(2, page - 1); p <= Math.min(pageCount - 1, page + 1); p++) out.push(p)
  if (page < pageCount - 2) out.push("…")
  out.push(pageCount)
  return out
}
